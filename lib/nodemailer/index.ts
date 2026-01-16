import nodemailer from 'nodemailer';
import {
    NEWS_SUMMARY_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    WATCHLIST_SUMMARY_EMAIL_TEMPLATE,
    STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
    STOCK_ALERT_LOWER_EMAIL_TEMPLATE ,

} from "@/lib/nodemailer/templates";


export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.NODEMAILER_USER!,
        pass: process.env.NODEMAILER_PASS!,
    }
})


export const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro);


    const mailOptions = {
        from: `"NextTrade <NextTrade Team@NextTrade.com>"`,
        to: email,
        subject: `Welcome to NextTrade! Start Your Investment Journey Today`,
        text: `Welcome to NextTrade, ${name}! ${intro}`,
        html: htmlTemplate,
    };


    await transporter.sendMail(mailOptions);
}

export const sendDailyNewsSummaryEmail = async ({email, newsContent, date}: {
    email: string,
    newsContent: string,
    date: string
}) => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{newsContent}}', newsContent)
        .replace('{{date}}', date);

    const mailOptions = {
        from: `"NextTrade" <news@nexttrade.com>`,
        to: email,
        subject: `📰 Market News Summary - ${date}`,
        text: `Here is your daily market summary from NextTrade.`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
}

export const sendWatchlistSummaryEmail = async ({
                                                    email,
                                                    name,
                                                    date,
                                                    totalStocks,
                                                    stocksTable,
                                                    topGainerSymbol,
                                                    topGainerChange,
                                                    topLoserSymbol,
                                                    topLoserChange,
                                                    aiSummary
                                                }: {
    email: string;
    name: string;
    date: string;
    totalStocks: number;
    stocksTable: string;
    topGainerSymbol: string;
    topGainerChange: string;
    topLoserSymbol: string;
    topLoserChange: string;
    aiSummary?: string;
}) => {
    let aiSummarySection = '';
    if (aiSummary) {
        aiSummarySection = `
            <div style="background-color: #1e1e1e; border-left: 4px solid #34d399; border-radius: 4px; padding: 20px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #ffffff;">🤖 AI Market Analysis</h3>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #CCDADC;">${aiSummary}</p>
            </div>
        `;
    }

    const htmlTemplate = WATCHLIST_SUMMARY_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{date}}', date)
        .replace('{{totalStocks}}', totalStocks.toString())
        .replace('{{stocksTable}}', stocksTable)
        .replace('{{topGainerSymbol}}', topGainerSymbol)
        .replace('{{topGainerChange}}', topGainerChange)
        .replace('{{topLoserSymbol}}', topLoserSymbol)
        .replace('{{topLoserChange}}', topLoserChange)
        .replace('{{aiSummarySection}}', aiSummarySection);

    const mailOptions = {
        from: `"NextTrade" <watchlist@nexttrade.com>`,
        to: email,
        subject: `📊 Your Watchlist Summary - ${date}`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendStockAlertUpperEmail = async ({
                                                   email, symbol, company, currentPrice, targetPrice, timestamp
                                               }: {
    email: string,
    symbol: string,
    company: string,
    currentPrice: number | string,
    targetPrice: number | string,
    timestamp: string
}) => {
    const htmlTemplate = STOCK_ALERT_UPPER_EMAIL_TEMPLATE
        .replace(/{{symbol}}/g, symbol)
        .replace(/{{company}}/g, company)
        .replace(/{{currentPrice}}/g, currentPrice.toString())
        .replace(/{{targetPrice}}/g, targetPrice.toString())
        .replace(/{{timestamp}}/g, timestamp);

    const mailOptions = {
        from: `"NextTrade Alerts" <alerts@nexttrade.com>`,
        to: email,
        subject: `📈 Price Alert: ${symbol} Hit Upper Target!`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

export const sendStockAlertLowerEmail = async ({
                                                   email, symbol, company, currentPrice, targetPrice, timestamp
                                               }: {
    email: string,
    symbol: string,
    company: string,
    currentPrice: number | string,
    targetPrice: number | string,
    timestamp: string
}) => {
    const htmlTemplate = STOCK_ALERT_LOWER_EMAIL_TEMPLATE
        .replace(/{{symbol}}/g, symbol)
        .replace(/{{company}}/g, company)
        .replace(/{{currentPrice}}/g, currentPrice.toString())
        .replace(/{{targetPrice}}/g, targetPrice.toString())
        .replace(/{{timestamp}}/g, timestamp);

    const mailOptions = {
        from: `"NextTrade Alerts" <alerts@nexttrade.com>`,
        to: email,
        subject: `📉 Price Alert: ${symbol} Hit Lower Target!`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

