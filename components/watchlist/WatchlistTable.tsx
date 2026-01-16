"use client";

import React from 'react';
import {Trash2, BellPlus} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {removeFromWatchlist} from '@/lib/actions/watchlist.actions';
import {toast} from 'sonner';
import {StarButton} from '@/components/search/StarButton';
import Image from 'next/image';
import Link from 'next/link';
import {cn} from "@/lib/utils";

interface WatchlistTableProps {
    watchlist: any[];
    onCreateAlert: (stock: any) => void;
}

export const WatchlistTable = ({watchlist, onCreateAlert}: WatchlistTableProps) => {
    const handleRemove = async (symbol: string) => {
        try {
            const res = await removeFromWatchlist(symbol);
            if (res.success) {
                toast.success(`${symbol} removed from watchlist`);
            } else {
                toast.error(res.error || "Failed to remove stock");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const formatCurrency = (val?: number) => {
        if (val === undefined || val === null) return 'N/A';
        return new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'}).format(val);
    };

    const formatMarketCap = (val?: number) => {
        if (!val) return 'N/A';
        if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}T`;
        if (val >= 1000) return `$${(val / 1000).toFixed(2)}B`;
        return `$${val.toFixed(2)}M`;
    };

    return (
        <div className="bg-black/50 border border-gray-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                    <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                        <th className="p-4 w-10"></th>
                        <th className="p-4">Company</th>
                        <th className="p-4">Symbol</th>
                        <th className="p-4 text-right">Price</th>
                        <th className="p-4 text-right">Change %</th>
                        <th className="p-4 text-right">Market Cap</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {watchlist.map((stock) => (
                        <tr key={stock.id}
                            className="border-b border-gray-800/50 hover:bg-gray-900/30 transition-colors group">
                            <td className="p-4">
                                <StarButton symbol={stock.symbol} companyName={stock.companyName}
                                            initialIsWatched={true}/>
                            </td>
                            <td className="p-4">
                                <Link href={`/stocks/${stock.symbol}`} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-md bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700 flex-shrink-0">
                                        {stock.logo ? (
                                            <Image src={stock.logo} alt={stock.symbol} width={32} height={32}
                                                   className="object-contain"/>
                                        ) : (
                                            <span className="text-xs font-bold text-gray-500">{stock.symbol[0]}</span>
                                        )}
                                    </div>
                                    <span
                                        className="text-white font-medium truncate max-w-[120px] sm:max-w-[200px]">{stock.companyName}</span>
                                </Link>
                            </td>
                            <td className="p-4">
                                <span className="text-gray-300 font-mono text-sm">{stock.symbol}</span>
                            </td>
                            <td className="p-4 text-right text-white font-medium">
                                {formatCurrency(stock.currentPrice)}
                            </td>
                            <td className={cn("p-4 text-right font-medium", (stock.changePercent || 0) >= 0 ? "text-emerald-500" : "text-red-500")}>
                                {(stock.changePercent || 0) >= 0 ? '+' : ''}
                                {(stock.changePercent || 0).toFixed(2)}%
                            </td>
                            <td className="p-4 text-right text-gray-400 text-sm">
                                {formatMarketCap(stock.marketCap)}
                            </td>
                            <td className="p-4">
                                <div className="flex items-center justify-center gap-2">
                                    <Button
                                        size="sm"
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 h-8 px-2 sm:px-3"
                                        onClick={() => onCreateAlert({
                                            symbol: stock.symbol,
                                            companyName: stock.companyName,
                                            currentPrice: stock.currentPrice
                                        })}
                                    >
                                        <BellPlus className="w-3.5 h-3.5"/>
                                        <span className="hidden lg:inline text-xs">Add Alert</span>
                                    </Button>
                                    <button
                                        onClick={() => handleRemove(stock.symbol)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
