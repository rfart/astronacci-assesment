# Social Media Platform - TypeScript Monorepo

A comprehensive social media platform built with TypeScript, featuring a React frontend, Express backend, and MongoDB database. The platform includes **revolutionary date-based daily content access limits**, social authentication, and content management capabilities.

## 🎉 **CURRENT STATUS: FULLY OPERATIONAL WITH ADVANCED DAILY TRACKING**

✅ **Development Environment Ready**
- Backend API running on port 5001
- Frontend React app running on port 3000  
- MongoDB and Redis containers running
- **🗓️ Date-based daily limits system operational**
- **⚡ Real-time usage tracking and smart re-access**
- Authentication system configured
- Tailwind CSS styling working
- All TypeScript compilation errors resolved
- **📚 Interactive Swagger API Documentation active**

## 🏗️ Architecture

### Monorepo Structure
```
astronacci-assesment/
├── apps/
│   ├── frontend/          # React TypeScript frontend
│   └── backend/           # Express TypeScript backend
├── packages/
│   └── shared/           # Shared types and utilities
├── scripts/              # Database and deployment scripts
├── docker-compose.yml    # Docker orchestration
└── package.json         # Workspace configuration
```

### Technology Stack

#### Frontend
- **React 18** with TypeScript
- **Tailwind CSS v3** for styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

#### Backend
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **Passport.js** for OAuth (Google/Facebook)
- **JWT** for authentication
- **bcrypt** for password hashing

#### Shared
- **TypeScript** for type safety
- **Shared types** and utilities
- **ESLint** for code quality

## 🚀 Complete Setup Guide

### Prerequisites
- **Node.js 18+** (Required)
- **npm** or **yarn** (Required)
- **Docker & Docker Compose** (Required for MongoDB)
- **Git** (Required)

### Step-by-Step Installation

#### 1. **Clone & Install Dependencies**
```bash
# Clone the repository
git clone <repository-url>
cd astronacci-assesment

# Install all dependencies (frontend, backend, shared)
npm install
```

#### 2. **Environment Configuration**
```bash
# Copy and configure environment variables
cp .env.example .env

# Edit .env file with your settings:
# - NODE_ENV=development
# - MONGODB_URI=mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin
# - JWT_SECRET=your-secret-key
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (optional)
# - FACEBOOK_APP_ID & FACEBOOK_APP_SECRET (optional)
```

#### 3. **Start Database Services**
```bash
# Start MongoDB and Redis containers
docker compose up -d mongodb redis

# Verify containers are running
docker compose ps
```

#### 4. **Populate Test Data** 🎯
```bash
# Populate database with test users, articles, and videos
npm run populate:test-data

# This creates:
# - 4 test users (admin, user, editor, premium)
# - 5 sample articles with rich content
# - 5 sample videos with metadata
```

#### 5. **Start Development Servers**
```bash
# Option A: Start everything at once
npm run dev

# Option B: Start individually
npm run dev:backend     # Backend on http://localhost:5001
npm run dev:frontend    # Frontend on http://localhost:3000

# Option C: Start shared package watcher (for development)
npm run dev:shared      # Watches shared types
```

### 🌐 **Application URLs**
After successful setup, access your application at:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **API Documentation**: http://localhost:5001/api-docs *(Interactive Swagger UI)*
- **Health Check**: http://localhost:5001/health

### 🔐 **Test User Credentials**
After running `npm run populate:test-data`, use these accounts:

| Role | Email | Password | Membership | Daily Limits |
|------|-------|----------|------------|--------------|
| **Admin** | admin@test.com | admin123 | TYPE_C | Unlimited |
| **User** | user@test.com | user123 | TYPE_A | 3 articles, 3 videos |
| **Editor** | editor@test.com | editor123 | TYPE_B | 10 articles, 10 videos |
| **Premium** | premium@test.com | premium123 | TYPE_C | Unlimited |

### 🧪 **Testing the Daily Limits System**

1. **Login** with `user@test.com` (TYPE_A - 3 daily articles, 3 videos)
2. **Browse Content** - Notice you can see ALL articles and videos in listings
3. **Access Articles** - Click on article details (counts against daily limit)
4. **Track Usage** - Watch the usage counter update in real-time
5. **Re-access Content** - Revisit previously accessed content (FREE!)
6. **Reach Limits** - Try accessing more content after reaching daily limits
7. **Test Different Users** - Login with different membership tiers

### 🐋 **Docker Alternative Setup**
If you prefer running everything in containers:

```bash
# Start all services including frontend and backend
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down
```

### 🔧 **Development Tools**

#### Available Scripts
```bash
# Development
npm run dev                 # Start all services
npm run dev:frontend       # Frontend only
npm run dev:backend        # Backend only
npm run dev:shared         # Shared package watcher

# Database
npm run populate:test-data  # Populate test data (development only)

# Building
npm run build              # Build all packages
npm run build:frontend     # Build frontend only
npm run build:backend      # Build backend only

# Type Checking
npm run type-check         # Check types across all packages
```

#### Database Management
```bash
# MongoDB Shell (if using Docker)
docker exec -it social-media-mongodb mongosh -u admin -p password

# View database
use social-media-platform
show collections
db.users.find().pretty()
```

### ⚠️ **Important Notes**

1. **Environment Safety**: The `populate:test-data` script only runs in `NODE_ENV=development`
2. **Database Authentication**: MongoDB requires authentication (configured in docker-compose.yml)
3. **Port Conflicts**: Ensure ports 3000, 5001, 27017, and 6379 are available
4. **Memory Requirements**: Docker services require ~512MB RAM minimum

### 🚨 **Troubleshooting**

#### Common Issues and Solutions

**MongoDB Connection Error**
```bash
# Ensure MongoDB container is running
docker compose up -d mongodb
docker compose logs mongodb
```

**Test Data Population Fails**
```bash
# Check NODE_ENV is set to development
echo $NODE_ENV

# Verify MongoDB authentication
docker exec -it social-media-mongodb mongosh -u admin -p password
```

**Frontend/Backend Won't Start**
```bash
# Check if ports are in use
lsof -i :3000  # Frontend port
lsof -i :5001  # Backend port

# Clear node_modules if needed
rm -rf node_modules apps/*/node_modules packages/*/node_modules
npm install
```

## 👥 Daily Content Access System

### 🔄 **New Daily Limits Implementation**

The platform now uses a **daily content access system** instead of monthly limits. This provides a better user experience by allowing users to see all available content while managing access to detailed views.

### Membership Tiers & Daily Limits

| Tier | Daily Articles | Daily Videos | Features | Price |
|------|---------------|--------------|----------|-------|
| **Type A** | 3 | 3 | Basic daily access, Free | Free |
| **Type B** | 10 | 10 | Enhanced daily access | $9.99/month |
| **Type C** | Unlimited | Unlimited | All features, unlimited access | $19.99/month |

### 🎯 **How Daily Limits Work**

#### **Content Discovery (Unlimited)**
- ✅ **All users can browse all content** in listing pages
- ✅ **Full visibility** of articles and videos
- ✅ **Search and filter** through all available content
- ✅ **See titles, excerpts, and metadata** for all content

#### **Content Access (Daily Limited)**
- 📖 **Article Detail Pages**: Count against daily article limit
- 🎥 **Video Detail Pages**: Count against daily video limit
- 🔄 **Smart Re-access**: Revisiting content accessed earlier today is **FREE**
- 🌙 **Daily Reset**: Limits reset automatically at midnight

#### **Key Features**
1. **📅 Daily Reset**: Fresh limits every day at midnight
2. **🔄 Free Re-access**: No double-counting for content revisits
3. **👀 Full Content Discovery**: Browse everything, decide what to read/watch
4. **📊 Usage Tracking**: Real-time progress bars and usage indicators
5. **🛡️ Graceful Limits**: Clear messaging when daily limits are reached

### Content Access Control
- ✅ **Browse Unlimited**: All users see all content listings
- ⚡ **Daily Tracking**: Smart counting with re-access protection
- 🎯 **Strategic Access**: Users can choose which content to consume
- 📈 **Engagement Driven**: Encourages daily platform visits

## 🔐 Authentication & Authorization

### Authentication Methods
- **Email/Password Registration & Login**
  - Secure bcrypt password hashing (12 salt rounds)
  - Password validation (minimum 6 characters)
  - Account creation with instant JWT token
  - Local account management
- **OAuth Social Login**
  - **Google OAuth 2.0** with account linking
  - **Facebook Login** support
  - Automatic account linking for existing email addresses
  - Seamless integration between local and OAuth accounts

### Authentication Features
- **Unified Login Experience**: Single login page supporting both email/password and OAuth
- **Account Linking**: Google OAuth automatically links to existing local accounts with matching emails
- **Secure Password Management**: bcrypt hashing with salt rounds for maximum security
- **Form Validation**: Real-time validation for registration and login forms
- **Error Handling**: Comprehensive error messages and user feedback

### User Roles
- **User**: Basic content access with membership tier limits
- **Editor**: Content creation and editing capabilities
- **Admin**: Full system access and user management

### Security Features
- JWT token authentication with configurable expiration
- Role-based access control (RBAC)
- Password strength validation
- Account linking security checks
- Rate limiting and input validation
- Secure session management

## 🛠️ Advanced Daily Limits System - Date-Based Tracking

### **Revolutionary Self-Managing Daily Access System**

The platform features an **intelligent date-based daily tracking system** that automatically manages user content access without requiring scheduled resets or background jobs. This system tracks content consumption in real-time and dynamically calculates daily usage based on access timestamps.

### **Core Features**

#### **🗓️ Smart Date-Based Logic**
- **Self-Updating Counters**: Users automatically reset their own limits when accessing content on a new day
- **No Manual Resets**: System detects date changes dynamically during user interaction
- **Precise Tracking**: Each content access is timestamped for accurate daily calculations
- **Real-Time Accuracy**: Usage counts are always current for the present day

#### **📊 Enhanced Data Architecture**
```typescript
// User access tracking with timestamps
accessedContentToday: {
  articles: [
    {
      contentId: "article_id_here",
      accessDate: "2025-06-14T13:36:46.966Z",
      _id: "unique_access_id"
    }
  ],
  videos: [
    {
      contentId: "video_id_here", 
      accessDate: "2025-06-14T09:15:23.142Z",
      _id: "unique_access_id"
    }
  ]
}
```

#### **⚡ Key Methods**
- **`getTodayAccess(contentType)`**: Dynamically counts content accessed today
- **`hasAccessedToday(contentType, contentId)`**: Checks for free re-access eligibility
- **`checkAndResetDailyLimit()`**: Updates lastAccessDate when date changes
- **`recordContentAccess(contentType, contentId)`**: Records new access with timestamp

### **Membership Tiers & Daily Limits**

| Tier | Daily Articles | Daily Videos | Price | Special Features |
|------|---------------|--------------|-------|------------------|
| **TYPE_A** | 3 | 3 | Free | Basic daily access with smart re-access |
| **TYPE_B** | 10 | 10 | $9.99/month | Enhanced daily access + priority support |
| **TYPE_C** | Unlimited | Unlimited | $19.99/month | Complete freedom + premium features |

### **User Experience Flow**

#### **🔍 Content Discovery (Always Unlimited)**
- ✅ **Browse All Content**: Users see complete article and video libraries
- ✅ **Full Search Access**: Advanced filtering and search capabilities
- ✅ **Rich Metadata**: Titles, excerpts, thumbnails, and reading time
- ✅ **No Browsing Restrictions**: Complete catalog visibility for all users

#### **📖 Content Consumption (Daily Limited)**
```mermaid
graph TD
    A[User Clicks Article/Video] --> B[Check Last Access Date]
    B --> C{Same Day?}
    C -->|No| D[Fresh Start: 0 Usage]
    C -->|Yes| E[Count Today's Access]
    D --> F[Check Content Already Accessed]
    E --> F
    F --> G{Already Accessed Today?}
    G -->|Yes| H[FREE Re-access]
    G -->|No| I[Check Daily Limit]
    I --> J{Limit Reached?}
    J -->|No| K[Grant Access + Record]
    J -->|Yes| L[Show Upgrade Prompt]
    K --> M[Update Access Date]
    H --> N[Content Delivered]
    M --> N
```

#### **🔄 Smart Re-Access Logic**
1. **Morning Access**: User reads "React Tutorial" (1/3 used)
2. **Afternoon Re-Access**: Same article → FREE (still 1/3 used)
3. **Evening Re-Access**: Same article → FREE (still 1/3 used)
4. **Next Day**: Fresh 3/3 limit automatically available

#### **📱 Real-Time UI Indicators**
- **Progress Bars**: Visual daily usage tracking
- **Usage Counters**: "2/3 daily articles accessed"
- **Membership Status**: Live tier information and benefits
- **Re-Access Labels**: "Previously accessed today - FREE"

### **Technical Implementation**

#### **Backend Architecture**

##### **Enhanced User Model**
```typescript
interface UserDocument {
  // Date-based tracking fields
  lastAccessDate: Date;              // Last content access date
  accessedContentToday: {
    articles: [{
      contentId: string;              // Article ID
      accessDate: Date;               // Precise access timestamp
      _id: ObjectId;                  // Unique access record ID
    }];
    videos: [{
      contentId: string;              // Video ID
      accessDate: Date;               // Precise access timestamp
      _id: ObjectId;                  // Unique access record ID
    }];
  };
  
  // Legacy fields (maintained for compatibility)
  dailyArticlesAccessed: number;     // Deprecated but kept
  dailyVideosAccessed: number;       // Deprecated but kept
  articlesRead: number;              // Total lifetime count
  videosWatched: number;             // Total lifetime count
}
```

##### **Smart Access Methods**
```typescript
// Dynamic daily usage calculation
getUserDailyUsage(contentType: 'article' | 'video'): number {
  const today = new Date().toDateString();
  const lastAccess = new Date(this.lastAccessDate).toDateString();
  
  // If last access wasn't today, usage is 0
  if (today !== lastAccess) return 0;
  
  // Count accesses from today
  return this.accessedContentToday[contentType + 's']
    .filter(access => new Date(access.accessDate).toDateString() === today)
    .length;
}
```

#### **Controller Updates**
- **Article/Video Listing**: No restrictions, includes real-time membership status
- **Article/Video Detail**: Date-based limit checking with timestamp recording
- **Membership Status**: Dynamic daily usage calculation in API responses

### **Frontend Enhancements**

#### **📊 Live Usage Display**
```typescript
// Membership status in API responses
membershipStatus: {
  tier: "TYPE_A",
  dailyLimit: 3,
  dailyUsed: 2,                     // Calculated in real-time
  dailyRemaining: 1,                // Auto-updated
  message: "2/3 daily articles accessed"
}
```

#### **🎯 User Interface Features**
- **Dynamic Progress Bars**: Real-time usage visualization
- **Smart Error Messages**: Context-aware limit notifications
- **Re-Access Indicators**: Visual cues for free re-access content
- **Membership Cards**: Clear tier benefits and upgrade paths

## 📚 Complete Documentation

### **🚀 For Testers & QA**
- **[⚡ 5-Minute Tester Setup](./TESTER-SETUP-GUIDE.md)** - Quick setup guide for testing
- **[🚀 Quick Start Guide](./QUICK-START.md)** - Developer quick start
- **[🗺️ Complete User Journey](./docs/USER-JOURNEY.md)** - Comprehensive user flows and testing scenarios

### **🔧 For Developers**
- **[📋 API Documentation](http://localhost:5001/api-docs)** - Interactive Swagger documentation
- **[🏗️ Complete Architecture](./docs/COMPLETE-ADMIN-SYSTEM.md)** - System architecture details
- **[📖 Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment instructions

### **💡 Key Testing Resources**
- **Test User Accounts**: 4 pre-configured users with different roles and limits
- **Sample Content**: 5 articles + 5 videos with realistic data
- **Interactive API**: Live testing via Swagger UI
- **Real-time Monitoring**: Usage tracking and limit enforcement

---

Built with ❤️ using TypeScript, React, and Express.js
