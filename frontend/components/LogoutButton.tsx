'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';

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
            title="Logout"
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-slate-700 rounded-full shadow-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 group"
        >
            <span className="text-sm font-medium hidden md:inline group-hover:text-red-600">Logout</span>
            <LogOut size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
    );
}
