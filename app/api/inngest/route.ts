import {serve} from "inngest/next";
import {inngest} from "@/inngest/client";
import {
    sendSignUpEmail,
    sendDailyNewsSummary,
    watchlistSummaryEmail,
    watchlistWeeklySummary,
    checkPriceAlerts
} from "@/inngest";

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [
        sendSignUpEmail,
        sendDailyNewsSummary,
        watchlistSummaryEmail,
        watchlistWeeklySummary,
        checkPriceAlerts
    ],
});