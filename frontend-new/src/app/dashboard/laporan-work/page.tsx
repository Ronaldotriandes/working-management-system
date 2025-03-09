'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { LaporanWorkOrderTable } from '@/components/work-orders/LaporanWorkOrderTable';
import { useState } from 'react';

export default function WorkOrderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Laporan Work Orders</h1>

                </div>

                <LaporanWorkOrderTable />
            </div>
        </DashboardLayout>
    );
}
