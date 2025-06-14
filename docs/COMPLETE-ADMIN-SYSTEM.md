# 🎛️ Complete Admin Management System

## 🚀 Overview

The Social Media Platform now has a complete role-based admin system where:
- ✅ **Any email can register** as a regular user
- ✅ **Admins can promote users** to editor or admin roles
- ✅ **Role-based access control** protects all CMS endpoints
- ✅ **Flexible role management** through API endpoints

## 👥 User Roles

### 🔵 User (Default)
- **Access**: View content based on membership tier
- **Permissions**: Read articles/videos, update own profile
- **Content Limits**: Based on membership (TYPE_A: 3/3, TYPE_B: 10/10, TYPE_C: unlimited)

### 🟡 Editor
- **Access**: Content creation and management
- **Permissions**: 
  - Create, edit articles and videos
  - Manage categories
  - Access CMS dashboard
  - Cannot delete content or manage users

### 🔴 Admin (Full Access)
- **Access**: Complete system control
- **Permissions**:
  - All editor permissions
  - Delete any content
  - Manage users (view, edit, delete, promote/demote)
  - System analytics and statistics
  - Full CMS access

## 🔧 How to Access CMS as Admin

### 1. Login via OAuth
```
http://localhost:5001/api/auth/google
```
Use any Google account - no email restrictions!

### 2. Get Your JWT Token
After successful login, you'll be redirected to:
```
http://localhost:3000/auth/callback?token=YOUR_JWT_TOKEN
```

### 3. Test Admin Access
Use your JWT token to access admin endpoints:

**Check Your Role**:
```bash
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Access CMS Dashboard** (Admin/Editor):
```bash
curl -X GET http://localhost:5001/api/cms/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Manage Users** (Admin Only):
```bash
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Interactive Testing with Swagger
1. **Open**: http://localhost:5001/api-docs
2. **Click "Authorize"** button
3. **Enter**: `Bearer YOUR_JWT_TOKEN`
4. **Test any endpoint** with "Try it out"

## 👑 How to Create Admin Accounts

### Method 1: Promote Existing User (Recommended)

**Step 1**: User registers normally via OAuth
```
http://localhost:5001/api/auth/google
```

**Step 2**: Admin promotes user via API
```bash
curl -X PUT http://localhost:5001/api/users/{USER_ID}/role \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

**Step 3**: User now has admin access immediately

### Method 2: Direct Database Update
```bash
# Connect to MongoDB
mongosh "mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin"

# Promote user to admin
db.users.updateOne(
  {email: "user@example.com"}, 
  {$set: {role: "admin"}}
)
```

### Method 3: Via Swagger UI (Admin Required)
1. **Login as existing admin**
2. **Open**: http://localhost:5001/api-docs
3. **Find**: `PUT /api/users/{id}/role`
4. **Enter user ID and role**: `{"role": "admin"}`
5. **Execute**

## 🎯 Current Admin Status

### ✅ Your Admin Account
- **Email**: `firdausamerta@gmail.com`
- **Role**: `admin` 
- **Membership**: `TYPE_C` (unlimited)
- **Status**: Active

### 🧪 Test Your Admin Access

**Login and get token**:
```bash
# 1. Go to OAuth login
open http://localhost:5001/api/auth/google

# 2. Use your firdausamerta@gmail.com account
# 3. Copy JWT token from redirect URL
```

**Test admin endpoints**:
```bash
# Replace YOUR_TOKEN with actual JWT token

# Check your profile (should show role: admin)
curl -X GET http://localhost:5001/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Access admin dashboard
curl -X GET http://localhost:5001/api/cms/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"

# List all users (admin only)
curl -X GET http://localhost:5001/api/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Promote another user (admin only)
curl -X PUT http://localhost:5001/api/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "editor"}'
```

## 📊 Available Admin Features

### 🎛️ CMS Dashboard
- **Endpoint**: `GET /api/cms/dashboard`
- **Access**: Admin + Editor
- **Features**:
  - Total users, articles, videos, categories
  - Published content statistics
  - New users today
  - Content creation metrics

### 👥 User Management (Admin Only)
- **List Users**: `GET /api/users`
- **Get User**: `GET /api/users/{id}`
- **Update Role**: `PUT /api/users/{id}/role`
- **Update Membership**: `PUT /api/users/{id}/membership`
- **Delete User**: `DELETE /api/users/{id}`
- **User Statistics**: `GET /api/users/stats`

### 📰 Content Management
- **Articles**: Full CRUD (Create: Editor+, Delete: Admin only)
- **Videos**: Full CRUD (Create: Editor+, Delete: Admin only)
- **Categories**: Full CRUD (Create: Editor+, Delete: Admin only)

### 📈 Analytics
- **CMS Analytics**: `GET /api/cms/analytics`
- **Bulk Operations**: `POST /api/cms/bulk`
- **System Overview**: `GET /api/cms/overview`

## 🛡️ Security Features

### 🔐 Authentication
- **JWT Tokens**: Secure token-based authentication
- **OAuth Integration**: Google/Facebook login
- **Token Validation**: Every request verified
- **User Verification**: Active status checked

### 🛃 Authorization
- **Role-Based Access**: Three-tier role system
- **Endpoint Protection**: Each endpoint specifies required roles
- **Dynamic Permissions**: Roles can be changed instantly
- **Audit Trail**: All role changes logged

### 🚨 Rate Limiting
- **API Protection**: Request rate limiting
- **User Safety**: Prevents abuse
- **Performance**: Server protection

## 🔄 Role Management Workflow

### Standard User Journey
1. **Register**: User signs up via OAuth → Gets `user` role
2. **Use Platform**: Access content based on membership tier
3. **Request Promotion**: Contact admin for editor/admin access
4. **Get Promoted**: Admin changes role via API
5. **Immediate Access**: New permissions active instantly

### Admin Workflow
1. **Monitor Users**: Check new registrations
2. **Evaluate Requests**: Review promotion requests
3. **Update Roles**: Use API to promote deserving users
4. **Manage Content**: Oversee platform content quality
5. **System Analytics**: Monitor platform health

## 🚀 Quick Start Checklist

### For New Admins
- [ ] Login via Google OAuth: `http://localhost:5001/api/auth/google`
- [ ] Copy JWT token from redirect URL
- [ ] Test admin access: `GET /api/users` with token
- [ ] Open Swagger UI: `http://localhost:5001/api-docs`
- [ ] Authorize with JWT token
- [ ] Explore all CMS endpoints

### For Creating New Admins
- [ ] Get user's User ID from `GET /api/users`
- [ ] Use `PUT /api/users/{id}/role` with `{"role": "admin"}`
- [ ] Verify promotion with `GET /api/users/{id}`
- [ ] Inform user of new admin access
- [ ] Test admin features together

## 🆘 Troubleshooting

### "Insufficient permissions" Error
```json
{
  "success": false,
  "message": "Insufficient permissions. Required: admin, Your role: user"
}
```
**Solution**: User needs role promotion to access admin endpoints

### Role Update Not Working
- ✅ Check you're using correct User ID (not email)
- ✅ Verify admin JWT token is valid
- ✅ Ensure request body has `{"role": "admin"}`
- ✅ Check user exists: `GET /api/users/{id}`

### OAuth Issues
- ✅ Verify Google Cloud Console redirect URI: `http://localhost:5001/api/auth/google/callback`
- ✅ Check MongoDB connection with credentials
- ✅ Ensure server running on port 5001

## 📞 Support Commands

### Database Queries
```bash
# Check all user roles
mongosh "mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin" \
  --eval "db.users.find({}, {email: 1, role: 1, _id: 0})"

# Promote user to admin
mongosh "mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin" \
  --eval "db.users.updateOne({email: 'user@example.com'}, {\$set: {role: 'admin'}})"

# Count users by role
mongosh "mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin" \
  --eval "db.users.aggregate([{\$group: {_id: '\$role', count: {\$sum: 1}}}])"
```

### Server Status
```bash
# Check server health
curl http://localhost:5001/health

# Verify API docs
curl http://localhost:5001/api-docs
```

---

## 🎉 Congratulations!

Your Social Media Platform now has a complete, flexible admin system where:

✅ **Anyone can register** - No email restrictions  
✅ **Admins can promote users** - Flexible role management  
✅ **Role-based security** - Proper access control  
✅ **Real-time changes** - Instant permission updates  
✅ **Complete CMS access** - Full platform management  

**Your admin account (`firdausamerta@gmail.com`) is ready to manage the platform! 🚀**
