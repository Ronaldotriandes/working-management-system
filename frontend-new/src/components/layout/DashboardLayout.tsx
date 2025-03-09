import { logout } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from './Sidebar';
interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-6">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                        Welcome, {user?.fullname || 'User'}
                    </h2>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
                {children}
            </main>
        </div>
    );
}