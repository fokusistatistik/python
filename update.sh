#!/bin/bash

# ==========================================
# Fokus İstatistik - Auto Deployment Script
# ==========================================

cd /root/python-api || { echo "❌ Hata: /root/python-api klasörü bulunamadı!"; exit 1; }

echo "🔄 1. GitHub'dan güncel kodlar çekiliyor (Branch: test)..."
git fetch origin test && git reset --hard origin/test

echo "🛑 2. Eski servisler durduruluyor ve temizleniyor..."
docker compose down --remove-orphans

echo "🏗️ 3. İmajlar sıfırdan inşa ediliyor (No Cache + Cache Bust)..."
CACHE_BUST=$(date +%s) docker compose build --no-cache

echo "🚀 4. Sistem ayağa kaldırılıyor..."
docker compose up -d

echo "🌐 5. Nginx yapılandırması yenileniyor..."
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx başarıyla yenilendi."
else
    echo "⚠️ Nginx yapılandırmasında hata var, reload yapılmadı!"
fi

echo "----------------------------------------------------------"
echo "✅ GÜNCELLEME TAMAMLANDI! (Data Guru Engine v2.0+)"
echo "📍 Dashboard: https://python.fokusistatistik.com"
echo "📊 API Status: https://python.fokusistatistik.com/api/docs"
echo "----------------------------------------------------------"
docker compose ps
