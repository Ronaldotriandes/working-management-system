import { logout } from '@/store/features/authSlice';
import { getDecodeToken } from '@/store/types';
import Link from 'next/link';
import { useDispatch } from 'react-redux';

export default function Sidebar() {
    const decodeToken = getDecodeToken()
    const dispatch = useDispatch();

    const menuItems = [
        { label: 'Dashboard', href: '/dashboard', icon: '📊', role: [1, 2] },
        { label: 'Work Order', href: '/dashboard/work-orders', icon: '👤', role: [1, 2] },
        { label: 'Laporan Work Order', href: '/dashboard/laporan-work', icon: '👤', role: [1] },
        { label: 'Laporan Operator', href: '/dashboard/laporan-operator', icon: '👤', role: [1] },

    ];

    const handleLogout = () => {
        dispatch(logout());
        window.location.reload();
    };

    return (
        <aside className="w-64 bg-white shadow-md h-full">
            <div className="p-4 border-b">
                <h1 className="text-xl text-gray-700  font-bold">Dashboard</h1>
            </div>
            <nav className="mt-4">
                {menuItems.filter((item) => decodeToken && item.role.includes(Number(decodeToken.roleId))).map((item, key) => (
                    <Link
                        key={key}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                    <span className="mr-2">🚪</span>
                    Logout
                </button>
            </nav>
        </aside>
    );
}
