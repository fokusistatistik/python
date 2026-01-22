#!/bin/bash

# ==========================================
# Fokus İstatistik - Auto Deployment Script
# v2.1 - Türkçe UI + Kırmızı Logout Butonu
# ==========================================

cd /root/python-api || { echo "❌ Hata: /root/python-api klasörü bulunamadı!"; exit 1; }

echo "🔄 1. GitHub'dan güncel kodlar çekiliyor (Branch: test)..."
git fetch origin test && git reset --hard origin/test

echo "🛑 2. Eski servisler durduruluyor ve temizleniyor..."
docker compose down --remove-orphans

echo "🧹 3. Derin temizlik: Docker cache ve imajları siliniyor..."
docker system prune -af

echo "🏗️ 4. İmajlar sıfırdan inşa ediliyor (No Cache + Cache Bust)..."
CACHE_BUST=$(date +%s) docker compose build --no-cache

echo "🚀 5. Sistem ayağa kaldırılıyor..."
docker compose up -d

echo "🌐 6. Nginx yapılandırması yenileniyor..."
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx başarıyla yenilendi."
else
    echo "⚠️ Nginx yapılandırmasında hata var, reload yapılmadı!"
fi

echo "----------------------------------------------------------"
echo "✅ GÜNCELLEME TAMAMLANDI! (Fokus İstatistik v2.1)"
echo "📍 Dashboard: https://python.fokusistatistik.com"
echo "📊 API Docs: https://python.fokusistatistik.com/api/docs"
echo "----------------------------------------------------------"
git log -1 --pretty=format:"Aktif Commit: %h - %s"
echo -e "\n----------------------------------------------------------"
docker compose ps
