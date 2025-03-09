'use client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { CreateWorkOrderModal } from '@/components/work-orders/CreateWorkOrderModal';
import { WorkOrderTable } from '@/components/work-orders/WorkOrderTable';
import { useState } from 'react';

export default function WorkOrderPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <DashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Work Orders</h1>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded "
                        onClick={() => setIsModalOpen(true)}>Create Work Order</button>
                </div>

                <WorkOrderTable />

                <CreateWorkOrderModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        </DashboardLayout>
    );
}
