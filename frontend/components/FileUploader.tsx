'use client';
import { useState, useRef } from 'react';
import { analyzeFile } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const processFile = async () => {
        if (!file) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await analyzeFile(file);
            setResult(res);
        } catch (error) {
            console.error(error);
            alert('Error analyzing file');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!result) return;
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "analysis_result.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="glass-panel p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Advanced Analysis</h2>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-medium">CSV / Excel</span>
            </div>

            <div
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group"
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                />
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                </div>
                <p className="text-slate-600 font-medium">{file ? file.name : "Click or Drag file to upload"}</p>
                <p className="text-slate-400 text-xs mt-1">Supports CSV and Excel files</p>
            </div>

            {file && (
                <div className="mt-4 flex justify-end gap-2">
                    {result && (
                        <button
                            onClick={handleDownload}
                            className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                        >
                            Download JSON
                        </button>
                    )}
                    <button
                        onClick={processFile}
                        disabled={loading}
                        className="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Run Analysis'}
                    </button>
                </div>
            )}

            {result && (
                <div className="mt-10 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

                    {/* Quick Metrics Card */}
                    <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                            Quick Metrics
                        </h3>
                        {/* ... (Metrics Grid Content Same as Before) ... */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Rows</p>
                                <p className="text-2xl font-mono font-bold">{result.meta?.rows || result.rows}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs uppercase tracking-wider">Columns</p>
                                <p className="text-2xl font-mono font-bold">{result.meta?.cols || result.cols}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Missing Values</p>
                                <div className="flex flex-wrap gap-2">
                                    {(result.meta?.missing_values || result.missing_values) && Object.entries(result.meta?.missing_values || result.missing_values).filter(([_, v]) => v as number > 0).length > 0 ? (
                                        Object.entries(result.meta?.missing_values || result.missing_values).map(([k, v]) => (
                                            (v as number) > 0 && <span key={k} className="text-xs bg-red-500/20 text-red-200 px-2 py-1 rounded">{k}: {v as number}</span>
                                        ))
                                    ) : (
                                        <span className="text-xs bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded">No missing data</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Correlation Matrix Skeleton / Visual */}
                    {result.correlation && Object.keys(result.correlation).length > 0 && (
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                            <h3 className="text-lg font-bold text-slate-700 mb-4 border-l-4 border-violet-500 pl-3">Correlation Matrix</h3>
                            <div className="min-w-full inline-block align-middle">
                                <div className="border rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                                                {Object.keys(result.correlation).map(col => (
                                                    <th key={col} className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {Object.entries(result.correlation).map(([rowKey, rowData]: [string, any]) => (
                                                <tr key={rowKey}>
                                                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">{rowKey}</td>
                                                    {Object.keys(result.correlation).map(colKey => {
                                                        const val = rowData[colKey];
                                                        // Color coding based on correlation
                                                        let bg = 'bg-white';
                                                        if (val > 0.7) bg = 'bg-blue-100';
                                                        if (val < -0.7) bg = 'bg-red-100';
                                                        if (val === 1) bg = 'bg-slate-100';

                                                        return (
                                                            <td key={colKey} className={`px-3 py-2 whitespace-nowrap text-sm text-gray-500 text-center ${bg}`}>
                                                                {val.toFixed(2)}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {Object.keys(result.numeric_stats).map((col: string) => {
                        const data = result.numeric_stats[col];
                        const chartData = data.histogram.counts.map((count: number, i: number) => ({
                            bin: data.histogram.bin_edges[i].toFixed(1),
                            count: count
                        }));

                        return (
                            <div key={col} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-lg font-bold text-slate-700 border-l-4 border-blue-500 pl-3">{col}</h3>
                                    <div className="text-xs text-slate-400 space-x-4">
                                        <span title="Average">Mean: <span className="font-mono text-slate-600">{data.mean.toFixed(2)}</span></span>
                                        <span title="Middle Value">Median: <span className="font-mono text-slate-600">{data.median.toFixed(2)}</span></span>
                                        <span title="Standard Deviation">Std: <span className="font-mono text-slate-600">{data.std.toFixed(2)}</span></span>
                                    </div>
                                </div>

                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="bin" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                                itemStyle={{ color: '#fff' }}
                                                cursor={{ fill: '#f8fafc' }}
                                            />
                                            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
