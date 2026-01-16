"use client";

import React, {useState} from 'react';
import {WatchlistTable} from '@/components/watchlist/WatchlistTable';
import {WatchlistSummary} from '@/components/watchlist/WatchlistSummary';
import {AlertsPanel} from '@/components/watchlist/AlertsPanel';
import {CreateAlertModal} from '@/components/watchlist/CreateAlertModal';

interface WatchlistClientProps {
    initialWatchlist: any[];
    initialStats: any;
    initialAlerts: any[];
}

export const WatchlistClient = ({initialWatchlist, initialStats, initialAlerts}: WatchlistClientProps) => {
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<any>(null);

    const handleNewAlert = () => {
        setSelectedAlert(null);
        setIsAlertModalOpen(true);
    };

    const handleEditAlert = (alert: any) => {
        setSelectedAlert(alert);
        setIsAlertModalOpen(true);
    };

    const handleCreateAlertFromStock = (stock: any) => {
        setSelectedAlert({
            symbol: stock.symbol,
            companyName: stock.companyName,
            targetPrice: stock.currentPrice
        });
        setIsAlertModalOpen(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <WatchlistSummary stats={initialStats}/>
                <WatchlistTable watchlist={initialWatchlist} onCreateAlert={handleCreateAlertFromStock}/>
            </div>
            <div className="lg:col-span-1">
                <div
                    className="bg-black/50 border border-gray-800 rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-hidden flex flex-col shadow-xl">
                    <AlertsPanel
                        alerts={initialAlerts}
                        onNewAlert={handleNewAlert}
                        onEditAlert={handleEditAlert}
                    />
                </div>
            </div>

            <CreateAlertModal
                open={isAlertModalOpen}
                setOpen={setIsAlertModalOpen}
                initialData={selectedAlert}
            />
        </div>
    );
};
