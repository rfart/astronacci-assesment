# Social Media Platform - TypeScript Monorepo

A comprehensive social media platform built with TypeScript, featuring a React frontend, Express backend, and MongoDB database. The platform includes membership tiers, social authentication, and content management capabilities.

## 🎉 **CURRENT STATUS: FULLY OPERATIONAL WITH INTERACTIVE API DOCS**

✅ **Development Environment Ready**
- Backend API running on port 5001
- Frontend React app running on port 3000  
- MongoDB and Redis containers running
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

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB (local or cloud)
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd astronacci-assesment
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment (create manually)
echo "REACT_APP_API_URL=http://localhost:5001/api" > apps/frontend/.env
```

4. **Start Database Services**
```bash
# Start MongoDB and Redis with Docker
docker compose up -d mongodb redis
```

5. **Start Development Servers**
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:frontend    # Frontend on http://localhost:3000
npm run dev:backend     # Backend on http://localhost:5001
```

**🚀 Your application will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001
- Health Check: http://localhost:5001/health
- **📚 Interactive API Documentation: http://localhost:5001/api-docs**

4. **Configure OAuth (Optional)**
   - Create Google OAuth credentials
   - Create Facebook App credentials
   - Update environment variables

5. **Start development servers**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev:frontend    # Frontend only
npm run dev:backend     # Backend only
npm run dev:shared      # Shared package
```

### Using Docker

1. **Start with Docker Compose**
```bash
docker-compose up -d
```

2. **View logs**
```bash
docker-compose logs -f
```

3. **Stop services**
```bash
docker-compose down
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

## 🛠️ Daily Limits Implementation Details

### Backend Architecture

#### **Enhanced User Model**
```typescript
// New fields added to User schema
interface UserDocument {
  // Existing fields...
  dailyArticlesAccessed: number;     // Count of articles accessed today
  dailyVideosAccessed: number;       // Count of videos accessed today
  lastAccessDate: Date;              // Last access date for daily reset tracking
  accessedContentToday: {
    articles: string[];              // Array of article IDs accessed today
    videos: string[];                // Array of video IDs accessed today
  };
}
```

#### **Smart Access Methods**
- **`checkAndResetDailyLimit()`**: Automatically resets counters at midnight
- **`canAccessContentDetail()`**: Checks access permission with detailed reasoning
- **`recordContentAccess()`**: Records access only on first visit per day

#### **Controller Updates**
- **Article/Video Listing**: No restrictions, all content visible to all users
- **Article/Video Detail**: Daily limit checking with smart re-access logic
- **Membership Status**: Real-time usage information in API responses

### Frontend Enhancements

#### **UI Components**
- **Progress Bars**: Visual daily usage indicators
- **Membership Cards**: Clear tier information and benefits
- **Error Handling**: Specific messages for daily limit scenarios
- **Re-access Indicators**: Shows when content can be revisited for free

#### **User Experience Flow**
1. **Browse Phase**: User sees all available content
2. **Selection Phase**: User chooses content to consume
3. **Access Phase**: System checks daily limits and content history
4. **Consumption Phase**: Content delivered with usage tracking
5. **Re-access Phase**: Free revisits to consumed content

### Data Migration

#### **Existing Users Update**
Run the provided migration script to update existing users:
```bash
cd apps/backend
npm run migrate:daily-limits
```

The script adds new daily tracking fields to all existing user records:
- Sets initial daily counters to 0
- Initializes empty content access arrays
- Sets current date as last access date

## 🔄 Migration to Daily Limits System

### **For Existing Installations**

If you have an existing installation with the old monthly limits system, follow these steps to migrate to the new daily limits system:

#### **Step 1: Update Codebase**
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
npm install
```

#### **Step 2: Run Database Migration**
```bash
# Navigate to backend directory
cd apps/backend

# Run the migration script to update existing users
npm run migrate:daily-limits

# Alternative: Run directly with ts-node
npx ts-node scripts/update-user-daily-limits.ts
```

#### **Step 3: Verify Migration**
```bash
# Check that all users have new daily limit fields
# The migration script will output the number of users updated

# Example output:
# Connected to database
# Updated 150 users with new daily limit fields
# Total users with daily limit fields: 150
# Migration completed successfully
```

#### **Step 4: Test the System**
1. **Login to Frontend** → http://localhost:3000
2. **Check Daily Status** → Should show "0/3 articles, 0/3 videos accessed today"
3. **Access Content** → Verify daily limits work correctly
4. **Test Re-access** → Verify free re-access to consumed content
5. **Wait for Reset** → Test daily reset functionality

### **Migration Script Details**

The migration script (`apps/backend/scripts/update-user-daily-limits.ts`):
- ✅ **Adds new fields** to existing user documents
- ✅ **Initializes counters** to 0 for all users
- ✅ **Sets up content tracking** arrays
- ✅ **Preserves existing data** (no data loss)
- ✅ **Idempotent operation** (safe to run multiple times)

#### **New User Fields Added:**
```typescript
dailyArticlesAccessed: 0        // Daily article counter
dailyVideosAccessed: 0          // Daily video counter
lastAccessDate: new Date()      // For daily reset tracking
accessedContentToday: {
  articles: [],                 // Today's accessed article IDs
  videos: []                    // Today's accessed video IDs
}
```

### **For Fresh Installations**

Fresh installations automatically include the daily limits system:

```bash
# Clone and setup
git clone <repository-url>
cd astronacci-assesment
npm install

# Start with daily limits system
npm run dev
```

**No migration needed** - all users created after this update will automatically have daily limit tracking.

### API Changes

#### **Response Structure Updates**
```typescript
// New membership status in listing responses
{
  "membershipStatus": {
    "tier": "TYPE_A",
    "dailyLimit": 3,
    "dailyUsed": 1,
    "dailyRemaining": 2,
    "message": "1/3 daily articles accessed"
  }
}
```

#### **Error Handling**
```typescript
// New error code for daily limits
{
  "success": false,
  "message": "Daily article limit reached (3/3). Try again tomorrow or upgrade your membership.",
  "code": "DAILY_LIMIT_REACHED"
}
```

### Benefits of New System

#### **For Users**
- 🎯 **Better Content Discovery**: See everything available
- 🔄 **Flexible Access**: Re-read/rewatch without penalties
- 📅 **Daily Fresh Start**: New opportunities every day
- 📊 **Clear Usage Tracking**: Know exactly where you stand

#### **For Platform**
- 📈 **Increased Engagement**: Daily return visits encouraged
- 💰 **Better Monetization**: Strategic upgrade motivation
- 📊 **Rich Analytics**: Detailed usage pattern insights
- 🎨 **Improved UX**: No artificial browsing restrictions

#### **Technical Advantages**
- 🚀 **Scalable**: Easy to modify limits or add features
- 🛡️ **Robust**: Comprehensive error handling and edge cases
- 🔧 **Maintainable**: Clean separation of concerns
- 🧪 **Testable**: Clear business logic and data flows

## 📊 Content Management

### Content Types
- **Articles**: Rich text content with categories
- **Videos**: Video content with metadata
- **Categories**: Hierarchical organization

### CMS Features
- Content creation and editing
- Publishing workflow
- Analytics dashboard
- Bulk operations
- Media management

## 🛠️ API Documentation

### Interactive Swagger Documentation

The API includes comprehensive **Swagger/OpenAPI 3.0** documentation with an interactive interface:

**🌐 Live Documentation**: http://localhost:5001/api-docs

#### Features:
- **Interactive Testing**: Test all API endpoints directly from the browser
- **Authentication Support**: Built-in JWT token authentication testing
- **Request/Response Examples**: Complete examples for all endpoints
- **Schema Validation**: Detailed request/response schema documentation
- **Error Handling**: Comprehensive error response documentation

#### Quick API Overview:

### Authentication Endpoints
```
# Email/Password Authentication
POST   /api/auth/register       # User registration with email/password
POST   /api/auth/login          # User login with email/password

# OAuth Authentication  
GET    /api/auth/google         # Google OAuth initiation
GET    /api/auth/google/callback # Google OAuth callback with account linking
GET    /api/auth/facebook       # Facebook OAuth initiation
GET    /api/auth/facebook/callback # Facebook OAuth callback

# User Management
GET    /api/auth/profile        # Get current user profile
PUT    /api/auth/membership     # Update membership tier
POST   /api/auth/logout         # Logout user
```

### Content Endpoints
```
GET    /api/articles             # List articles
GET    /api/articles/:id         # Get article
POST   /api/articles             # Create article (Auth)
PUT    /api/articles/:id         # Update article (Auth)
DELETE /api/articles/:id         # Delete article (Admin)

GET    /api/videos               # List videos
GET    /api/videos/:id           # Get video
POST   /api/videos               # Create video (Auth)
PUT    /api/videos/:id           # Update video (Auth)
DELETE /api/videos/:id           # Delete video (Admin)
```

### Management Endpoints
```
GET    /api/cms/dashboard        # Dashboard stats (Admin/Editor)
GET    /api/cms/analytics        # Content analytics (Admin/Editor)
POST   /api/cms/bulk             # Bulk operations (Admin/Editor)

GET    /api/users                # List users (Admin)
GET    /api/users/:id            # Get user (Admin)
PUT    /api/users/:id/role       # Update user role (Admin)
DELETE /api/users/:id            # Delete user (Admin)
```

### Testing Daily Limits System

### **Manual Testing Scenarios**

#### **Scenario 1: Basic Daily Limit Testing**
1. **Create TYPE_A User** (3 articles, 3 videos daily)
2. **Access 3 Articles** → Verify counter increments (1/3, 2/3, 3/3)
3. **Try 4th Article** → Should show "Daily limit reached" message
4. **Re-access Article 1** → Should work FREE (no counter increment)
5. **Browse Listings** → Should work without restrictions

#### **Scenario 2: Daily Reset Testing**
```bash
# Option 1: Wait for midnight (real-time testing)
# Access content before midnight
# Check limits reset after midnight

# Option 2: Manual testing with date manipulation
# Temporarily modify system date for testing
# Verify reset behavior
```

#### **Scenario 3: Re-access Logic Testing**
1. **Morning:** Access "React Tutorial" article (1/3 used)
2. **Afternoon:** Re-access same article → Should be FREE
3. **Evening:** Re-access again → Should still be FREE
4. **Check Counter:** Should still show 1/3 used

#### **Scenario 4: Mixed Content Testing**
1. **Access 2 Articles** (2/3 used)
2. **Access 2 Videos** (2/3 used)
3. **Re-access Previous Content** → All should be FREE
4. **Access 1 More Article** (3/3 used)
5. **Try New Video** (3/3 used)
6. **Try Additional Content** → Should hit limits

### **API Testing with Swagger**

Access interactive API documentation: http://localhost:5001/api-docs

#### **Test Daily Limits via API**
```bash
# 1. Register/Login user
POST /api/auth/register
POST /api/auth/login

# 2. Get articles list (should show all content)
GET /api/articles

# 3. Access article detail (should consume daily limit)
GET /api/articles/{id}

# 4. Check user status
GET /api/users/profile

# 5. Re-access same article (should be free)
GET /api/articles/{id}
```

### **Automated Testing**

#### **Backend Unit Tests**
```bash
cd apps/backend
npm test

# Test coverage includes:
# - User model methods (checkAndResetDailyLimit, canAccessContentDetail, recordContentAccess)
# - Controller logic (daily limit checking, re-access detection)
# - Membership tier enforcement
# - Daily reset functionality
```

#### **Frontend Component Tests**
```bash
cd apps/frontend
npm test

# Test coverage includes:
# - Daily status display components
# - Usage progress bars
# - Membership status cards
# - Error handling for daily limits
# - Re-access indicators
```

#### **Integration Tests**
```bash
# Full user flow testing
npm run test:integration

# Covers:
# - End-to-end daily limit workflow
# - Cross-browser compatibility
# - Mobile responsive behavior
# - Authentication + daily limits interaction
```

#### **Performance Testing**

##### **Load Testing Daily Reset**
```bash
# Test system behavior during daily reset
# Simulate multiple users accessing content simultaneously
# Verify counter accuracy under concurrent access
```

##### **Database Performance**
```bash
# Test query performance with daily limit fields
# Verify indexing on lastAccessDate field
# Monitor response times for content access checks
```

### **Troubleshooting Common Issues**

#### **Daily Limits Not Resetting**
```bash
# Check user's lastAccessDate field
# Verify timezone handling in daily reset logic
# Test checkAndResetDailyLimit() method manually
```

#### **Re-access Not Working**
```bash
# Verify content ID tracking in accessedContentToday arrays
# Check recordContentAccess() method implementation
# Test with different content types (articles vs videos)
```

#### **Counter Discrepancies**
```bash
# Verify atomic operations in recordContentAccess()
# Check for race conditions in concurrent access
# Test counter consistency across sessions
```

### **Monitoring & Analytics**

#### **Daily Usage Metrics**
- Track average daily consumption per membership tier
- Monitor upgrade conversion rates after limit hits
- Analyze re-access patterns and frequency
- Measure user engagement with daily reset feature

#### **System Health Checks**
```bash
# Monitor daily reset operations
# Track API response times for limit checks
# Monitor database performance for daily queries
# Alert on unusual usage patterns or errors
```

## 🔧 Development

### Scripts
```bash
# Development
npm run dev                     # Start all services
npm run dev:frontend           # Frontend development
npm run dev:backend            # Backend development

# Building
npm run build                  # Build all packages
npm run build:frontend         # Build frontend
npm run build:backend          # Build backend
npm run build:shared           # Build shared package

# Testing
npm test                       # Run all tests
npm run test:frontend          # Frontend tests
npm run test:backend           # Backend tests

# Linting
npm run lint                   # Lint all packages
npm run lint:fix               # Fix lint issues

# Documentation
open http://localhost:5001/api-docs  # Open Swagger docs
curl http://localhost:5001/health    # Test API health
```

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Husky** for git hooks

## 🚀 Deployment

### Production Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/social-media-platform
JWT_SECRET=your-production-jwt-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
```

#### Frontend
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_APP_ID=your-facebook-app-id
```

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Cloud Deployment Options
- **AWS**: ECS, EKS, or Elastic Beanstalk
- **Google Cloud**: Cloud Run or GKE
- **Azure**: Container Instances or AKS
- **Digital Ocean**: App Platform
- **Heroku**: Container deployment

---

Built with ❤️ using TypeScript, React, and Express.js
