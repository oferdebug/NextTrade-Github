"use client";

import React from 'react';
import {Pencil, Trash2, ArrowUpCircle, ArrowDownCircle} from 'lucide-react';
import {deleteAlert} from '@/lib/actions/alert.actions';
import {toast} from 'sonner';
import {cn} from '@/lib/utils';

interface AlertCardProps {
    alert: any;
    onEdit: (alert: any) => void;
}

export const AlertCard = ({alert, onEdit}: AlertCardProps) => {
    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this alert?")) return;

        try {
            const res = await deleteAlert(alert._id);
            if (res.success) {
                toast.success("Alert deleted");
            } else {
                toast.error("Failed to delete alert");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div
            className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-4 hover:border-gray-700 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        alert.condition === 'above' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}>
                        {alert.condition === 'above' ? <ArrowUpCircle className="w-6 h-6"/> :
                            <ArrowDownCircle className="w-6 h-6"/>}
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-base leading-tight">{alert.symbol}</h4>
                        <p className="text-gray-400 text-[10px] truncate max-w-[120px]">{alert.companyName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit(alert)}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    >
                        <Pencil className="w-3.5 h-3.5"/>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                        <Trash2 className="w-3.5 h-3.5"/>
                    </button>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs mt-1">
                <div className="text-gray-300">
                    Price {alert.condition} <span
                    className="text-white font-bold ml-1">${alert.targetPrice.toFixed(2)}</span>
                </div>
                <div
                    className="bg-gray-800/80 text-gray-400 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-semibold border border-gray-700/50">
                    {alert.frequency.replace('_', ' ')}
                </div>
            </div>

            {!alert.isActive && (
                <div
                    className="mt-3 pt-3 border-t border-gray-800 text-[9px] text-gray-500 uppercase tracking-widest text-center font-medium">
                    Triggered / Inactive
                </div>
            )}
        </div>
    );
};
