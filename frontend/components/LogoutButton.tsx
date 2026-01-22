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
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);

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
            title="Çıkış Yap"
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all duration-300 font-semibold"
        >
            <span className="text-sm">Çıkış Yap</span>
            <LogOut size={18} />
        </button>
    );
}
