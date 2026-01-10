'use server';

import {connectToDatabase} from "@/database/mongoose";
import Watchlist from "@/database/models/watchlist.model";

/**
 * Retrieve the list of watchlist ticker symbols for the user identified by the given email.
 *
 * @param email - The user's email address used to locate their watchlist
 * @returns An array of watchlist symbols for the user; returns an empty array if the user is not found or on error
 */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            console.error("Database connection not established");
            return [];
        }

        // Find the user by email in the 'user' collection (Better Auth)
        const user = await db.collection('user').findOne({email});

        if (!user) {
            return [];
        }

        // Query the Watchlist by userId
        // Note: Better Auth usually uses 'id' or '_id'. 
        // Based on lib/actions/user.actions.ts, it uses user.id || user._id
        const userId = user.id || user._id.toString();

        const watchlistItems = await Watchlist.find({userId});

        return watchlistItems.map(item => item.symbol);
    } catch (error: unknown) {
        console.error("Error in getWatchlistSymbolsByEmail:", error);
        return [];
    }
}


/**
 * Add a stock (ticker and company) to the watchlist of the user identified by email.
 *
 * @param symbol - The stock ticker symbol to add (case-insensitive; will be uppercased)
 * @param company - The company name associated with the symbol
 * @param email - The user's email address used to locate their account
 * @returns An object with `success: true` on successful addition. If the entry already exists, returns `success: true` and a `message` of `"Already in watchlist"`. On failure returns `success: false` and an `error` message describing the failure.
 */
export async function addToWatchlist(
    symbol: string,
    company: string,
    email: string
) {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            console.error("Database connection not established");
            return {success: false, error: "Database connection failed"};
        }

        // Find the user by email in the 'user' collection (Better Auth)
        const user = await db.collection("user").findOne({email});
        if (!user) {
            console.error("User not found");
            return {success: false, error: "User not found"};
        }

        const userId = user.id || user._id.toString();

        await Watchlist.create({
            userId,
            symbol: symbol.toUpperCase(),
            company
        });

        return {success: true};
    } catch (error: unknown) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
            return {success: true, message: "Already in watchlist"};
        }
        console.error("Error in addToWatchlist:", error);
        return {success: false, error: "Failed to add to watchlist"};
    }
}

/**
 * Remove a stock symbol from the watchlist of the user identified by email.
 *
 * @param symbol - The stock symbol to remove (case-insensitive)
 * @param email - The user's email address used to identify their account
 * @returns An object with `success: true` when the entry was removed; `success: false` and an `error` message otherwise
 */
export async function removeFromWatchlist(symbol: string, email: string) {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) {
            console.error("Database connection not established");
            return {success: false, error: "Database connection failed"};
        }

        const user = await db.collection("user").findOne({email});
        if (!user) {
            return {success: false, error: "User not found"};
        }

        const userId = user.id || user._id.toString();

        await Watchlist.deleteOne({
            userId,
            symbol: symbol.toUpperCase()
        });

        return {success: true};
    } catch (error: unknown) {
        console.error("Error in removeFromWatchlist:", error);
        return {success: false, error: "Failed to remove from watchlist"};
    }
}

/**
 * Check whether a stock symbol is present in a user's watchlist.
 *
 * @returns `true` if the user's watchlist contains the given symbol (comparison is case-insensitive), `false` otherwise.
 */
export async function isStockInWatchlist(symbol: string, email: string): Promise<boolean> {
    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) return false;

        const user = await db.collection("user").findOne({email});
        if (!user) return false;

        const userId = user.id || user._id.toString();

        const item = await Watchlist.findOne({
            userId,
            symbol: symbol.toUpperCase()
        });

        return !!item;
    } catch (error: unknown) {
        console.error("Error in isStockInWatchlist:", error);
        return false;
    }
}