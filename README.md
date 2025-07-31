# 🔥 trend4media Frontend - Firebase Hosting

Next.js 14 Frontend mit statischem Export für Firebase Hosting.

## 🚀 Quick Start

### Lokale Entwicklung
```bash
npm install
npm run dev
# → http://localhost:3001
```

### Production Build & Export
```bash
# Statischen Export erstellen
NEXT_PUBLIC_API_URL=https://api.trend4media.com npm run export

# Output Verzeichnis
ls -la out/
```

### Firebase Deployment
```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Mit Token anmelden
firebase login:ci --token "$FIREBASE_TOKEN"

# Deployment durchführen
firebase deploy --only hosting --project trend4media-frontend
```

## 🌐 Production URLs

### Firebase Hosting
```
Primary:  https://trend4media-frontend.web.app
Legacy:   https://trend4media-frontend.firebaseapp.com
Login:    https://trend4media-frontend.web.app/login/
Admin:    https://trend4media-frontend.web.app/admin/
Dashboard: https://trend4media-frontend.web.app/dashboard/
```

### Alternative Deployments
```
Vercel:   https://trend4media-frontend.vercel.app
Custom:   https://app.trend4media.com
```

## 🔧 Environment Variables

```bash
# Production API
NEXT_PUBLIC_API_URL=https://api.trend4media.com

# Development API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📋 Features

- ✅ **Static Export** für Firebase Hosting
- ✅ **SPA Routing** mit clientseitigem Navigation
- ✅ **Security Headers** (HSTS, XSS Protection)
- ✅ **Performance Optimiert** (CDN, Caching)
- ✅ **SSL/HTTPS** automatisch
- ✅ **Custom Domains** Support

## 🛠️ Scripts

```bash
npm run dev     # Development Server
npm run build   # Next.js Build
npm run export  # Static Export für Firebase
npm run start   # Production Server (lokal)
npm run lint    # ESLint Check
```

## 📖 Deployment Guides

- **[Firebase Hosting](../FIREBASE_DEPLOYMENT.md)** - Detaillierte Anleitung
- **[Vercel](../DEPLOYMENT.md)** - Alternative Deployment
- **[Custom Domains](../CUSTOM_DOMAIN_SETUP.md)** - Domain Setup

---

**Status: ✅ Ready for Firebase Hosting Deployment**
