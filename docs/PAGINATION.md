# Pagination Implementation with Membership Restrictions

## Overview

This document describes the pagination implementation for articles and videos in the social media platform, including membership-based content restrictions. The system enforces different access levels based on user membership tiers while providing clear feedback about limitations.

## Membership Tiers & Limits

### Content Access Limits
- **TYPE_A (Basic)**: 3 articles, 3 videos
- **TYPE_B (Premium)**: 10 articles, 10 videos  
- **TYPE_C (VIP)**: Unlimited articles, unlimited videos
- **Admin**: Unlimited access to all content

## Backend Implementation

### Article Pagination (`/apps/backend/src/controllers/articleController.ts`)

- **Endpoint**: `GET /api/articles`
- **Authentication**: Optional (uses `optionalAuthenticateToken` middleware)
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category (optional)
  - `search`: Search in title, content, and tags (optional)
- **Response Format**:
  ```json
  {
    "success": true,
    "data": [...],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    },
    "membershipLimit": {
      "hasReachedLimit": false,
      "limit": 3,
      "used": 0,
      "totalAvailable": 25,
      "hasMoreContent": true,
      "message": "You can access 3 articles with TYPE_A membership. 22 more articles available with upgrade."
    }
  }
  ```

### Membership Restrictions Logic

1. **Content Listing Restrictions**: Users can only see articles/videos up to their membership limit in the listing
2. **Pagination Limits**: Pagination reflects only accessible content for the user's tier
3. **Admin Override**: Admin users bypass all restrictions and see all content
4. **Guest Users**: Unauthenticated users see all content (no restrictions apply)

### Video Pagination (`/apps/backend/src/controllers/videoController.ts`)

- **Endpoint**: `GET /api/videos`
- **Authentication**: Optional (uses `optionalAuthenticateToken` middleware)
- **Same query parameters and response format as articles**

### Membership Limit Response Fields

```typescript
membershipLimit?: {
  hasReachedLimit: boolean;     // True if user has hit their viewing limit
  limit: number;                // Total allowed for this membership tier
  used: number;                 // How many they've already viewed
  totalAvailable: number;       // Total content available in system
  hasMoreContent?: boolean;     // True if there's content beyond their limit
  message: string;              // User-friendly explanation
}
```

### Search Functionality

Both endpoints support full-text search across multiple fields:
- **Articles**: title, content, tags
- **Videos**: title, description, tags

Search uses MongoDB regex with case-insensitive matching.

## Frontend Implementation

### Pagination Component (`/apps/frontend/src/components/Pagination.tsx`)

A reusable pagination component with the following features:
- Smart page number display with ellipsis
- Previous/Next navigation buttons
- Current page highlighting
- Responsive design with Tailwind CSS
- Optimal cognitive complexity (reduced from 17 to under 15)
- Proper React keys (no array index usage)

### Articles Page (`/apps/frontend/src/pages/Articles.tsx`)

- Grid layout displaying 12 articles per page
- Search functionality with debounced input (500ms delay)
- Responsive card design with image, title, excerpt, author, and tags
- Loading states and empty state handling
- Integration with the reusable Pagination component

### Videos Page (`/apps/frontend/src/pages/Videos.tsx`)

- Grid layout displaying 12 videos per page
- Search functionality with debounced input (500ms delay)
- Video cards with thumbnail, title, description, duration, and tags
- Loading states and empty state handling
- Integration with the reusable Pagination component

### Services

#### Article Service (`/apps/frontend/src/services/articleService.ts`)
```typescript
getArticles: async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<ArticlesResponse>
```

#### Video Service (`/apps/frontend/src/services/videoService.ts`)
```typescript
getVideos: async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}): Promise<VideosResponse>
```

## Features

### ✅ Implemented Features

1. **Backend Pagination with Membership Restrictions**
   - MongoDB query with skip/limit
   - Membership-based content limiting
   - Different limits for TYPE_A (3), TYPE_B (10), TYPE_C (unlimited)
   - Admin users bypass all restrictions
   - Total count calculation respects membership limits
   - Smart pagination metadata
   - Search and filter support

2. **Frontend Pagination with Membership Warnings**
   - Reusable Pagination component
   - Smart page number display with ellipsis
   - Membership limit warning banners
   - Visual progress bars showing usage vs limits
   - Upgrade prompts with clear messaging
   - Debounced search input
   - Loading and empty states
   - Responsive design

3. **Membership Limit UI Features**
   - Yellow warning banners for approaching limits
   - Red error banners when limits are reached
   - Progress bars showing usage (e.g., "2/3 articles accessed")
   - Clear upgrade messaging
   - Different empty states for no content vs restricted access
   - Responsive design for all screen sizes

4. **Search Functionality**
   - Full-text search across multiple fields
   - Case-insensitive matching
   - Real-time search with debouncing
   - Search works within membership limits
   - Search query highlights

5. **Code Quality & Security**
   - TypeScript type safety with proper interfaces
   - Optional authentication middleware
   - Proper error handling
   - Clean code patterns with reduced cognitive complexity
   - No lint warnings or errors
   - Proper React key usage
   - Security through membership enforcement

### 🎯 Technical Details

- **Performance**: Efficient MongoDB queries with proper indexing
- **UX**: Smooth pagination with loading states and visual feedback
- **Responsive**: Works on all device sizes
- **Accessible**: Proper ARIA labels and keyboard navigation
- **Maintainable**: Reusable components and clean separation of concerns

## Testing

### Backend Endpoints

```bash
# Test article pagination with basic user (TYPE_A - limited to 3 articles)
curl -H "Authorization: Bearer <TYPE_A_TOKEN>" \
  "http://localhost:5001/api/articles?page=1&limit=12"

# Test reaching membership limit (page 2 for TYPE_A user)
curl -H "Authorization: Bearer <TYPE_A_TOKEN>" \
  "http://localhost:5001/api/articles?page=2&limit=12"

# Test admin access (unlimited)
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:5001/api/articles?page=1&limit=12"

# Test video pagination with membership limits
curl -H "Authorization: Bearer <TYPE_A_TOKEN>" \
  "http://localhost:5001/api/videos?page=1&limit=12"

# Test search functionality within membership limits
curl -H "Authorization: Bearer <TYPE_A_TOKEN>" \
  "http://localhost:5001/api/articles?page=1&limit=10&search=test"

# Test without authentication (guest access - no limits)
curl "http://localhost:5001/api/articles?page=1&limit=12"
```

### Expected Responses

#### TYPE_A User (Basic - 3 article/video limit)
```json
{
  "success": true,
  "data": [...], // Only 3 items max
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 3,
    "pages": 1
  },
  "membershipLimit": {
    "hasReachedLimit": false,
    "limit": 3,
    "used": 0,
    "totalAvailable": 10,
    "hasMoreContent": true,
    "message": "You can access 3 articles with TYPE_A membership. 7 more articles available with upgrade."
  }
}
```

#### Admin User (Unlimited Access)
```json
{
  "success": true,
  "data": [...], // All available items
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 10,
    "pages": 1
  },
  "membershipLimit": null // No restrictions
}
```

#### User Reaching Limit
```json
{
  "success": true,
  "data": [], // Empty when limit reached
  "pagination": {
    "page": 2,
    "limit": 12,
    "total": 0,
    "pages": 0
  },
  "membershipLimit": {
    "hasReachedLimit": true,
    "limit": 3,
    "used": 0,
    "totalAvailable": 10,
    "message": "You have reached your 3-article limit for TYPE_A membership. Upgrade to access more content."
  }
}
```

### Frontend Pages

- Articles: `http://localhost:3000/articles`
- Videos: `http://localhost:3000/videos`

## Future Enhancements

### Possible Improvements

1. **Infinite Scrolling**: Alternative to traditional pagination
2. **Advanced Filters**: Date range, author, multiple categories
3. **Sort Options**: By date, popularity, alphabetical
4. **Server-Side Caching**: Redis for popular queries
5. **Analytics**: Track popular searches and pages
6. **SEO**: URL parameters for shareable paginated content

### Performance Optimizations

1. **Database Indexes**: Ensure proper indexing for search fields
2. **Query Optimization**: Aggregation pipelines for complex filters
3. **Client-Side Caching**: Cache results for recently viewed pages
4. **Image Optimization**: Lazy loading and responsive images
5. **Bundle Splitting**: Code splitting for pagination component

## Conclusion

The pagination implementation provides a solid foundation for content discovery with both backend and frontend working seamlessly together. The code is maintainable, performant, and user-friendly, with proper error handling and responsive design.
