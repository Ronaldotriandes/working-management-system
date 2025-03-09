'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LaporanOperatorWorkTable } from '@/components/work-orders/LaporanOperatorTable';
import { useState } from 'react';

export default function WorkOrderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Laporan Operator</h1>

                </div>

                <LaporanOperatorWorkTable />
            </div>
        </DashboardLayout>
    );
}
