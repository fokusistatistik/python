'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Dashboard from '@/components/Dashboard';
import JsonAnalyzer from '@/components/JsonAnalyzer';
import FileUploader from '@/components/FileUploader';
import LogoutButton from '@/components/LogoutButton';
import { BookOpen, MessageCircle } from 'lucide-react';

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://static.fokusistatistik.com/resimler/favicon.png" alt="Fokus Logo" className="w-8 h-8 drop-shadow-md" />
            <div>
              <h1 className="text-lg font-bold text-slate-900">
                Python - Fokus İstatistik
              </h1>
              <p className="text-xs text-slate-500">Veri Bilimi Platformu</p>
            </div>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Beta V1.0</span>
          </div>
          <nav className="flex gap-3 items-center">
            <a
              href="https://fokusistatistik.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <BookOpen size={16} />
              <span>Dokümantasyon</span>
            </a>
            <a
              href="https://fokusistatistik.com/support"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100"
            >
              <MessageCircle size={16} />
              <span>Destek</span>
            </a>
            <LogoutButton />
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-12">

        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight lg:text-5xl mb-4">
            Veri Analizi <br />
            <span className="text-blue-600">Yeniden Tasarlandı.</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            İstatistiksel hesaplamalarda yeni standarda hoş geldiniz. Veri setlerinizi yükleyin veya JSON anahtar-değer çiftlerini anında analiz edin.
          </p>
        </div>

        <Dashboard />

        {/* Available Libraries Section */}
        <div className="glass-panel p-6 mb-8">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Kullanılabilir Kütüphaneler</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="font-semibold text-blue-900 text-sm">Scikit-learn</p>
              <p className="text-xs text-blue-600">Machine Learning</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
              <p className="font-semibold text-green-900 text-sm">Pandas</p>
              <p className="text-xs text-green-600">Veri İşleme</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
              <p className="font-semibold text-purple-900 text-sm">Statsmodels</p>
              <p className="text-xs text-purple-600">İstatistik</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-100">
              <p className="font-semibold text-orange-900 text-sm">Plotly</p>
              <p className="text-xs text-orange-600">Görselleştirme</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
              <p className="font-semibold text-red-900 text-sm">XGBoost</p>
              <p className="text-xs text-red-600">Gradient Boosting</p>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="font-semibold text-indigo-900 text-sm">Prophet</p>
              <p className="text-xs text-indigo-600">Zaman Serileri</p>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
              <p className="font-semibold text-pink-900 text-sm">Seaborn</p>
              <p className="text-xs text-pink-600">Görselleştirme</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg border border-teal-100">
              <p className="font-semibold text-teal-900 text-sm">SciPy</p>
              <p className="text-xs text-teal-600">Bilimsel Hesaplama</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <JsonAnalyzer />
            {/* Placeholder for more widgets */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 text-center py-12">
              <p className="text-slate-400 font-medium">Daha fazla araç yakında</p>
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
