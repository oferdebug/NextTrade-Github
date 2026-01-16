"use client";

import React from 'react';
import {SearchCommand} from '@/components/SearchCommand';

export const AddStockButton = () => {
    return (
        <SearchCommand
            renderAs="button"
            label="Add Stock"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-10 px-6 rounded-lg transition-all shadow-lg shadow-emerald-900/20"
        />
    );
};
