"use client";

import React, {useState} from 'react';
import {Bell, BellPlus} from 'lucide-react';
import {AlertCard} from './AlertCard';
import {Button} from '@/components/ui/button';
import {CreateAlertModal} from './CreateAlertModal';

interface AlertsPanelProps {
    alerts: any[];
    onNewAlert: () => void;
    onEditAlert: (alert: any) => void;
}

export const AlertsPanel = ({alerts, onNewAlert, onEditAlert}: AlertsPanelProps) => {
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-6 h-6 text-emerald-500"/>
                    Alerts
                </h2>
                <Button
                    onClick={onNewAlert}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20"
                >
                    <BellPlus className="w-4 h-4 mr-2"/>
                    New Alert
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-1">
                {alerts.length === 0 ? (
                    <div
                        className="flex flex-col items-center justify-center py-12 px-4 bg-gray-900/20 border border-gray-800 rounded-2xl text-center">
                        <Bell className="w-12 h-12 text-gray-800 mb-4"/>
                        <h3 className="text-lg font-medium text-gray-400 mb-2">No active alerts</h3>
                        <p className="text-gray-600 text-sm mb-6 max-w-[200px] mx-auto">
                            Create a price alert to get notified when a stock hits your target price.
                        </p>
                        <Button
                            onClick={onNewAlert}
                            variant="outline"
                            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                            Set First Alert
                        </Button>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <AlertCard key={alert._id} alert={alert} onEdit={onEditAlert}/>
                    ))
                )}
            </div>
        </div>
    );
};
