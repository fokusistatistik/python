'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import JsonAnalyzer from '@/components/JsonAnalyzer';
import FileUploader from '@/components/FileUploader';

export const revalidate = 0;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="min-h-screen pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/50 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://static.fokusistatistik.com/resimler/favicon.png" alt="Fokus Logo" className="w-8 h-8 drop-shadow-md" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Fokus İstatistik
            </h1>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Beta V1.0</span>
          </div>
          <nav className="flex gap-4 items-center">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Documentation</button>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Support</button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">

        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight lg:text-5xl mb-4">
            Data Analysis <br />
            <span className="text-blue-600">Reimagined.</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Welcome to the new standard in statistical computing. Upload your datasets or analyze raw JSON key-value pairs instantly.
          </p>
        </div>

        <Dashboard />

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <JsonAnalyzer />
            {/* Placeholder for more widgets */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center py-12">
              <p className="text-slate-400 font-medium">More tools coming soon</p>
            </div>
          </div>

          <div>
            <FileUploader />
          </div>
        </div>

      </div>
    </main>
  );
}
