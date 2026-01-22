'use client';
import { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, X } from 'lucide-react';
import { analyzeFile } from '@/lib/api';

export default function FileUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls'))) {
            setFile(droppedFile);
            setError('');
        } else {
            setError('Lütfen sadece CSV veya Excel dosyası yükleyin');
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;

        setLoading(true);
        setError('');
        try {
            const data = await analyzeFile(file);
            setResult(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Analiz sırasında hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
        setError('');
    };

    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white'}
                    ${file ? 'border-green-500 bg-green-50' : ''}
                    hover:border-blue-400 hover:bg-blue-50/50
                `}
            >
                <input
                    type="file"
                    id="file-upload"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {!file ? (
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                        <Upload className="w-12 h-12 text-blue-500 mb-4" />
                        <p className="text-lg font-semibold text-slate-700 mb-2">
                            Dosya Sürükle veya Seç
                        </p>
                        <p className="text-sm text-slate-500 mb-4">
                            CSV, XLS veya XLSX formatında
                        </p>
                        <button
                            type="button"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Dosya Seç
                        </button>
                    </label>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileSpreadsheet className="w-10 h-10 text-green-600" />
                            <div>
                                <p className="font-semibold text-slate-800">{file.name}</p>
                                <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={clearFile}
                            className="p-2 hover:bg-red-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-red-600" />
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {file && !result && (
                <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                    {loading ? 'Analiz Ediliyor...' : 'Analizi Başlat'}
                </button>
            )}

            {result && (
                <div className="glass-panel p-6 space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">Analiz Sonuçları</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-600 font-semibold">Satır Sayısı</p>
                            <p className="text-2xl font-bold text-slate-800">{result.rows}</p>
                        </div>
                        <div className="p-4 bg-violet-50 rounded-lg">
                            <p className="text-sm text-violet-600 font-semibold">Sütun Sayısı</p>
                            <p className="text-2xl font-bold text-slate-800">{result.cols}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-600 mb-2">Sütunlar:</p>
                        <div className="flex flex-wrap gap-2">
                            {result.columns?.map((col: string, idx: number) => (
                                <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                                    {col}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
