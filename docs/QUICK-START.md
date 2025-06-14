# 🚀 Quick Development Guide

## Getting Started in 30 seconds

### 1. Start Everything
```bash
cd /Users/riyanfirdausamerta/Documents/astronacci-assesment
npm run dev
```

### 2. Access Your Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001  
- **📚 API Docs**: http://localhost:5001/api-docs ← **START HERE**

### 3. Test the API (via Swagger)
1. Open http://localhost:5001/api-docs
2. Click **"Authorize"** button
3. Test any endpoint with **"Try it out"**

---

## 🔥 Hot Commands

```bash
# Quick health check
curl http://localhost:5001/health

# Open Swagger docs
open http://localhost:5001/api-docs

# View logs
npm run dev

# Restart backend only
cd apps/backend && npm run dev
```

---

## 📱 Key Features to Test

### 🔐 Authentication
- Google OAuth: `GET /api/auth/google`
- Get Profile: `GET /api/auth/profile` (needs JWT)

### 📄 Content Management  
- List Articles: `GET /api/articles`
- Create Article: `POST /api/articles` (needs Editor role)

### 👥 User Management
- List Users: `GET /api/users` (needs Admin role)
- Update Role: `PUT /api/users/{id}/role` (needs Admin role)

### 📊 CMS Dashboard
- Dashboard Stats: `GET /api/cms/dashboard` (needs Editor/Admin)
- Analytics: `GET /api/cms/analytics` (needs Editor/Admin)

---

## 🧪 Quick API Tests

### Public Endpoints (No Auth)
```bash
# Health check
curl http://localhost:5001/health

# Get articles
curl http://localhost:5001/api/articles

# Get videos  
curl http://localhost:5001/api/videos
```

### Protected Endpoints (Need JWT)
Use Swagger UI for easy testing with authentication!

---

## 🎯 Development Tips

1. **Use Swagger UI** for all API testing - it handles authentication automatically
2. **Start with health check** to verify server is running
3. **Test OAuth flows** through browser (Google/Facebook login)
4. **Check logs** in terminal for debugging
5. **Use "Try it out"** in Swagger for immediate API testing

---

## 🔧 Troubleshooting

### Server not starting?
```bash
# Check if ports are free
lsof -i :3000 :5001

# Restart databases
docker compose restart mongodb redis
```

### API not responding?
```bash
# Quick health check
curl http://localhost:5001/health

# Check backend logs
cd apps/backend && npm run dev
```

### Swagger docs not loading?
- Ensure backend is running on port 5001
- Visit: http://localhost:5001/api-docs/

---

**💡 Pro Tip**: The Swagger documentation at http://localhost:5001/api-docs is your best friend for API development!
