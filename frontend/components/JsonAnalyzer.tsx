'use client';
import { useState } from 'react';
import { analyzeJson } from '@/lib/api';

export default function JsonAnalyzer() {
    const [input, setInput] = useState('[10.5, 20, 15, 30.2, 5]');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        try {
            setError('');
            setLoading(true);
            const data = JSON.parse(input);
            if (!Array.isArray(data)) throw new Error('Input must be a JSON list');
            const res = await analyzeJson(data);
            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Invalid JSON format');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Quick Stats (JSON)</h2>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">List of numbers</span>
            </div>

            <textarea
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />

            <div className="mt-4 flex justify-end">
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Crunching...' : 'Analyze Data'}
                </button>
            </div>

            {error && <p className="mt-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}

            {result && (
                <div className="mt-6 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Results</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(result.summary).map(([key, value]: [string, any]) => (
                            <div key={key} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm">
                                <p className="text-xs text-slate-400 uppercase">{key}</p>
                                <p className="font-mono font-medium text-slate-700">{typeof value === 'number' ? value.toFixed(2) : value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
