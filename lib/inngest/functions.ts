import {inngest} from "@/lib/inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendDailyNewsEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {connectToDatabase} from "@/database/mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const sendSignUpEmail = inngest.createFunction(
    {id: 'sign-up-email'},
    {event: 'app/user.created'},
    async ({event, step}) => {
        console.log('Inngest function triggered for event:', event.name);

        const userProfile = `
        - Country: ${event.data.country}
        - Investment Goals: ${event.data.investmentGoals}
        - Risk Tolerance: ${event.data.riskTolerance}
        - Preferred Industry: ${event.data.preferredIndustry}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        const introText = await step.run('generate-welcome-intro', async () => {
            console.log('Generating welcome intro using Gemini...');
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await model.generateContent(prompt);
                return result.response.text() || 'Thanks for joining NextTrade! Start investing smarter using our tools!';
            } catch (error) {
                console.error('Gemini API error:', error);
                return 'Thanks for joining NextTrade! Start investing smarter using our tools!';
            }
        });

        await step.run('send-welcome-email', async () => {
            const {data: {email, name}} = event;
            console.log(`Sending welcome email to: ${email}`);
            const result = await sendWelcomeEmail({email, name, intro: introText});
            console.log('Email sent successfully');
            return result;
        });

        return {success: true, message: 'Welcome email sent successfully'};
    }
);

export const sendDailyMarketNews = inngest.createFunction(
    {id: 'daily-market-news'},
    {cron: '0 9 * * *'},
    async ({step}) => {
        const users = await step.run('fetch-users', async () => {
            const mongoose = await connectToDatabase();
            const db = mongoose.connection.db;
            if (!db) throw new Error('Database connection failed');
            return await db.collection('user').find({}, {projection: {email: 1}}).toArray();
        });

        if (users.length === 0) return {message: 'No users found'};

        const newsSummary = await step.run('generate-market-news', async () => {
            const placeholderNews = "NVIDIA (NVDA) hits new all-time high as AI demand surges. Federal Reserve signals potential rate cuts in late 2025. Bitcoin (BTC) stabilizes above $90,000.";
            const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', placeholderNews);

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await model.generateContent(prompt);
                return result.response.text() || 'Market is looking positive today!';
            } catch (error) {
                console.error('Gemini API error:', error);
                return 'Market is looking positive today! Check your dashboard for latest updates.';
            }
        });

        for (const user of users) {
            await step.run(`send-news-email-${user.email}`, async () => {
                await sendDailyNewsEmail({email: user.email, newsContent: newsSummary});
            });
        }

        return {success: true, message: `Daily news sent to ${users.length} users`};
    }
);