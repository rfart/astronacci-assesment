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

## 👥 Membership System

### Membership Tiers

| Tier | Articles/Month | Videos/Month | Features |
|------|---------------|--------------|----------|
| **Type A** | 3 | 3 | Basic access, Free |
| **Type B** | 10 | 10 | Premium content, $9.99/month |
| **Type C** | Unlimited | Unlimited | All features, $19.99/month |

### Content Access Control
- Automatic enforcement based on membership tier
- View tracking per user
- Graceful upgrade prompts

## 🔐 Authentication & Authorization

### OAuth Providers
- **Google OAuth 2.0**
- **Facebook Login**

### User Roles
- **User**: Basic content access
- **Editor**: Content creation and editing
- **Admin**: Full system access

### Security Features
- JWT token authentication
- Role-based access control
- Session management
- Rate limiting
- Input validation

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
GET    /api/auth/google          # Google OAuth
GET    /api/auth/facebook        # Facebook OAuth
GET    /api/auth/profile         # Get user profile
PUT    /api/auth/membership      # Update membership
POST   /api/auth/logout          # Logout user
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

### Testing with Swagger UI

1. **Open Swagger Documentation**: http://localhost:5001/api-docs
2. **Authenticate**: Click "Authorize" button and enter JWT token
3. **Test Endpoints**: Click on any endpoint to expand and test
4. **View Responses**: See real-time responses and status codes

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

## 📈 Monitoring & Analytics

### Available Metrics
- User registration and engagement
- Content views and popularity
- Membership conversion rates
- API performance and errors
- Database performance

### Recommended Tools
- **Application**: New Relic, DataDog
- **Database**: MongoDB Atlas Monitoring
- **Frontend**: Google Analytics, Sentry
- **Infrastructure**: Prometheus + Grafana

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run linting and tests
6. Submit a pull request

### Code Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Maintain test coverage above 80%

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Frontend Documentation](apps/frontend/README.md)
- [Backend Documentation](apps/backend/README.md)
- [API Documentation](docs/API.md)
- [**📚 Interactive Swagger Documentation**](docs/SWAGGER.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection
```bash
# Check MongoDB status
mongo --eval "db.adminCommand('ismaster')"

# Reset database
npm run db:reset
```

#### OAuth Configuration
- Verify redirect URLs in OAuth providers
- Check environment variables
- Ensure HTTPS in production

#### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear TypeScript cache
npx tsc --build --clean
```

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Contact the development team

---

Built with ❤️ using TypeScript, React, and Express.js
