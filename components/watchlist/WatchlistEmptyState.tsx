"use client";

import React from 'react';
import {Star} from 'lucide-react';
import {SearchCommand} from '@/components/SearchCommand';

export const WatchlistEmptyState = () => {
    return (
        <div
            className="flex flex-col items-center justify-center py-20 bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-gray-600"/>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Your watchlist is empty</h3>
            <p className="text-gray-400 mb-8 max-w-sm text-center">
                Start tracking your favorite stocks by clicking the star icon in search results.
            </p>
            <SearchCommand
                renderAs="button"
                label="Search Stocks to Add"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-12 rounded-lg font-medium"
            />
        </div>
    );
};
