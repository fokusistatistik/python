'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutButton() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Initial check
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

        // Optional: Listen for storage changes in other tabs
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    if (!mounted || !isLoggedIn) return null;

    return (
        <button
            onClick={handleLogout}
            className="fixed top-4 right-4 z-50 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        >
            Logout
        </button>
    );
}
