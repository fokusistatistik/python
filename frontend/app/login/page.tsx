'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const data = await login(username, password);
            localStorage.setItem('token', data.access_token);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            const status = err.response?.status;
            const detail = err.response?.data?.detail;

            if (status === 401) {
                setError('Geçersiz kullanıcı adı veya şifre.');
            } else if (status === 404) {
                setError('API uç noktası bulunamadı (404). Sunucu yapılandırmasını kontrol edin.');
            } else if (err.message === 'Network Error') {
                setError('Ağ Hatası: Sunucuya ulaşılamıyor. URL veya SSL ayarlarını kontrol edin.');
            } else {
                setError(`Giriş Başarısız: ${detail || err.message || 'Bilinmeyen Hata'}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="glass-panel w-full max-w-md p-8 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg shadow-lg shadow-blue-500/30 mx-auto mb-4"></div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
                    <p className="text-slate-500 text-sm">Sign in to Fokus İstatistik Platform</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="Enter username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    <p>Protected by internal security protocols.</p>
                </div>
            </div>
        </div>
    );
}
