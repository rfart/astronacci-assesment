# 🚀 Complete User Journey Documentation
## Social Media Platform - Astronacci Assessment

*Last Updated: June 14, 2025*

---

## 📖 Table of Contents

1. [Platform Overview](#platform-overview)
2. [User Types & Roles](#user-types--roles)
3. [Guest User Journey](#guest-user-journey)
4. [Regular User Journey](#regular-user-journey)
5. [Editor Journey](#editor-journey)
6. [Admin Journey](#admin-journey)
7. [Technical Integration](#technical-integration)
8. [API Documentation](#api-documentation)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Platform Overview

The **Astronacci Social Media Platform** is a content management and consumption platform featuring:

- **Content Types:** Articles & Videos
- **Authentication:** Google OAuth integration
- **Membership Tiers:** TYPE_A, TYPE_B, TYPE_C with content limits
- **Role-Based Access:** User, Editor, Admin permissions
- **Interactive API:** Swagger documentation with live testing

### **Key URLs**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Docs:** http://localhost:5001/api-docs
- **Health Check:** http://localhost:5001/health

---

## 👥 User Types & Roles

### **Authentication Roles**
- **🔓 Guest:** Browse public content only
- **👤 User:** Registered members with content consumption limits
- **✏️ Editor:** Can create and edit content
- **👑 Admin:** Full platform management access

### **Authentication Methods**
- **📧 Email/Password:** Traditional registration and login
- **🔐 Google OAuth:** Social login with automatic account linking
- **📘 Facebook OAuth:** Alternative social login option
- **🔗 Account Linking:** Seamless integration between local and OAuth accounts

### **Membership Tiers**
- **TYPE_A:** 3 articles, 3 videos
- **TYPE_B:** 10 articles, 10 videos  
- **TYPE_C:** Unlimited access

---

## 🔍 Guest User Journey

### **Entry Points**
1. **Direct URL Access:** http://localhost:3000
2. **Search Engine:** Landing on article pages
3. **Social Media:** Shared content links

### **Guest Experience Flow**

```mermaid
graph TD
    A[Visit Platform] --> B[Browse Homepage]
    B --> C[View Article List]
    C --> D[Read Public Articles]
    C --> E[Watch Public Videos]
    D --> F[See Login Prompt for More]
    E --> F
    F --> G[Click Login Button]
    G --> H[Google OAuth]
    H --> I[Become Registered User]
```

### **Available Actions**
✅ **Can Do:**
- Browse article listings
- Read article excerpts
- View public video previews
- Access platform navigation
- See registration prompts

❌ **Cannot Do:**
- Read full articles
- Watch complete videos
- Access dashboard
- Create content
- Save favorites

### **Conversion Touchpoints**
1. **Article Paywall:** After reading excerpt
2. **Video Preview End:** Call-to-action to register
3. **Navigation Bar:** Prominent login button
4. **Footer:** Registration benefits

---

## 👤 Regular User Journey

### **Onboarding Process**

#### **Step 1: Registration Options**

Users can register through multiple methods:

**Option A: Email/Password Registration**
1. **Click "Login"** on any page
2. **Toggle to "Create Account"** mode
3. **Fill Registration Form:**
   - Full name (required)
   - Email address (required, validated)
   - Password (required, minimum 6 characters)
   - Confirm password (must match)
4. **Submit Form** → Instant account creation
5. **Automatic Login** with JWT token

**Option B: Google OAuth Registration**
1. **Click "Login"** on any page
2. **Click "Continue with Google"** button
3. **Google OAuth Flow:**
   ```
   Platform → Google → Authorization → Account Creation → Redirect
   ```
4. **Account Linking Check:**
   - If email exists: Links to existing local account
   - If new email: Creates new account with Google profile data

**Option C: Facebook OAuth Registration**
1. **Click "Login"** on any page
2. **Click "Continue with Facebook"** button
3. **Facebook OAuth Flow** (similar to Google)

#### **Step 2: Login Process**

**Email/Password Login:**
1. **Enter credentials** in login form
2. **Backend validation:**
   - Email format check
   - Password verification with bcrypt
   - Account status validation
3. **JWT token generation** on success
4. **Redirect to dashboard** with user session

**OAuth Login:**
1. **OAuth provider authentication**
2. **Account linking logic:**
   - Existing local account: Links OAuth profile
   - New user: Creates account with OAuth data
3. **JWT token generation** and redirect

#### **Step 3: Profile Creation & Setup**
1. **Welcome Dashboard** shows:
   - User profile (name, email, avatar)
   - Default membership: TYPE_A (3 articles, 3 videos)
   - Default role: user
   - Content limits and usage tracking

2. **Platform Exploration:**
   - Browse full article library
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
