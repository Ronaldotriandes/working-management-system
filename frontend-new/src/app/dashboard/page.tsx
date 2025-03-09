'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Dashboard() {
    return (
        <DashboardLayout>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="text-lg font-semibold">Total Tasks</h2>
                    <p className="text-3xl font-bold">24</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="text-lg font-semibold">Completed</h2>
                    <p className="text-3xl font-bold">16</p>
                </div>
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="text-lg font-semibold">Pending</h2>
                    <p className="text-3xl font-bold">8</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
