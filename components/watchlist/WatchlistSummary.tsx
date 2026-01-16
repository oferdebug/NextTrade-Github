"use client";

import React from 'react';
import {TrendingUp, TrendingDown, LayoutGrid} from 'lucide-react';

interface WatchlistSummaryProps {
    stats: {
        totalStocks: number;
        gainersCount: number;
        losersCount: number;
        topGainer: any;
        topLoser: any;
    } | null;
}

export const WatchlistSummary = ({stats}: WatchlistSummaryProps) => {
    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <LayoutGrid className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Total Stocks</p>
                    <p className="text-2xl font-bold text-white">{stats.totalStocks}</p>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                <div
                    className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <TrendingUp className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Gainers Today</p>
                    <div className="flex flex-col">
                        <p className="text-2xl font-bold text-white">{stats.gainersCount}</p>
                        {stats.topGainer && (
                            <span className="text-emerald-500 text-[10px] font-medium truncate max-w-[120px]">
                                Best: {stats.topGainer.symbol} (+{stats.topGainer.changePercent?.toFixed(2)}%)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <TrendingDown className="w-6 h-6"/>
                </div>
                <div>
                    <p className="text-gray-400 text-sm">Losers Today</p>
                    <div className="flex flex-col">
                        <p className="text-2xl font-bold text-white">{stats.losersCount}</p>
                        {stats.topLoser && (
                            <span className="text-red-500 text-[10px] font-medium truncate max-w-[120px]">
                                Worst: {stats.topLoser.symbol} ({stats.topLoser.changePercent?.toFixed(2)}%)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
