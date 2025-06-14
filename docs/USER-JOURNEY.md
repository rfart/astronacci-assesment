# 🚀 Complete User Journey Documentation
## Social Media Platform - Daily Content Access System

*Last Updated: June 14, 2025*

---

## 📖 Table of Contents

1. [Quick Setup Guide](#quick-setup-guide)
2. [Test Data & Credentials](#test-data--credentials)
3. [Platform Overview](#platform-overview)
4. [Daily Content Access System](#daily-content-access-system)
5. [User Types & Roles](#user-types--roles)
6. [Guest User Journey](#guest-user-journey)
7. [Regular User Journey](#regular-user-journey)
8. [Daily Content Consumption Flow](#daily-content-consumption-flow)
9. [Editor Journey](#editor-journey)
10. [Admin Journey](#admin-journey)
11. [Testing Scenarios](#testing-scenarios)
12. [Technical Integration](#technical-integration)
13. [API Documentation](#api-documentation)
14. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Setup Guide

### **Prerequisites Setup**
Before testing the platform, ensure you have:

1. **Node.js 18+** installed
2. **Docker & Docker Compose** installed
3. **Git** installed
4. **Available ports:** 3000, 5001, 27017, 6379

### **Complete Setup Process**

#### **1. Initial Installation**
```bash
# Clone repository
git clone <repository-url>
cd astronacci-assesment

# Install all dependencies
npm install
```

#### **2. Environment Configuration**
```bash
# Copy environment file
cp .env.example .env

# Verify .env contains:
# NODE_ENV=development
# MONGODB_URI=mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin
# JWT_SECRET=your-super-secret-jwt-key-here-please-change-in-production
```

#### **3. Start Database Services**
```bash
# Start MongoDB and Redis containers
docker compose up -d mongodb redis

# Verify containers are running
docker compose ps
```

#### **4. Populate Test Data** ⭐
```bash
# Populate database with comprehensive test data
npm run populate:test-data

# This script creates:
# ✅ 4 test users with different roles and membership tiers
# ✅ 5 diverse articles with rich content
# ✅ 5 educational videos with metadata
# ✅ Realistic timestamps and relationships
```

#### **5. Start Application Services**
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run dev:backend     # Backend API on port 5001
npm run dev:frontend    # React app on port 3000
```

#### **6. Verify Setup**
Open these URLs to confirm everything is working:

- **✅ Frontend App:** http://localhost:3000
- **✅ Backend API:** http://localhost:5001/health
- **✅ API Documentation:** http://localhost:5001/api-docs
- **✅ Login Page:** http://localhost:3000/login

---

## 🔐 Test Data & Credentials

After running `npm run populate:test-data`, use these test accounts:

### **Test User Accounts**

| **Role** | **Email** | **Password** | **Membership** | **Daily Limits** | **Purpose** |
|----------|-----------|--------------|----------------|------------------|-------------|
| **👤 Admin** | admin@test.com | admin123 | TYPE_C | Unlimited | Full platform management |
| **👤 User** | user@test.com | user123 | TYPE_A | 3 articles, 3 videos | Basic daily limits testing |
| **👤 Editor** | editor@test.com | editor123 | TYPE_B | 10 articles, 10 videos | Content creation testing |
| **👤 Premium** | premium@test.com | premium123 | TYPE_C | Unlimited | Premium features testing |

### **Sample Content Created**

#### **📚 Test Articles** (5 total)
1. **"Getting Started with React TypeScript"** - Frontend development tutorial
2. **"Node.js Best Practices for 2025"** - Backend development guide  
3. **"MongoDB Schema Design Patterns"** - Database design article
4. **"Modern CSS Grid and Flexbox Techniques"** - CSS layout guide
5. **"API Security: Complete Guide to JWT Authentication"** - Security tutorial

#### **🎥 Test Videos** (5 total)
1. **"React Hooks Deep Dive"** - 30 min React tutorial
2. **"Building REST APIs with Express"** - 40 min API development
3. **"MongoDB Aggregation Pipeline Masterclass"** - 60 min database tutorial
4. **"CSS Grid Layout: From Basics to Advanced"** - 45 min CSS course
5. **"Docker for Developers"** - 70 min containerization guide

---

## 🧪 Testing Scenarios

### **Scenario 1: Basic User Daily Limits**
```bash
# Login as basic user
Email: user@test.com
Password: user123
Membership: TYPE_A (3 articles, 3 videos daily)

# Test Flow:
1. Browse articles page → See all 5 articles
2. Click on 3 different articles → Should work fine
3. Try accessing 4th article → Should show limit reached
4. Go back to previously accessed article → Should work (free re-access)
5. Check usage indicator → Should show 3/3 articles used
```

### **Scenario 2: Premium User Experience**
```bash
# Login as premium user  
Email: premium@test.com
Password: premium123
Membership: TYPE_C (Unlimited)

# Test Flow:
1. Access any number of articles → No limits
2. Access any number of videos → No limits
3. Check usage indicator → Shows unlimited status
```

### **Scenario 3: Content Management (Editor)**
```bash
# Login as editor
Email: editor@test.com
Password: editor123
Membership: TYPE_B (10 daily articles, 10 videos)

# Test Flow:
1. Access CMS dashboard → Available navigation
2. Create new article → Should save successfully
3. Edit existing content → Should update properly
4. Verify content appears in listings → Visible to all users
```

### **Scenario 4: Platform Administration (Admin)**
```bash
# Login as admin
Email: admin@test.com
Password: admin123
Membership: TYPE_C (Unlimited access)

# Test Flow:
1. Access admin dashboard → Full platform overview
2. Manage all users → View and modify user accounts
3. Content moderation → Edit any content
4. System monitoring → Usage statistics and health
```

### **Scenario 5: Daily Reset Simulation**
```bash
# Test daily reset behavior:
1. Login as user@test.com
2. Access 3 articles (reach daily limit)
3. Try accessing 4th article → Blocked
4. Simulate next day (modify database dates)
5. Access articles again → Fresh 3/3 daily limit
```

---

## 🎯 Platform Overview

The **Astronacci Social Media Platform** is a content management and consumption platform featuring a revolutionary **Daily Content Access System** that maximizes user engagement while managing content consumption.

### **Core Features**
- **📚 Content Types:** Articles & Videos with rich metadata
- **🔐 Authentication:** Multiple methods (Email/Password, Google OAuth, Facebook)
- **🎯 Daily Access System:** Smart daily limits with free re-access
- **👥 Role-Based Access:** User, Editor, Admin permissions
- **📊 Interactive API:** Swagger documentation with live testing
- **📱 Responsive Design:** Mobile-first Tailwind CSS interface

### **Key URLs**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Docs:** http://localhost:5001/api-docs
- **Health Check:** http://localhost:5001/health

---

## 🎯 Daily Content Access System

### **🔄 Revolutionary Daily Limits**

The platform implements a **daily content access system** that fundamentally changes how users interact with content:

#### **Content Discovery (Unlimited)**
- ✅ **All users see ALL content** in listing pages
- ✅ **Full search and filtering** capabilities
- ✅ **Complete metadata access** (titles, excerpts, thumbnails)
- ✅ **No browsing restrictions** whatsoever

#### **Content Consumption (Daily Limited)**
- 📖 **Article Detail Access:** Counts against daily limit
- 🎥 **Video Detail Access:** Counts against daily limit
- 🔄 **Smart Re-access:** Revisiting content is FREE
- 🌙 **Midnight Reset:** Fresh limits every day

### **Membership Tiers & Daily Limits**

| Tier | Daily Articles | Daily Videos | Price | Benefits |
|------|---------------|--------------|-------|----------|
| **TYPE_A** | 3 | 3 | Free | Basic daily access |
| **TYPE_B** | 10 | 10 | $9.99/month | Enhanced daily access |
| **TYPE_C** | Unlimited | Unlimited | $19.99/month | Complete freedom |

### **Smart Access Features**
1. **📅 Daily Reset**: Fresh opportunities every day at midnight
2. **🔄 Re-access Protection**: View consumed content without penalty
3. **📊 Usage Tracking**: Real-time progress indicators
4. **🎯 Strategic Choice**: Users decide what to consume
5. **📈 Engagement Driven**: Encourages daily platform visits

---

## 👥 User Types & Roles

### **Authentication Roles**
- **🔓 Guest:** Browse ALL content listings, limited detail access
- **👤 User:** Daily content access based on membership tier
- **✏️ Editor:** Content creation + user privileges
- **� Admin:** Complete platform management

### **Authentication Methods**
- **📧 Email/Password:** Traditional secure registration
- **🔐 Google OAuth:** Seamless social login with account linking
- **📘 Facebook OAuth:** Alternative social authentication
- **🔗 Smart Linking:** Automatic account merging for existing emails

---

## 🔍 Guest User Journey

### **New Guest Experience Flow**

```mermaid
graph TD
    A[Visit Platform] --> B[See ALL Articles & Videos]
    B --> C[Browse Complete Catalog]
    C --> D[Click Article/Video]
    D --> E[Registration Required]
    E --> F[Choose Auth Method]
    F --> G[Google OAuth] 
    F --> H[Email/Password]
    F --> I[Facebook OAuth]
    G --> J[Instant Access to Content]
    H --> J
    I --> J
    J --> K[Daily Limits Applied]
```

### **Enhanced Guest Capabilities**
✅ **Can Do:**
- **See ALL content listings** (complete catalog visibility)
- **Browse without restrictions** (search, filter, paginate)
- **View rich metadata** (titles, excerpts, thumbnails, tags)
- **Access platform navigation** and features
- **Understand membership benefits** clearly

❌ **Cannot Do:**
- Access article/video detail pages
- Consume full content
- Track daily usage
- Save content preferences

### **Conversion Strategy**
1. **Full Visibility Hook:** Users see everything available
2. **Strategic FOMO:** "Choose wisely with your daily limits"
3. **Clear Value Prop:** Immediate access after registration
4. **Multiple Entry Points:** Every piece of content is a conversion opportunity
3. **Navigation Bar:** Prominent login button
4. **Footer:** Registration benefits

---

## 👤 Regular User Journey - Daily Access System

### **🔐 Registration & Onboarding**

#### **Registration Process**
```mermaid
graph LR
    A[Choose Auth Method] --> B[Email/Password]
    A --> C[Google OAuth]
    A --> D[Facebook OAuth]
    B --> E[Email Verification]
    C --> F[OAuth Success]
    D --> F
    E --> G[Select Membership Tier]
    F --> G
    G --> H[Welcome Dashboard]
    H --> I[Daily Limits Explained]
```

#### **Step 1: Multi-Method Registration**

**Option A: Email/Password Registration**
1. **Visit Login Page** → Click "Create Account"
2. **Complete Registration Form:**
   - Full name (required)
   - Email address (unique, validated)
   - Password (minimum 6 characters, hashed with bcrypt)
   - Membership tier selection (defaults to TYPE_A)
3. **Instant Account Creation** with JWT token
4. **Welcome Tutorial** explaining daily access system

**Option B: Google OAuth Registration**
1. **Click "Continue with Google"**
2. **Google OAuth Flow** with automatic account linking
3. **Profile Data Import** (name, email, avatar)
4. **Daily Limits Setup** with tier selection

**Option C: Facebook OAuth Registration**
1. **Click "Continue with Facebook"**
2. **Facebook OAuth Flow** with seamless integration
3. **Automatic Profile Creation**
4. **Daily Access System Introduction**

#### **Step 2: Daily Access System Onboarding**

**Welcome Tutorial Shows:**
- 🎯 **Daily Limits Concept:** "Access content strategically with daily limits"
- 🔄 **Re-access Benefits:** "Revisit content from today without using limits"
- 📅 **Reset Schedule:** "Fresh limits every day at midnight"
- 📊 **Usage Tracking:** "Monitor your daily consumption in real-time"

**Initial Dashboard Setup:**
- 📈 **Daily Counters:** 0/3 articles, 0/3 videos (TYPE_A)
- 📚 **Full Catalog Access:** Browse all content immediately
- 🎯 **Strategic Tips:** Content selection guidance
- ⏰ **Reset Timer:** Next limit refresh countdown

### **🌅 Daily User Experience**

#### **Login & Daily Status Dashboard**
```mermaid
graph TD
    A[User Logs In] --> B[Daily Status Check]
    B --> C[Display Usage: 2/3 Articles]
    B --> D[Display Usage: 1/3 Videos]
    B --> E[Show Re-access List]
    C --> F[Browse All Content]
    D --> F
    E --> F
    F --> G[Strategic Content Selection]
```

**Dashboard Elements:**
- 📊 **Usage Counters:** Real-time daily consumption tracking
- 📈 **Progress Bars:** Visual representation of limit usage
- 🔄 **Re-access Panel:** Content available for free revisit
- ⏰ **Reset Timer:** "Fresh limits in 8 hours 23 minutes"
- 📱 **Mobile Optimized:** Full functionality across devices

#### **Enhanced Content Discovery (Unlimited)**
✅ **Always Available:**
- 📚 **Complete Article Library:** See every published article
- 🎥 **Full Video Catalog:** Browse all available videos
- 🔍 **Advanced Search:** Filter by tags, categories, dates, authors
- 📖 **Rich Metadata:** Titles, excerpts, thumbnails, reading time
- 📱 **Responsive Browsing:** Seamless mobile and desktop experience
   - Access video content
   - Use search functionality

### **Content Consumption Flow**

```mermaid
graph TD
    A[Login Success] --> B[View Dashboard]
    B --> C[Browse Content]
    C --> D[Select Article/Video]
    D --> E[Check Membership Limit]
    E --> F{Limit Reached?}
    F -->|No| G[Access Content]
    F -->|Yes| H[Upgrade Prompt]
    G --> I[Track Usage]
    I --> J[Update Counter]
    H --> K[Contact Admin for Upgrade]
```

### **Daily Usage Pattern**
1. **Morning:** Check new articles
2. **Commute:** Watch videos on mobile
3. **Break Time:** Read quick articles
4. **Evening:** Deep-dive content consumption

### **Limit Management**
- **TYPE_A Users (3/3 limit):**
  - Real-time counter display
  - Warning at 2/3 usage
  - Upgrade suggestions at limit
  - Monthly reset notification

### **Upgrade Request Process**
1. **Hit Content Limit** → See upgrade prompt
2. **Contact Admin** via platform
3. **Admin Reviews** upgrade request
4. **Tier Change** (TYPE_A → TYPE_B → TYPE_C)
5. **Immediate Access** to expanded content

---

## ✏️ Editor Journey

### **Editor Onboarding**
1. **Start as Regular User** (standard registration)
2. **Request Editor Access** from admin
3. **Admin Promotes Role** (user → editor)
4. **Access CMS Features** immediately

### **Content Creation Workflow**

#### **Dashboard Access**
- **URL:** http://localhost:3000/dashboard
- **New Interface:** Complete article creation form
- **Permissions Check:** Automatic role verification

#### **Article Creation Process**

```mermaid
graph TD
    A[Access Dashboard] --> B[Fill Article Form]
    B --> C[Add Required Fields]
    C --> D[Add Optional Metadata]
    D --> E[Preview Content]
    E --> F[Submit for Publishing]
    F --> G[Auto-Publish]
    G --> H[Visible to All Users]
```

### **Article Form Fields**

#### **Required Fields:**
- **Title:** SEO-optimized headline
- **Content:** Full article body (Markdown supported)

#### **Optional Fields:**
- **Excerpt:** Summary for listings
- **Category:** Content classification
- **Tags:** Comma-separated keywords
- **Featured Image:** Header image URL
- **Publication Status:** Draft/Published

### **Content Management Features**
1. **Create Articles** via web form
2. **Edit Existing Content** (own articles)
3. **Bulk Operations** (coming soon)
4. **Content Analytics** (view only)

### **Editor Daily Workflow**
1. **Login** to dashboard
2. **Check Content Calendar** (planned feature)
3. **Write New Articles** using web form
4. **Review Published Content**
5. **Monitor Engagement** metrics

---

## 👑 Admin Journey

### **Admin Responsibilities**
- **User Management:** Role assignments and upgrades
- **Content Oversight:** Full edit/delete permissions
- **Platform Administration:** System monitoring
- **API Access:** Full backend integration

### **Admin Dashboard Features**

#### **User Management Panel**
- **View All Users** with filtering
- **Role Management:** Promote user → editor → admin
- **Membership Control:** Upgrade user tiers
- **User Statistics:** Registration trends, engagement

#### **Content Management**
- **Full CRUD Access:** Create, Read, Update, Delete
- **Content Moderation:** Review flagged content
- **Bulk Operations:** Mass updates and deletions
- **Analytics Dashboard:** Content performance metrics

### **Admin Workflow Examples**

#### **Promoting a User to Editor**
1. **Access User Management** via dashboard
2. **Search User** by email/name
3. **Click "Change Role"** button
4. **Select "Editor"** from dropdown
5. **Confirm Changes** → User gets immediate access

#### **Handling Membership Upgrades**
1. **Review Upgrade Requests** in admin panel
2. **Verify User Activity** and engagement
3. **Approve Upgrade:** TYPE_A → TYPE_B → TYPE_C
4. **Send Notification** to user
5. **Monitor Usage** post-upgrade

### **API Management**
- **Swagger Dashboard:** http://localhost:5001/api-docs
- **Direct API Access:** All endpoints with admin privileges
- **System Monitoring:** Server health and performance
- **Database Management:** User and content operations

---

## 🔧 Technical Integration

### **Authentication Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant G as Google OAuth
    participant DB as Database

    Note over U,DB: Email/Password Registration
    U->>F: Fill Registration Form
    F->>B: POST /api/auth/register
    B->>B: Validate & Hash Password
    B->>DB: Create User Account
    B->>F: JWT Token + User Data
    F->>U: Logged In Dashboard

    Note over U,DB: Google OAuth with Account Linking
    U->>F: Click "Continue with Google"
    F->>B: Redirect to /auth/google
    B->>G: OAuth Authorization
    G->>U: Google Login Page
    U->>G: Enter Credentials
    G->>B: Authorization Code + Profile
    B->>DB: Check for Existing Email
    alt Email Exists (Account Linking)
        B->>DB: Link Google ID to Local Account
        Note right of B: Maintains local auth as primary
    else New Email
        B->>DB: Create New Account with Google Data
    end
    B->>F: JWT Token + Linked Status
    F->>U: Dashboard with Linking Notification
```

### **Content Access Control**

```mermaid
graph TD
    A[User Requests Content] --> B[Check Authentication]
    B --> C{Authenticated?}
    C -->|No| D[Show Guest Preview]
    C -->|Yes| E[Check Membership Limits]
    E --> F{Limit Available?}
    F -->|Yes| G[Grant Access + Track Usage]
    F -->|No| H[Show Upgrade Options]
    G --> I[Update Usage Counter]
    D --> J[Show Login Prompt]
```

### **Role-Based Access Control (RBAC)**

| Feature | Guest | User | Editor | Admin |
|---------|-------|------|--------|-------|
| Browse Content | ✅ | ✅ | ✅ | ✅ |
| Read Articles | ❌ | ✅ (Limited) | ✅ | ✅ |
| Watch Videos | ❌ | ✅ (Limited) | ✅ | ✅ |
| Create Content | ❌ | ❌ | ✅ | ✅ |
| Edit Content | ❌ | ❌ | ✅ (Own) | ✅ (All) |
| Delete Content | ❌ | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ❌ | ✅ |

---

## 📚 API Documentation

### **Authentication Endpoints**
```http
# Email/Password Authentication
POST /api/auth/register     # User registration with email/password
POST /api/auth/login        # User login with email/password

# OAuth Authentication
GET /api/auth/google        # Google OAuth initiation
GET /api/auth/google/callback # Google OAuth callback with account linking
GET /api/auth/facebook      # Facebook OAuth initiation  
GET /api/auth/facebook/callback # Facebook OAuth callback

# User Profile Management
GET /api/users/me          # Get current user profile
PUT /api/users/me          # Update user profile
POST /api/auth/logout      # Logout user (clears session)
```

### **Public Endpoints**
```http
GET /api/articles          # Browse articles (paginated)
GET /api/articles/{id}     # Get single article
GET /api/videos           # Browse videos (paginated)
GET /api/videos/{id}      # Get single video
GET /health               # System health check
```

### **Authenticated Endpoints**
```http
# User Management
GET /api/users/me         # Get current user profile
PUT /api/users/me         # Update user profile

# Content Access (with limits)
POST /api/articles/{id}/read    # Track article read
POST /api/videos/{id}/watch     # Track video watch
```

### **Editor Endpoints**
```http
POST /api/articles        # Create new article
PUT /api/articles/{id}    # Update own article
GET /api/articles/drafts  # Get draft articles
```

### **Admin Endpoints**
```http
# User Management
GET /api/users            # List all users
PUT /api/users/{id}/role  # Change user role
PUT /api/users/{id}/tier  # Update membership tier
DELETE /api/users/{id}    # Delete user account

# Content Management
DELETE /api/articles/{id} # Delete any article
PUT /api/articles/{id}    # Edit any article
GET /api/analytics        # Platform analytics
```

### **Authentication Headers**
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## 🛠️ User Journey Testing Scenarios

### **Scenario 1: New User Registration & Onboarding**

**Email/Password Registration Flow:**
1. **Visit:** http://localhost:3000
2. **Browse:** Article listings as guest
3. **Try Reading:** Hit paywall after excerpt
4. **Register:** Click login → Toggle to "Create Account"
5. **Fill Form:** Name, email, password, confirm password
6. **Submit:** Instant account creation with JWT token
7. **First Login:** Access dashboard with TYPE_A membership
8. **Content Access:** Use allowance (3 articles, 3 videos)
9. **Hit Limit:** See upgrade prompt with admin contact

**Google OAuth Registration Flow:**
1. **Visit:** http://localhost:3000
2. **Quick Register:** Click "Continue with Google"
3. **OAuth Flow:** Google authentication and consent
4. **Account Creation:** Auto-populated profile from Google
5. **Dashboard Access:** Immediate TYPE_A membership
6. **Content Consumption:** Start with full allowance

**Account Linking Scenario:**
1. **Existing User:** Already has local account (test@example.com)
2. **OAuth Attempt:** Clicks "Continue with Google" with same email
3. **Automatic Linking:** System links Google profile to existing account
4. **Notification:** "Google account linked successfully"
5. **Dual Access:** Can now login via email/password OR Google OAuth

### **Scenario 2: Content Creator Journey**
1. **Register:** Via email/password or Google OAuth
2. **Build Reputation:** Engage with platform content
3. **Request Access:** Email admin for editor role promotion
4. **Get Promoted:** Admin changes role from user to editor
5. **Dashboard Access:** New CMS interface appears
6. **Create Content:** Use comprehensive article creation form
7. **Publish:** Articles go live immediately for all users
8. **Manage:** Edit, update, and track content performance

### **Scenario 3: Returning User Experience**
1. **Visit Login Page:** Choose preferred authentication method
2. **Email/Password:** Quick login with saved credentials
3. **OAuth Login:** One-click Google/Facebook authentication
4. **Session Restore:** Automatic dashboard redirect
5. **Content Resume:** Pick up where left off with usage tracking
6. **Cross-Device:** Seamless experience across devices

### **Scenario 3: Platform Administration**
1. **Admin Login:** firdausamerta@gmail.com (email/password or OAuth)
2. **User Management:** Promote users to editors, manage roles
3. **Membership Control:** Upgrade user tiers (TYPE_A → TYPE_B → TYPE_C)
4. **Content Oversight:** Review, edit, and moderate all content
5. **System Monitoring:** Check API health and user analytics
6. **Bulk Operations:** Manage multiple users and content efficiently

### **Scenario 4: Authentication Security Testing**
1. **Password Validation:** Test weak passwords (rejected)
2. **Duplicate Registration:** Try registering same email twice (blocked)
3. **Invalid Login:** Test wrong credentials (proper error handling)
4. **Account Linking:** Test OAuth with existing email (automatic linking)
5. **Session Management:** Test token expiration and refresh
6. **Cross-Browser:** Verify authentication across different browsers

---

## 🔍 Search & Discovery

### **Content Search Features**
- **Debounced Search:** 500ms delay for smooth typing
- **Real-time Results:** Updates as you type
- **Multi-field Search:** Searches title, content, tags
- **Category Filtering:** Filter by content type
- **Pagination:** Handle large result sets

### **Search Journey**
```mermaid
graph TD
    A[User Types Query] --> B[500ms Debounce]
    B --> C[API Request]
    C --> D[Backend Search]
    D --> E[Return Results]
    E --> F[Update UI]
    F --> G[User Clicks Result]
    G --> H[Check Access Permissions]
    H --> I[Grant or Restrict Access]
```

---

## 📱 Mobile Experience

### **Responsive Design**
- **Breakpoints:** Mobile, Tablet, Desktop
- **Touch Optimization:** Larger buttons, swipe gestures
- **Performance:** Optimized loading for mobile networks
- **Offline Support:** Cached content (coming soon)

### **Mobile User Flow**
1. **Home Screen:** Quick access to popular content
2. **Swipe Navigation:** Easy content browsing
3. **Touch-friendly Forms:** Easy article creation
4. **One-thumb Usage:** Optimized UI layout

---

## 🔔 Notifications & Communication

### **User Notifications**
- **Limit Warnings:** When approaching content limits
- **New Content:** Fresh articles and videos
- **Role Changes:** Promotion notifications
- **System Updates:** Platform announcements

### **Admin Communications**
- **User Requests:** Editor role applications
- **System Alerts:** Performance issues
- **Content Reports:** Moderation needs
- **Analytics Reports:** Usage statistics

---

## 📊 Analytics & Tracking

### **User Metrics**
- **Content Consumption:** Articles read, videos watched
- **Engagement Time:** Time spent on platform
- **Search Queries:** Popular content discovery
- **Conversion Rates:** Guest → User → Paid

### **Content Metrics**
- **Popular Articles:** Most read content
- **Video Engagement:** Watch time and completion
- **Search Rankings:** Content discoverability
- **User Feedback:** Engagement signals

---

## 🚨 Error Handling & Support

### **Common Error Scenarios**

#### **Authentication Errors**
- **Google OAuth Failure:** Redirect to error page with retry
- **JWT Expiration:** Auto-refresh or re-login prompt
- **Permission Denied:** Clear error message with upgrade path

#### **Content Access Errors**
- **Limit Reached:** Friendly upgrade suggestion
- **Content Not Found:** 404 with related suggestions
- **Server Issues:** Graceful degradation with retry options

### **User Support Flow**
1. **Error Occurs** → Clear error message
2. **Self-Service Options** → FAQ, troubleshooting guides
3. **Contact Support** → Admin email or form
4. **Admin Resolution** → Direct user assistance
5. **Follow-up** → Ensure issue resolved

---

## 🔮 Future Enhancements

### **Planned Features**
- **Advanced Editor:** Rich text editing with media upload
- **Content Calendar:** Editorial planning tools
- **Social Features:** Comments, likes, sharing
- **Advanced Analytics:** Detailed user insights
- **Mobile App:** Native iOS/Android applications
- **Payment Integration:** Premium membership automation
- **Content Recommendations:** AI-powered suggestions

### **User Journey Evolution**
- **Personalization:** Customized content feeds
- **Gamification:** Reading streaks, achievements
- **Community Features:** User interactions and discussions
- **Multi-language Support:** International expansion
- **Offline Mode:** Download content for offline reading

---

## ✅ Current Implementation Status

### **Completed Features** ✅
- [x] **Comprehensive Authentication System**
  - [x] Email/password registration and login with secure bcrypt hashing
  - [x] Google OAuth integration with automatic account linking
  - [x] Facebook OAuth support
  - [x] Unified login/registration interface with dynamic form switching
  - [x] JWT token authentication with configurable expiration
  - [x] Real-time form validation and comprehensive error handling
- [x] **Enhanced User Experience**
  - [x] Toggle between login and registration modes on single page
  - [x] Account linking notifications and status feedback
  - [x] Loading states and progress indicators
  - [x] Responsive design for all device types
- [x] User registration and social authentication
- [x] Role-based access control (User/Editor/Admin)
- [x] Membership tiers with content limits
- [x] Article creation and management
- [x] Interactive API documentation (Swagger)
- [x] Search functionality with debouncing
- [x] Responsive web design
- [x] Content consumption tracking
- [x] Admin user management
- [x] Real-time form validation

### **In Development** 🚧
- [ ] Video content management
- [ ] Advanced content editor with rich text editing
- [ ] User analytics dashboard with detailed metrics
- [ ] Email notifications for user actions
- [ ] Content moderation tools and reporting
- [ ] Advanced search filters and sorting options

### **Future Roadmap** 📋
- [ ] Mobile application (React Native)
- [ ] Payment processing for automatic tier upgrades
- [ ] Advanced search filters and content recommendations
- [ ] Social media integration and sharing
- [ ] AI-powered content suggestions
- [ ] Multi-language support and internationalization
- [ ] Progressive Web App (PWA) capabilities
- [ ] Real-time notifications and websockets

---

## 🚨 Setup Troubleshooting Guide

### **Common Setup Issues & Solutions**

#### **1. MongoDB Connection Issues**
```bash
# Problem: "Command find requires authentication" or "Connection refused"

# Solution 1: Verify MongoDB container
docker compose ps
docker compose logs mongodb

# Solution 2: Restart MongoDB service
docker compose down mongodb
docker compose up -d mongodb

# Solution 3: Check MongoDB authentication
docker exec -it social-media-mongodb mongosh -u admin -p password --authenticationDatabase admin
```

#### **2. Test Data Population Fails**
```bash
# Problem: populate:test-data script fails

# Solution 1: Verify NODE_ENV
echo $NODE_ENV  # Should be 'development'

# Solution 2: Check environment file
cat .env | grep NODE_ENV
cat .env | grep MONGODB_URI

# Solution 3: Force development environment
NODE_ENV=development npm run populate:test-data
```

#### **3. Port Conflicts**
```bash
# Problem: "Port already in use" errors

# Solution: Check what's using the ports
lsof -i :3000  # Frontend port
lsof -i :5001  # Backend port
lsof -i :27017 # MongoDB port
lsof -i :6379  # Redis port

# Kill processes if needed
kill -9 <PID>
```

#### **4. Docker Issues**
```bash
# Problem: Docker containers won't start

# Solution 1: Clean Docker state
docker compose down
docker system prune -f
docker compose up -d mongodb redis

# Solution 2: Check Docker resources
docker stats
docker system df

# Solution 3: Restart Docker Desktop (if on Mac/Windows)
```

#### **5. Frontend Build Issues**
```bash
# Problem: React app won't start or build

# Solution 1: Clear node_modules
rm -rf node_modules apps/frontend/node_modules
npm install

# Solution 2: Clear cache
npm cache clean --force
rm -rf apps/frontend/build

# Solution 3: Check TypeScript compilation
npm run type-check
```

#### **6. Backend API Issues**
```bash
# Problem: Backend server won't start

# Solution 1: Check environment variables
cat .env
npm run dev:backend

# Solution 2: Verify database connection
curl http://localhost:5001/health

# Solution 3: Check logs for specific errors
npm run dev:backend 2>&1 | grep -i error
```

### **Testing Verification Checklist**

#### **✅ Before Testing - Verify These URLs Work:**
- [ ] **Frontend:** http://localhost:3000 → Shows login/homepage
- [ ] **Backend Health:** http://localhost:5001/health → Returns OK status
- [ ] **API Docs:** http://localhost:5001/api-docs → Shows Swagger UI
- [ ] **MongoDB:** `docker exec -it social-media-mongodb mongosh` → Can connect

#### **✅ Test Data Verification:**
```bash
# Verify test data was created successfully
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"user123"}'

# Should return JWT token and user info
```

#### **✅ Daily Limits Testing Checklist:**
- [ ] Login with `user@test.com` (TYPE_A user)
- [ ] Browse articles page → See all 5 articles
- [ ] Access 3 articles → Should work normally
- [ ] Try 4th article → Should show limit reached message
- [ ] Revisit previous article → Should work (free re-access)
- [ ] Check usage counter → Shows 3/3 used

### **Performance Optimization**

#### **If Application Runs Slowly:**
```bash
# Increase Node.js memory (if needed)
export NODE_OPTIONS="--max-old-space-size=4096"

# Monitor resource usage
docker stats
top -p $(pgrep node)

# Check database performance
docker exec social-media-mongodb mongosh --eval "db.stats()"
```

#### **Quick Reset Commands**
```bash
# Complete environment reset
docker compose down
docker system prune -f
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
docker compose up -d mongodb redis
npm run populate:test-data
npm run dev
```

### **Getting Help**

#### **Log Collection for Debugging**
```bash
# Collect comprehensive logs
mkdir debug-logs
docker compose logs > debug-logs/docker.log
npm run dev:backend > debug-logs/backend.log 2>&1 &
npm run dev:frontend > debug-logs/frontend.log 2>&1 &
```

#### **System Information**
```bash
# Gather system info for troubleshooting
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Docker: $(docker --version)"
echo "OS: $(uname -a)"
docker compose version
```

---

## 🎯 Key Success Metrics

### **User Engagement**
- **Daily Active Users:** Target 1000+ DAU
- **Authentication Conversion:** 30+ % guest to registered user conversion
- **Account Linking:** 80+ % OAuth users link to existing accounts successfully
- **Session Duration:** 15+ minutes average browsing time
- **Return Rate:** 70+ % weekly return for registered users

### **Authentication Performance**
- **Registration Success:** 95+ % successful registrations
- **Login Speed:** <2s authentication response time
- **OAuth Flow:** <10s complete Google/Facebook login process
- **Account Linking:** 100% automatic linking for matching emails
- **Security Compliance:** 0 password breaches, secure bcrypt hashing

### **Content Performance**
- **Article Creation:** 10+ new articles weekly
- **Content Engagement:** 85+ % article completion rate
- **Search Success:** 90+ % query satisfaction
- **Load Performance:** <2s page load times
- **Mobile Usage:** 60+ % traffic from mobile devices

### **Business Metrics**
- **User Conversion:** 20+ % guest to user registration
- **Tier Upgrades:** 15+ % users upgrade membership tiers
- **Content Consumption:** Users hit 80+ % of tier limits monthly
- **Platform Growth:** 25+ % monthly user growth
- **OAuth Adoption:** 60+ % users prefer social login methods

---

*This user journey documentation provides a comprehensive guide for all platform stakeholders, from end users to administrators and developers. Regular updates ensure accuracy as the platform evolves.*

**Last Updated:** June 14, 2025  
**Version:** 2.0  
**Next Review:** June 28, 2025
