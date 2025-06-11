# API Documentation

## Base URL
```
http://localhost:5001/api
```

## Authentication

### OAuth Routes

#### Google OAuth
```http
GET /auth/google
```
Initiates Google OAuth flow. Redirects to Google authentication.

#### Facebook OAuth
```http
GET /auth/facebook
```
Initiates Facebook OAuth flow. Redirects to Facebook authentication.

#### OAuth Callback
```http
GET /auth/google/callback
GET /auth/facebook/callback
```
Handles OAuth callbacks and redirects to frontend with JWT token.

### Profile Routes

#### Get Current User Profile
```http
GET /auth/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "avatar": "https://avatar-url.com",
    "membershipType": "TYPE_A",
    "role": "user",
    "isActive": true,
    "createdAt": "2025-06-11T10:00:00.000Z"
  }
}
```

#### Update Membership
```http
PUT /auth/membership
Authorization: Bearer <token>
Content-Type: application/json

{
  "membershipType": "TYPE_B"
}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer <token>
```

## Articles

#### Get All Articles
```http
GET /articles
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `search` (string): Search in title and content

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "article_id",
      "title": "Article Title",
      "content": "Article content...",
      "excerpt": "Brief excerpt...",
      "slug": "article-slug",
      "author": "author_id",
      "category": "category_id",
      "tags": ["tag1", "tag2"],
      "featuredImage": "https://image-url.com",
      "isPublished": true,
      "viewCount": 150,
      "createdAt": "2025-06-11T10:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Get Article by ID
```http
GET /articles/:id
```

#### Create Article (Admin/Editor only)
```http
POST /articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Article",
  "content": "Article content...",
  "excerpt": "Brief excerpt...",
  "category": "category_id",
  "tags": ["tag1", "tag2"],
  "featuredImage": "https://image-url.com"
}
```

#### Update Article (Admin/Editor only)
```http
PUT /articles/:id
Authorization: Bearer <token>
```

#### Delete Article (Admin only)
```http
DELETE /articles/:id
Authorization: Bearer <token>
```

## Videos

#### Get All Videos
```http
GET /videos
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `search` (string): Search in title and description

#### Get Video by ID
```http
GET /videos/:id
```

#### Create Video (Admin/Editor only)
```http
POST /videos
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Video Title",
  "description": "Video description...",
  "url": "https://video-url.com",
  "thumbnail": "https://thumbnail-url.com",
  "category": "category_id",
  "duration": 300,
  "tags": ["tag1", "tag2"]
}
```

## Categories

#### Get All Categories
```http
GET /categories
```

#### Create Category (Admin only)
```http
POST /categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Category description...",
  "slug": "category-slug"
}
```

## Users (Admin only)

#### Get All Users
```http
GET /users
Authorization: Bearer <token>
```

#### Get User by ID
```http
GET /users/:id
Authorization: Bearer <token>
```

#### Update User
```http
PUT /users/:id
Authorization: Bearer <token>
```

#### Delete User
```http
DELETE /users/:id
Authorization: Bearer <token>
```

## CMS Routes (Admin/Editor only)

#### Get Dashboard Stats
```http
GET /cms/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalArticles": 45,
    "totalVideos": 23,
    "totalCategories": 8,
    "newUsersToday": 5,
    "newContentToday": 3
  }
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

API endpoints are rate-limited to 100 requests per 15 minutes per IP address.

## Membership Tiers

- **TYPE_A**: Access to 3 articles and 3 videos
- **TYPE_B**: Access to 10 articles and 10 videos  
- **TYPE_C**: Unlimited access to all content

Content access is automatically controlled based on the user's membership tier.
