'use client';
import { useEffect, useState } from 'react';
import { getSystemInfo } from '@/lib/api';

export default function Dashboard() {
    const [info, setInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSystemInfo()
            .then(setInfo)
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="glass-panel p-6 mb-8 transition-all hover:scale-[1.01] hover:shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 tracking-tight">System Status</h2>
            {loading ? (
                <div className="flex space-x-2 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
            ) : info ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Python</p>
                        <p className="font-mono text-slate-700 mt-1 truncate" title={info.python}>{info.python.split(' ')[0]}</p>
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">Backend</p>
                        <p className="font-mono text-slate-700 mt-1">{info.backend}</p>
                    </div>
                    <div className="p-4 bg-violet-50/50 rounded-xl border border-violet-100">
                        <p className="text-xs font-semibold text-violet-500 uppercase tracking-wider">Pandas</p>
                        <p className="font-mono text-slate-700 mt-1">{info.pandas}</p>
                    </div>
                    <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                        <p className="text-xs font-semibold text-amber-500 uppercase tracking-wider">Numpy</p>
                        <p className="font-mono text-slate-700 mt-1">{info.numpy}</p>
                    </div>
                </div>
            ) : (
                <div className="text-red-500 bg-red-50 p-4 rounded-lg">Backend Unreachable. Is Docker running?</div>
            )}
        </div>
    );
}
