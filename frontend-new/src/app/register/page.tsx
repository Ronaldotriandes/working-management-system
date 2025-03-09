'use client';

import { registerUser } from '@/store/features/authSlice';
import { AppDispatch, RootState } from '@/store/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('operator');
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error } = useSelector((state: RootState) => state.auth);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await dispatch(registerUser({ fullname: name, email, password, roleId: role }));
        if (registerUser.fulfilled.match(result)) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
                <h2 className="text-3xl font-bold text-center">Register</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md  text-gray-700"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-700"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <label className="flex items-center  text-gray-700">
                            <input
                                type="radio"
                                name="role"
                                value="2"
                                checked={role === '2'}
                                onChange={(e) => setRole(e.target.value)}
                                className="mr-2  text-gray-700"
                            />
                            Operator
                        </label>
                        <label className="flex items-center  text-gray-700">
                            <input
                                type="radio"
                                name="role"
                                value="1"
                                checked={role === '1'}
                                onChange={(e) => setRole(e.target.value)}
                                className="mr-2  text-gray-700"
                            />
                            Product Manager
                        </label>
                    </div>
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Register'}
                    </button>
                </form>
                <div className="text-center mt-4">
                    <Link href="/login" className="text-blue-600 hover:text-blue-800">
                        Already have an account? Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
