# 🗺️ Fokus Ekosistemi & Bilge Akademi - Teknik Yol Haritası (Roadmap)

Bu doküman, **n8n otomasyonu** ve **Yapay Zeka (AI) tabanlı e-istatistik analiz** sistemlerinin entegrasyonu için teknik stratejiyi, önerilen teknoloji paketlerini ve geliştirme süreçlerini kapsar.

---

## 🏗️ 1. Mimari Genel Bakış (Architecture)

Sistem 3 ana ayaktan oluşacaktır:

1.  **AI Analysis Engine (Backend):** Python/FastAPI tabanlı, ağır istatistiksel hesaplamaları ve AI yorumlamalarını yapan motor.
2.  **Next-Gen Dashboard (Frontend):** Next.js tabanlı, kullanıcıların veri yüklediği, analiz sonuçlarını interaktif grafiklerle incelediği arayüz.
3.  **Workflow Automation (n8n):** Süreçleri birbirine bağlayan, raporlama, bildirim ve veri akışını yöneten orkestratör.

---

## 🐍 2. Backend Stratejisi (Python / FastAPI)

**Hedef:** Güçlü, ölçeklenebilir ve yapay zeka destekli bir analiz API'si oluşturmak.

### 📦 Önerilen Paketler & Teknolojiler
| Kategori | Paket/Araç | Kullanım Amacı |
| :--- | :--- | :--- |
| **Server** | `FastAPI` + `Uvicorn` | Yüksek performanslı asenkron API sunucusu. |
| **Veri İşleme** | `Pandas`, `NumPy` | Veri temizleme, manipülasyon ve matris işlemleri. |
| **İstatistik** | `SciPy`, `Statsmodels` | Hipotez testleri, regresyon, ANOVA, zaman serileri. |
| **AI / ML** | `Scikit-learn` | Kümeleme, sınıflandırma, tahminleme modelleri. |
| **LLM (AI Yorum)** | `LangChain`, `OpenAI` (veya `Ollama`) | Sayısal istatistik çıktılarının metinsel, anlaşılır raporlara dönüştürülmesi. |
| **Görev Kuyruğu** | `Celery` + `Redis` | *Kritik:* Uzun süren analizlerin (örn. büyük veri setleri) arkaplanda işlenmesi için. |
| **Veri Doğrulama** | `Pydantic` v2 | Gelen/Giden verinin tip güvenliği ve validasyonu. |

### 🚀 Geliştirme Süreçleri
1.  **Modüler API Yapısı:** Şu anki yapıyı koruyarak her analiz türü için ayrı `router`'lar (örn. `/api/v1/correlation`, `/api/v1/regression`).
2.  **Asenkron Analiz:** Kullanıcı dosya yüklediğinde "İşlem Başladı" yanıtı dönüp, arkaplanda (Celery) işlem bittiğinde n8n'e Webhook tetiklemek.
3.  **AI Raporlama:** İstatistiksel çıktıları (JSON) bir LLM'e besleyerek "Bu veri setinde X ile Y arasında güçlü bir ilişki var, bu da şunu gösteriyor..." şeklinde otomatik "Executive Summary" üretmek.

---

## ⚛️ 3. Frontend Stratejisi (Next.js)

**Hedef:** Premium hissettiren, hızlı ve %100 interaktif bir veri analiz deneyimi.

### 📦 Önerilen Paketler & Teknolojiler
| Kategori | Paket/Araç | Kullanım Amacı |
| :--- | :--- | :--- |
| **Framework** | `Next.js 15` (App Router) | Modern React framework'ü, SEO ve performans. |
| **UI Kit** | `Radix UI` + `Tailwind CSS` (`shadcn/ui`) | Erişilebilir, özelleştirilebilir ve şık bileşenler. |
| **Grafikleştirme** | `Recharts` veya `VisX` | React uyumlu, responsive ve animasyonlu grafikler. (Plotly.js alternatifi). |
| **Tablolar** | `TanStack Table` (React Table) | Büyük veri setlerini (grid, filtreleme, sıralama) yönetmek için. |
| **API Yönetimi** | `TanStack Query` (React Query) | Server state yönetimi, caching, otomatik yenileme. |
| **Form/Upload** | `React Hook Form` + `Zod` | Validasyonlu dosya yükleme ve parametre formları. |
| **Store** | `Zustand` | Basit ve hızlı global state yönetimi. |

### 🚀 Geliştirme Süreçleri
1.  **Dashboard Layout:** Yan menü, üst bar ve dinamik içerik alanı ile SPA (Single Page App) hissi.
2.  **Veri Görselleştirme:** Kullanıcı analiz sonucunu sadece sayı olarak değil, dağılım grafiği (scatter plot), histogram ve korelasyon matrisi (heatmap) olarak görmeli.
3.  **Export Seçenekleri:** Sonuçları PDF veya Excel olarak indirme (Backend veya n8n üzerinden tetiklenebilir).

---

## 🔄 4. n8n Entegrasyon ve Otomasyon

**Hedef:** Manuel süreçleri ortadan kaldırmak ve sistemi "akıllı" hale getirmek.

### 🔗 Örnek Senaryolar (Workflows)

#### A. Raporlama Otomasyonu
1.  **Tetikleyici:** Python API analizi bitirir -> n8n Webhook'una JSON sonucunu post eder.
2.  **İşlem:** n8n, bu JSON'u alır, bir PDF şablonuna (örn. Google Docs veya HTML-to-PDF) doldurur.
3.  **Aksiyon:** n8n, oluşturulan PDF'i kullanıcıya E-posta (SMTP) veya WhatsApp üzerinden gönderir.

#### B. Veri Toplama (Survey)
1.  **Tetikleyici:** Typeform veya Google Forms'a yeni bir anket cevabı düşer.
2.  **Aksiyon:** n8n veriyi alır, temizler ve Python API'nin `/analyze-json` endpoint'ine gönderir.
3.  **Sonuç:** Analiz sonucu anında Dashboard veritabanına yazılır.

#### C. Hata ve Bildirim Yönetimi
1.  **Tetikleyici:** Backend 500 hatası verirse veya bir analiz başarısız olursa.
2.  **Aksiyon:** n8n, teknik ekibin Slack/Discord kanalına hata logunu basar.

---

## 📅 5. Kısa Vadeli Aksiyon Planı (Next Steps)

1.  **Stabilizasyon (TAMAMLANDI):** ✅
    *   Encoding, CORS ve Import hataları giderildi.
    *   Temel analiz fonksiyonları çalışıyor.

2.  **Görselleştirme Fazı (Sıradaki):**
    *   Frontend'e `Recharts` eklenerek dönen istatistik verilerinin (Histogram, Korelasyon) grafiklere dökülmesi.

3.  **AI Entegrasyonu:**
    *   Backend'e `OpenAI API` entegrasyonu eklenerek, `p-value` ve `korelasyon` değerlerinin sözlü yorumunun üretilmesi.

4.  **n8n Bağlantısı:**
    *   Backend'e bir `Webhook` mekanizması kurarak analiz bitince n8n'e haber verilmesi.
