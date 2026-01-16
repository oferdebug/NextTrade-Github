'use server';

import {connectToDatabase} from "@/database/mongoose";
import Alert from "@/database/models/alert.model";
import {auth} from "@/lib/better-auth/auth";
import {headers} from "next/headers";
import {revalidatePath} from "next/cache";

/**
 * Interface for updating alert fields.
 * Only allows modification of specific fields to maintain data integrity.
 */
export interface UpdateAlertData {
    targetPrice?: number;
    condition?: 'above' | 'below';
    frequency?: 'once' | 'per_minute' | 'per_hour' | 'per_day';
    isActive?: boolean;
}

/**
 * Create a new price alert for a user.
 */
export async function createAlert(data: {
    symbol: string;
    companyName: string;
    condition: 'above' | 'below';
    targetPrice: number;
    frequency?: 'once' | 'per_minute' | 'per_hour' | 'per_day';
}) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return {success: false, error: "Unauthorized"};

        await connectToDatabase();
        const alert = await Alert.create({
            userId: session.user.id,
            ...data,
            symbol: data.symbol.toUpperCase()
        });

        revalidatePath("/watchlist");
        return {success: true, data: JSON.parse(JSON.stringify(alert))};
    } catch (error) {
        console.error("Error in createAlert:", error);
        return {success: false, error: "Failed to create alert"};
    }
}

/**
 * Get alerts for the current user.
 */
export async function getAlerts(activeOnly: boolean = false) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return [];

        await connectToDatabase();
        const query: any = {userId: session.user.id};
        if (activeOnly) query.isActive = true;

        const alerts = await Alert.find(query).sort({createdAt: -1});
        return JSON.parse(JSON.stringify(alerts));
    } catch (error) {
        console.error("Error in getAlerts:", error);
        return [];
    }
}

/**
 * Update an existing alert.
 */
export async function updateAlert(alertId: string, data: UpdateAlertData) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return {success: false, error: "Unauthorized"};

        await connectToDatabase();
        await Alert.findOneAndUpdate(
            {_id: alertId, userId: session.user.id},
            data,
            {new: true}
        );

        revalidatePath("/watchlist");
        return {success: true};
    } catch (error) {
        console.error("Error in updateAlert:", error);
        return {success: false, error: "Failed to update alert"};
    }
}

/**
 * Delete an alert.
 */
export async function deleteAlert(alertId: string) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return {success: false, error: "Unauthorized"};

        await connectToDatabase();
        await Alert.deleteOne({_id: alertId, userId: session.user.id});

        revalidatePath("/watchlist");
        return {success: true};
    } catch (error) {
        console.error("Error in deleteAlert:", error);
        return {success: false, error: "Failed to delete alert"};
    }
}

/**
 * Get all alerts for a specific stock symbol for the current user.
 */
export async function getAlertsForSymbol(symbol: string) {
    try {
        const session = await auth.api.getSession({headers: await headers()});
        if (!session?.user) return [];

        await connectToDatabase();
        const alerts = await Alert.find({
            userId: session.user.id,
            symbol: symbol.toUpperCase()
        }).sort({createdAt: -1});

        return JSON.parse(JSON.stringify(alerts));
    } catch (error) {
        console.error("Error in getAlertsForSymbol:", error);
        return [];
    }
}
