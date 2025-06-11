# Swagger API Documentation

## 📚 Interactive API Documentation

The Social Media Platform API includes comprehensive **Swagger/OpenAPI 3.0** documentation with a modern, interactive interface.

### 🌐 Access Documentation

**Live Documentation**: http://localhost:5001/api-docs

![Swagger UI Interface](https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=Swagger+UI+Interface)

## ✨ Features

### 🔧 Interactive Testing
- **Try It Out**: Test all API endpoints directly from the browser
- **Real-time Requests**: Send actual HTTP requests to the API
- **Response Validation**: See real server responses and status codes
- **Parameter Testing**: Test different parameter combinations

### 🔐 Authentication Support
- **JWT Bearer Token**: Built-in authentication testing
- **Authorization Header**: Automatic token inclusion in requests
- **OAuth Flows**: Documentation for Google and Facebook OAuth
- **Role-based Testing**: Test different user roles (User, Editor, Admin)

### 📋 Comprehensive Documentation
- **Request/Response Examples**: Complete examples for all endpoints
- **Schema Validation**: Detailed data models and validation rules
- **Error Handling**: All possible error responses documented
- **Parameter Documentation**: Query parameters, path parameters, and request bodies

### 📊 Content Organization
- **Organized by Tags**: Endpoints grouped by functionality
- **Search Functionality**: Quick search across all endpoints
- **Collapsible Sections**: Easy navigation through the API
- **Export Options**: Download OpenAPI specification

## 🚀 Getting Started

### 1. Start the Backend Server
```bash
cd /Users/riyanfirdausamerta/Documents/astronacci-assesment
npm run dev:backend
```

### 2. Open Swagger Documentation
Navigate to: http://localhost:5001/api-docs

### 3. Authenticate (for protected endpoints)
1. Click the **"Authorize"** button at the top right
2. Enter your JWT token in the format: `Bearer <your-token>`
3. Click **"Authorize"** to apply to all requests

### 4. Test an Endpoint
1. Click on any endpoint to expand it
2. Click **"Try it out"**
3. Fill in required parameters
4. Click **"Execute"**
5. View the response below

## 📖 API Structure

### 🏷️ Tags (Categories)

#### **Health**
- Health check and server status endpoints

#### **Authentication**
- OAuth flows (Google, Facebook)
- User profile management
- Membership tier updates
- Session management

#### **Articles**
- CRUD operations for articles
- Content filtering and pagination
- Publishing workflow

#### **Videos**
- CRUD operations for videos
- Video metadata management
- Content organization

#### **Categories**
- Content categorization
- Category management
- Hierarchical organization

#### **Users**
- User management (Admin only)
- Role assignment
- User statistics
- Account operations

#### **CMS**
- Content Management System operations
- Dashboard statistics
- Analytics data
- Bulk operations

## 🔑 Authentication

### JWT Bearer Token Authentication

Most endpoints require authentication using JWT tokens:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### OAuth Flows

#### Google OAuth
1. **Initiate**: `GET /api/auth/google`
2. **Callback**: `GET /api/auth/google/callback`
3. **Result**: Redirect to frontend with JWT token

#### Facebook OAuth
1. **Initiate**: `GET /api/auth/facebook`
2. **Callback**: `GET /api/auth/facebook/callback`
3. **Result**: Redirect to frontend with JWT token

## 📝 Data Models

### User Schema
```typescript
{
  _id: string
  name: string
  email: string
  avatar?: string
  membershipType: 'TYPE_A' | 'TYPE_B' | 'TYPE_C'
  role: 'user' | 'editor' | 'admin'
  isActive: boolean
  createdAt: Date
}
```

### Article Schema
```typescript
{
  _id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  author: string (User ID)
  category?: string (Category ID)
  tags: string[]
  featuredImage?: string
  isPublished: boolean
  viewCount: number
  createdAt: Date
  updatedAt: Date
}
```

### Video Schema
```typescript
{
  _id: string
  title: string
  description?: string
  url: string
  thumbnail?: string
  author: string (User ID)
  category?: string (Category ID)
  duration?: number
  tags: string[]
  isPublished: boolean
  viewCount: number
  createdAt: Date
}
```

### Category Schema
```typescript
{
  _id: string
  name: string
  description?: string
  slug: string
  color?: string
  isActive: boolean
  createdAt: Date
}
```

## 🔒 Role-Based Access Control

### User Roles

| Role | Permissions |
|------|-------------|
| **User** | - View published content<br>- Update own profile<br>- Change membership tier |
| **Editor** | - All User permissions<br>- Create/edit articles and videos<br>- Manage categories<br>- Access CMS dashboard |
| **Admin** | - All Editor permissions<br>- User management<br>- Delete any content<br>- System configuration |

### Membership Tiers

| Tier | Content Access | Monthly Cost |
|------|---------------|--------------|
| **Type A** | 3 articles + 3 videos | Free |
| **Type B** | 10 articles + 10 videos | $9.99 |
| **Type C** | Unlimited access | $19.99 |

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## ⚡ Testing Examples

### Example: Get All Articles
```http
GET /api/articles?page=1&limit=10&category=tech&search=javascript
```

### Example: Create Article (with JWT)
```http
POST /api/articles
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Getting Started with Node.js",
  "content": "Node.js is a powerful runtime...",
  "excerpt": "Learn the basics of Node.js development",
  "category": "64f8a123b456789012345678",
  "tags": ["nodejs", "javascript", "backend"],
  "featuredImage": "https://example.com/image.jpg"
}
```

### Example: Update User Role (Admin only)
```http
PUT /api/users/64f8a123b456789012345678/role
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "role": "editor"
}
```

## 🔧 Advanced Features

### Bulk Operations
The CMS endpoints support bulk operations for efficient content management:

```http
POST /api/cms/bulk
Authorization: Bearer <editor-jwt-token>
Content-Type: application/json

{
  "operation": "publish",
  "contentType": "article",
  "ids": ["id1", "id2", "id3"]
}
```

### Analytics Data
Get detailed analytics for content performance:

```http
GET /api/cms/analytics?startDate=2025-01-01&endDate=2025-01-31&contentType=article
Authorization: Bearer <editor-jwt-token>
```

## 🐛 Troubleshooting

### Common Issues

#### 401 Unauthorized
- Ensure JWT token is included in Authorization header
- Check token format: `Bearer <token>`
- Verify token is not expired

#### 403 Forbidden
- Check user role permissions
- Verify endpoint access requirements
- Confirm user account is active

#### 404 Not Found
- Verify endpoint URL is correct
- Check if resource exists
- Ensure proper API base URL

#### Rate Limiting
- API is limited to 100 requests per 15 minutes per IP
- Implement request throttling in client applications
- Use efficient endpoint calls

## 📚 Additional Resources

- **Postman Collection**: Import OpenAPI spec into Postman
- **Code Generation**: Use OpenAPI spec to generate client SDKs
- **API Testing**: Automated testing with generated schemas
- **Documentation Export**: Download complete API specification

---

**💡 Pro Tip**: Use the Swagger UI's "Authorize" feature to automatically include your JWT token in all API requests during testing!
