import {inngest} from "@/inngest/client";
import {connectToDatabase} from "@/database/mongoose";
import Alert from "@/database/models/alert.model";
import User from "@/database/models/user.model";
import {getQuote} from "@/lib/actions/finnhub.actions";
import {sendStockAlertUpperEmail, sendStockAlertLowerEmail} from "@/lib/nodemailer";

export const checkPriceAlerts = inngest.createFunction(
    {id: 'check-price-alerts'},
    {cron: '* * * * *'}, // Every minute
    async ({step}) => {
        const activeAlerts = await step.run('get-active-alerts', async () => {
            await connectToDatabase();
            return Alert.find({isActive: true});
        });

        if (!activeAlerts || activeAlerts.length === 0) return {message: "No active alerts"};

        // Group by symbol to minimize API calls
        const symbols = [...new Set(activeAlerts.map(a => a.symbol))];

        for (const symbol of symbols) {
            await step.run(`check-symbol-${symbol}`, async () => {
                const quote = await getQuote(symbol);
                if (!quote) return;

                const currentPrice = quote.c;
                const symbolAlerts = activeAlerts.filter(a => a.symbol === symbol);

                for (const alert of symbolAlerts) {
                    let triggered = false;
                    if (alert.condition === 'above' && currentPrice > alert.targetPrice) {
                        triggered = true;
                    } else if (alert.condition === 'below' && currentPrice < alert.targetPrice) {
                        triggered = true;
                    }

                    if (triggered) {
                        // Check frequency
                        const now = new Date();
                        let shouldTrigger = false;

                        if (!alert.lastTriggeredAt) {
                            shouldTrigger = true;
                        } else {
                            const diffMs = now.getTime() - new Date(alert.lastTriggeredAt).getTime();
                            const diffMins = diffMs / (1000 * 60);

                            if (alert.frequency === 'once' && !alert.isTriggered) {
                                shouldTrigger = true;
                            } else if (alert.frequency === 'per_minute' && diffMins >= 1) {
                                shouldTrigger = true;
                            } else if (alert.frequency === 'per_hour' && diffMins >= 60) {
                                shouldTrigger = true;
                            } else if (alert.frequency === 'per_day' && diffMins >= 1440) {
                                shouldTrigger = true;
                            }
                        }

                        if (shouldTrigger) {
                            // Get user
                            const mongoose = await connectToDatabase();
                            const db = mongoose.connection.db;
                            // Use direct DB access for user if User model doesn't work perfectly with Better Auth's collection
                            const user = await db?.collection('user').findOne({_id: alert.userId}) || await User.findById(alert.userId);

                            if (user) {
                                const timestamp = new Date().toLocaleString();
                                if (alert.condition === 'above') {
                                    await sendStockAlertUpperEmail({
                                        email: user.email,
                                        symbol: alert.symbol,
                                        company: alert.companyName,
                                        currentPrice,
                                        targetPrice: alert.targetPrice,
                                        timestamp
                                    });
                                } else {
                                    await sendStockAlertLowerEmail({
                                        email: user.email,
                                        symbol: alert.symbol,
                                        company: alert.companyName,
                                        currentPrice,
                                        targetPrice: alert.targetPrice,
                                        timestamp
                                    });
                                }

                                // Update alert
                                await Alert.findByIdAndUpdate(alert._id, {
                                    isTriggered: true,
                                    lastTriggeredAt: now,
                                    isActive: alert.frequency === 'once' ? false : true
                                });
                            }
                        }
                    }
                }
            });
        }
        return {processedSymbols: symbols.length};
    }
);
