"use client";

import React, {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {createAlert, updateAlert} from '@/lib/actions/alert.actions';
import {toast} from 'sonner';

interface CreateAlertModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialData?: any;
}

export const CreateAlertModal = ({open, setOpen, initialData}: CreateAlertModalProps) => {
    const {register, handleSubmit, reset, setValue, watch} = useForm({
        defaultValues: {
            symbol: '',
            companyName: '',
            condition: 'above',
            targetPrice: '',
            frequency: 'once'
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                symbol: initialData.symbol || '',
                companyName: initialData.companyName || '',
                condition: initialData.condition || 'above',
                targetPrice: initialData.targetPrice?.toString() || '',
                frequency: initialData.frequency || 'once'
            });
        } else {
            reset({
                symbol: '',
                companyName: '',
                condition: 'above',
                targetPrice: '',
                frequency: 'once'
            });
        }
    }, [initialData, reset, open]);

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                targetPrice: parseFloat(data.targetPrice)
            };

            if (initialData?._id) {
                const res = await updateAlert(initialData._id, payload);
                if (res.success) {
                    toast.success("Alert updated successfully");
                    setOpen(false);
                } else {
                    toast.error(res.error || "Failed to update alert");
                }
            } else {
                const res = await createAlert(payload);
                if (res.success) {
                    toast.success("Alert created successfully");
                    setOpen(false);
                } else {
                    toast.error(res.error || "Failed to create alert");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData?._id ? 'Edit Alert' : 'Create Price Alert'}</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Get notified when stock price reaches your target.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="symbol" className="text-gray-300">Stock Symbol</Label>
                        <Input
                            id="symbol"
                            {...register('symbol', {required: true})}
                            placeholder="e.g. AAPL"
                            className="bg-gray-800 border-gray-700 text-white focus:ring-emerald-500"
                            disabled={!!initialData?._id}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                        <Input
                            id="companyName"
                            {...register('companyName', {required: true})}
                            placeholder="e.g. Apple Inc"
                            className="bg-gray-800 border-gray-700 text-white focus:ring-emerald-500"
                            disabled={!!initialData?._id}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-gray-300">Condition</Label>
                            <Select
                                onValueChange={(v) => setValue('condition', v as any)}
                                value={watch('condition')}
                            >
                                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                    <SelectValue placeholder="Select"/>
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                    <SelectItem value="above">Price Above</SelectItem>
                                    <SelectItem value="below">Price Below</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetPrice" className="text-gray-300">Target Price</Label>
                            <Input
                                id="targetPrice"
                                type="number"
                                step="0.01"
                                {...register('targetPrice', {required: true})}
                                className="bg-gray-800 border-gray-700 text-white focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-gray-300">Frequency</Label>
                        <Select
                            onValueChange={(v) => setValue('frequency', v as any)}
                            value={watch('frequency')}
                        >
                            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select"/>
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                                <SelectItem value="once">Once</SelectItem>
                                <SelectItem value="per_minute">Once per minute</SelectItem>
                                <SelectItem value="per_hour">Once per hour</SelectItem>
                                <SelectItem value="per_day">Once per day</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                        >
                            {initialData?._id ? 'Update Alert' : 'Create Alert'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
