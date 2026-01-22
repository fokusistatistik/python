# Fokus İstatistik - Deployment Rehberi

## Sunucuda Güncelleme (Production)

### Tek Komutla Güncelleme
```bash
cd /root/python-api
bash update.sh
```

### Manuel Adım Adım Güncelleme

```bash
cd /root/python-api

# 1. GitHub'dan güncel kodları çek
git fetch origin test && git reset --hard origin/test

# 2. Eski servisleri durdur
docker compose down --remove-orphans

# 3. Docker cache'i temizle
docker system prune -af

# 4. Sıfırdan build et
CACHE_BUST=$(date +%s) docker compose build --no-cache

# 5. Servisleri başlat
docker compose up -d

# 6. Nginx'i yenile
nginx -t && systemctl reload nginx

# 7. Durumu kontrol et
docker compose ps
git log -1 --oneline
```

## Yerel Geliştirme (Local)

### Backend Başlatma
```bash
cd app
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8050 --app-dir .
```

### Frontend Başlatma
```bash
cd frontend
npm install
npm run dev
```

## Sorun Giderme

### Build Hatası Alıyorsanız
```bash
# Frontend build testi
cd frontend
npm run build

# Hata varsa logları kontrol edin
docker compose logs frontend
```

### Port Çakışması
```bash
# Portları kontrol et
netstat -tulpn | grep -E '3050|8050'

# Çakışan process'i öldür
kill -9 <PID>
```

## Önemli Notlar

- **Branch:** `test`
- **Son Commit:** `76f18d4` - Türkçe UI + Kırmızı Logout Butonu
- **Backend Port:** 8050
- **Frontend Port:** 3050
- **Production URL:** https://python.fokusistatistik.com
