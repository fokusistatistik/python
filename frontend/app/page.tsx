import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import JsonAnalyzer from '@/components/JsonAnalyzer';
import FileUploader from '@/components/FileUploader';

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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-lg shadow-lg shadow-blue-500/30"></div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              Fokus İstatistik
            </h1>
          </div>
          <nav className="flex gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Documentation</button>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Support</button>
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
              FK
            </div>
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
