# ⚡ 5-Minute Tester Setup Guide
## Astronacci Social Media Platform - Daily Limits System

**For QA testers, stakeholders, and anyone wanting to quickly test the platform**

---

## 🚀 **Complete Setup in 5 Minutes**

### **Prerequisites** (Check these first!)
```bash
# Verify you have these installed:
node --version    # Need 18+
docker --version  # Need Docker Desktop running
npm --version     # Should work with Node
```

### **Step 1: Get the Code** (1 minute)
```bash
# Clone repository (if not done already)
git clone <repository-url>
cd astronacci-assesment

# Install all dependencies
npm install
```

### **Step 2: Start Database** (30 seconds)
```bash
# Start MongoDB and Redis containers
docker compose up -d mongodb redis

# Verify containers are running
docker compose ps
```

### **Step 3: Setup Environment** (30 seconds)
```bash
# Environment should be already configured
# Verify .env file has:
cat .env | grep NODE_ENV        # Should be 'development'
cat .env | grep MONGODB_URI     # Should have connection string
```

### **Step 4: Populate Test Data** (1 minute)
```bash
# Create comprehensive test data
npm run populate:test-data

# This creates:
# ✅ 4 test users with different roles
# ✅ 5 sample articles with rich content  
# ✅ 5 sample videos with metadata
```

### **Step 5: Start Application** (1 minute)
```bash
# Start both frontend and backend
npm run dev

# Wait for services to start (~1 minute)
# You'll see: "Frontend ready on port 3000" and "Backend ready on port 5001"
```

### **Step 6: Verify Everything Works** (1 minute)
Open these URLs and verify they load:

- **✅ Frontend App:** http://localhost:3000
- **✅ API Documentation:** http://localhost:5001/api-docs  
- **✅ Backend Health:** http://localhost:5001/health (should show "OK")

---

## 🧪 **Testing the Daily Limits System**

### **Test User Accounts** (Ready to use!)

| **Role** | **Email** | **Password** | **Membership** | **Daily Limits** |
|----------|-----------|--------------|----------------|------------------|
| **Basic User** | user@test.com | user123 | TYPE_A | 3 articles, 3 videos |
| **Premium User** | premium@test.com | premium123 | TYPE_C | Unlimited |
| **Editor** | editor@test.com | editor123 | TYPE_B | 10 articles, 10 videos |
| **Admin** | admin@test.com | admin123 | TYPE_C | Unlimited + Management |

### **Core Testing Scenario** (5 minutes)

#### **Test 1: Basic User Daily Limits**
1. **🔑 Login** at http://localhost:3000/login
   ```
   Email: user@test.com
   Password: user123
   ```

2. **📚 Browse Content**
   - Click "Articles" → Should see all 5 articles
   - Click "Videos" → Should see all 5 videos
   - **Important:** Users can SEE all content, limits apply to detailed access

3. **📖 Test Article Limits**
   - Click on first article → Should open and show full content
   - Click on second article → Should work fine  
   - Click on third article → Should work fine
   - **Check usage indicator** → Should show "3/3 articles used today"
   - Click on fourth article → Should show **"Daily limit reached"** message

4. **🔄 Test Re-access (Free!)**
   - Go back to first article you accessed → Should work immediately
   - This is FREE re-access - no additional quota consumed

5. **🎥 Test Video Limits**
   - Click on videos → Same pattern: can access 3, then blocked
   - Re-accessing previous videos is free

#### **Test 2: Premium User Experience**
1. **🔑 Login** with premium account:
   ```
   Email: premium@test.com
   Password: premium123
   ```

2. **♾️ Unlimited Access**
   - Access any number of articles → No limits
   - Access any number of videos → No limits
   - Usage indicator shows "Unlimited"

#### **Test 3: Content Management**
1. **🔑 Login** as editor:
   ```
   Email: editor@test.com
   Password: editor123
   ```

2. **✍️ Content Creation**
   - Navigate to content management areas
   - Create/edit articles and videos
   - Verify content appears in listings

---

## 🌟 **Key Features to Test**

### **Daily Limits System**
- ✅ **Browse All Content** → Users see everything in listings
- ✅ **Daily Limits Apply** → Only to detailed content access
- ✅ **Smart Re-access** → Previously accessed content is FREE
- ✅ **Real-time Tracking** → Usage counters update immediately
- ✅ **Clear Messaging** → Helpful messages when limits reached
- ✅ **Membership Tiers** → Different limits for different users

### **Authentication System**
- ✅ **Email/Password Login** → Standard account creation
- ✅ **JWT Tokens** → Secure session management
- ✅ **Protected Routes** → Content requires authentication
- ✅ **Role-Based Access** → Different UI for different roles

### **User Experience**
- ✅ **Responsive Design** → Test on mobile and desktop
- ✅ **Real-time Updates** → Instant feedback on actions
- ✅ **Intuitive Navigation** → Easy to find and use features
- ✅ **Error Handling** → Clear messages for problems

---

## 🔧 **Developer Testing Tools**

### **Interactive API Testing**
- **Swagger UI:** http://localhost:5001/api-docs
  - Click "Authorize" to login
  - Test any API endpoint with "Try it out"
  - See real API responses and request formats

### **Database Inspection**
```bash
# Connect to MongoDB
docker exec -it social-media-mongodb mongosh -u admin -p password

# View users
use social-media-platform
db.users.find().pretty()

# View articles
db.articles.find().pretty()
```

### **Real-time Logs**
```bash
# Watch backend logs
npm run dev:backend

# Watch frontend logs  
npm run dev:frontend
```

---

## 🚨 **Quick Troubleshooting**

### **Common Issues & Solutions**

#### **"Cannot connect to database"**
```bash
# Restart database
docker compose down mongodb
docker compose up -d mongodb
```

#### **"Port already in use"**
```bash
# Find what's using ports
lsof -i :3000  # Frontend
lsof -i :5001  # Backend

# Kill processes if needed
kill -9 <PID>
```

#### **"Test data population failed"**
```bash
# Verify environment
echo $NODE_ENV  # Should be 'development'

# Re-run population
npm run populate:test-data
```

#### **Complete Reset** (Nuclear option)
```bash
# Reset everything
docker compose down
rm -rf node_modules apps/*/node_modules
npm install
docker compose up -d mongodb redis
npm run populate:test-data
npm run dev
```

---

## ✅ **Testing Checklist**

### **Setup Verification**
- [ ] All URLs load correctly
- [ ] Can login with test accounts  
- [ ] API documentation accessible
- [ ] Database containers running

### **Daily Limits Testing**
- [ ] Basic user can access 3 articles, then blocked
- [ ] Re-accessing previous content works (free)
- [ ] Premium user has unlimited access
- [ ] Usage indicators update correctly
- [ ] Clear error messages when limits reached

### **Content Management**
- [ ] Editor can create/edit content
- [ ] Admin has full platform access
- [ ] New content appears in listings
- [ ] All users can see all content listings

### **User Experience**
- [ ] Responsive design works on mobile
- [ ] Authentication flow is smooth  
- [ ] Navigation is intuitive
- [ ] Real-time updates work properly

---

## 📞 **Need Help?**

### **Quick Commands for Support**
```bash
# Collect system info
echo "Node: $(node --version)"
echo "Docker: $(docker --version)"
docker compose ps

# Collect logs
docker compose logs > debug.log
npm run dev 2>&1 | head -50
```

### **Expected Behavior**
- **Setup time:** ~5 minutes total
- **Login response:** <2 seconds
- **Page loads:** <3 seconds
- **Daily limits:** Immediately enforced
- **Re-access:** Instant (no quota consumed)

---

**🎯 You're now ready to thoroughly test the daily content access system!**

**The platform demonstrates a sophisticated daily limits system that maximizes user engagement while managing content consumption effectively.**
