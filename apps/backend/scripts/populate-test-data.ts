#!/usr/bin/env ts-node

import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../src/config/database';
import { User } from '../src/models/User';
import { Article } from '../src/models/Article';
import { Video } from '../src/models/Video';
import { MembershipTier, UserRole } from '@astronacci/shared';

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// Safety check: Only allow in development environment
if (process.env.NODE_ENV !== 'development') {
  console.error('❌ ERROR: This script can only be run in development environment!');
  console.error('   Current NODE_ENV:', process.env.NODE_ENV);
  console.error('   Please set NODE_ENV=development in your .env file');
  process.exit(1);
}

// Check if MongoDB URI is configured
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not configured in .env file');
  console.error('   Please add: MONGODB_URI=mongodb://admin:password@localhost:27017/social-media-platform?authSource=admin');
  process.exit(1);
}

console.log('🔧 Environment Check:');
console.log('   NODE_ENV:', process.env.NODE_ENV);
console.log('   MONGODB_URI:', process.env.MONGODB_URI.replace(/\/\/.*:.*@/, '//***:***@')); // Hide credentials in log
console.log('   ✅ Environment validation passed\n');

interface TestUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  membershipTier: MembershipTier;
}

const testUsers: TestUser[] = [
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    membershipTier: MembershipTier.TYPE_C
  },
  {
    name: 'Test User',
    email: 'user@test.com', 
    password: 'user123',
    role: UserRole.USER,
    membershipTier: MembershipTier.TYPE_A
  },
  {
    name: 'Editor User',
    email: 'editor@test.com',
    password: 'editor123', 
    role: UserRole.EDITOR,
    membershipTier: MembershipTier.TYPE_B
  },
  {
    name: 'Premium User',
    email: 'premium@test.com',
    password: 'premium123',
    role: UserRole.USER,
    membershipTier: MembershipTier.TYPE_C
  }
];

const testArticles = [
  {
    title: 'Getting Started with React TypeScript',
    content: `
# Getting Started with React TypeScript

React with TypeScript provides excellent developer experience with type safety and better tooling support.

## Why TypeScript?

TypeScript brings static type checking to JavaScript, which helps catch errors early in development and provides better IDE support.

## Setting Up

To create a new React TypeScript project:

\`\`\`bash
npx create-react-app my-app --template typescript
\`\`\`

## Basic Component

Here's a simple TypeScript React component:

\`\`\`tsx
import React from 'react';

interface Props {
  name: string;
  age?: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
    </div>
  );
};

export default UserCard;
\`\`\`

This component demonstrates basic TypeScript props typing and optional properties.
    `,
    excerpt: 'Learn how to set up and use React with TypeScript for better development experience.',
    category: 'Technology',
    tags: ['react', 'typescript', 'frontend', 'javascript'],
    featured: true
  },
  {
    title: 'Node.js Best Practices for 2025',
    content: `
# Node.js Best Practices for 2025

Node.js continues to evolve, and here are the best practices for building robust applications in 2025.

## 1. Use TypeScript

TypeScript is no longer optional for serious Node.js applications. It provides:
- Type safety
- Better IDE support
- Easier refactoring
- Self-documenting code

## 2. Error Handling

Always handle errors properly:

\`\`\`typescript
import express from 'express';

const app = express();

app.get('/api/users/:id', async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Global error handler
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(error.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
\`\`\`

## 3. Security

- Use helmet for security headers
- Implement rate limiting
- Validate all inputs
- Use HTTPS in production
    `,
    excerpt: 'Essential best practices for building robust Node.js applications in 2025.',
    category: 'Backend',
    tags: ['nodejs', 'backend', 'best-practices', 'security'],
    featured: false
  },
  {
    title: 'MongoDB Schema Design Patterns',
    content: `
# MongoDB Schema Design Patterns

Designing effective MongoDB schemas requires understanding of common patterns and anti-patterns.

## 1. Embedding vs Referencing

### When to Embed
- Data that is frequently accessed together
- Small, bounded data sets
- Data that doesn't change frequently

\`\`\`javascript
// Embedded approach
{
  _id: ObjectId("..."),
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York",
    zipCode: "10001"
  }
}
\`\`\`

### When to Reference
- Large data sets
- Data that changes frequently
- Many-to-many relationships

\`\`\`javascript
// Referenced approach
// User document
{
  _id: ObjectId("..."),
  name: "John Doe",
  orders: [ObjectId("..."), ObjectId("...")]
}

// Order documents
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  items: [...],
  total: 99.99
}
\`\`\`

## 2. Indexing Strategy

Create indexes based on your query patterns:

\`\`\`javascript
// Compound index for common queries
db.users.createIndex({ "email": 1, "status": 1 });

// Text index for search
db.articles.createIndex({ "title": "text", "content": "text" });
\`\`\`
    `,
    excerpt: 'Learn effective MongoDB schema design patterns for scalable applications.',
    category: 'Database',
    tags: ['mongodb', 'database', 'schema', 'design-patterns'],
    featured: true
  },
  {
    title: 'Modern CSS Grid and Flexbox Techniques',
    content: `
# Modern CSS Grid and Flexbox Techniques

CSS Grid and Flexbox are powerful layout systems that have revolutionized web design.

## CSS Grid

Grid is perfect for two-dimensional layouts:

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.item {
  background: #f0f0f0;
  padding: 1rem;
  border-radius: 8px;
}
\`\`\`

## Flexbox

Flexbox excels at one-dimensional layouts:

\`\`\`css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
}
\`\`\`

## Combining Grid and Flexbox

\`\`\`css
.layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header, .footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Responsive Design

Use CSS Grid and Flexbox together for responsive layouts:

\`\`\`css
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
  
  .navbar {
    flex-direction: column;
    gap: 1rem;
  }
}
\`\`\`
    `,
    excerpt: 'Master modern CSS layout techniques with Grid and Flexbox for responsive designs.',
    category: 'Frontend',
    tags: ['css', 'grid', 'flexbox', 'responsive', 'layout'],
    featured: false
  },
  {
    title: 'API Security: Complete Guide to JWT Authentication',
    content: `
# API Security: Complete Guide to JWT Authentication

JSON Web Tokens (JWT) are a popular method for securing APIs and managing user authentication.

## What is JWT?

JWT is a compact, URL-safe token format that represents claims between two parties.

Structure: \`header.payload.signature\`

## Implementation

### 1. Generate JWT

\`\`\`typescript
import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );
};
\`\`\`

### 2. Verify JWT

\`\`\`typescript
import jwt from 'jsonwebtoken';

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
\`\`\`

### 3. Middleware

\`\`\`typescript
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
\`\`\`

## Best Practices

1. Use strong, unique secrets
2. Set appropriate expiration times
3. Implement token refresh mechanism
4. Store tokens securely on client side
5. Use HTTPS in production
    `,
    excerpt: 'Complete guide to implementing secure JWT authentication in your APIs.',
    category: 'Security',
    tags: ['jwt', 'authentication', 'security', 'api', 'backend'],
    featured: true
  }
];

const testVideos = [
  {
    title: 'React Hooks Deep Dive - useState and useEffect',
    description: 'Comprehensive tutorial covering React Hooks, focusing on useState and useEffect with practical examples and best practices.',
    url: 'https://example.com/videos/react-hooks-deep-dive.mp4',
    thumbnail: 'https://example.com/thumbnails/react-hooks.jpg',
    duration: 1800, // 30 minutes
    category: 'Technology',
    tags: ['react', 'hooks', 'frontend', 'javascript'],
    featured: true
  },
  {
    title: 'Building REST APIs with Express and TypeScript',
    description: 'Step-by-step guide to creating robust REST APIs using Express.js and TypeScript, including middleware, error handling, and testing.',
    url: 'https://example.com/videos/express-typescript-api.mp4',
    thumbnail: 'https://example.com/thumbnails/express-api.jpg',
    duration: 2400, // 40 minutes
    category: 'Backend',
    tags: ['express', 'typescript', 'api', 'backend'],
    featured: false
  },
  {
    title: 'MongoDB Aggregation Pipeline Masterclass',
    description: 'Master MongoDB aggregation pipelines with real-world examples, from basic operations to complex data transformations.',
    url: 'https://example.com/videos/mongodb-aggregation.mp4',
    thumbnail: 'https://example.com/thumbnails/mongodb.jpg',
    duration: 3600, // 60 minutes
    category: 'Database',
    tags: ['mongodb', 'aggregation', 'database', 'queries'],
    featured: true
  },
  {
    title: 'CSS Grid Layout: From Basics to Advanced',
    description: 'Complete CSS Grid tutorial covering everything from basic grid concepts to advanced layout techniques and responsive design.',
    url: 'https://example.com/videos/css-grid-tutorial.mp4',
    thumbnail: 'https://example.com/thumbnails/css-grid.jpg',
    duration: 2700, // 45 minutes
    category: 'Frontend',
    tags: ['css', 'grid', 'layout', 'responsive'],
    featured: false
  },
  {
    title: 'Docker for Developers: Complete Containerization Guide',
    description: 'Learn Docker from scratch including containers, images, volumes, networks, and Docker Compose for development workflows.',
    url: 'https://example.com/videos/docker-tutorial.mp4',
    thumbnail: 'https://example.com/thumbnails/docker.jpg',
    duration: 4200, // 70 minutes
    category: 'DevOps',
    tags: ['docker', 'containers', 'devops', 'deployment'],
    featured: true
  }
];

// Helper functions to reduce complexity
async function createTestUsers(): Promise<any[]> {
  console.log('👥 Creating test users...');
  const createdUsers: any[] = [];
  
  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log(`⚠️  User ${userData.email} already exists, skipping...`);
        createdUsers.push(existingUser);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);
      
      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        membershipTier: userData.membershipTier,
        socialProvider: 'local',
        articlesRead: 0,
        videosWatched: 0,
        dailyArticlesAccessed: 0,
        dailyVideosAccessed: 0,
        lastAccessDate: new Date(),
        accessedContentToday: { articles: [], videos: [] },
        isActive: true
      });
      
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`✅ Created user: ${userData.name} (${userData.email})`);
    } catch (userError: any) {
      console.error(`❌ Failed to create user ${userData.name}:`, userError.message);
    }
  }
  
  return createdUsers;
}

async function createTestArticles(users: any[]): Promise<number> {
  console.log('📝 Creating test articles...');
  const adminUser = users.find(user => user.role === UserRole.ADMIN);
  const editorUser = users.find(user => user.role === UserRole.EDITOR);
  let created = 0;
  
  for (let i = 0; i < testArticles.length; i++) {
    try {
      const articleData = testArticles[i];
      
      // Check if article already exists
      const existingArticle = await Article.findOne({ title: articleData.title });
      if (existingArticle) {
        console.log(`⚠️  Article "${articleData.title}" already exists, skipping...`);
        created++;
        continue;
      }

      const author = i % 2 === 0 ? adminUser : editorUser;
      
      const article = new Article({
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        author: author?._id,
        category: articleData.category,
        tags: articleData.tags,
        featured: articleData.featured,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      
      await article.save();
      created++;
      console.log(`✅ Created article: ${articleData.title}`);
    } catch (articleError: any) {
      console.error(`❌ Failed to create article ${testArticles[i].title}:`, articleError.message);
    }
  }
  
  return created;
}

async function createTestVideos(users: any[]): Promise<number> {
  console.log('🎥 Creating test videos...');
  const adminUser = users.find(user => user.role === UserRole.ADMIN);
  const editorUser = users.find(user => user.role === UserRole.EDITOR);
  let created = 0;
  
  for (let i = 0; i < testVideos.length; i++) {
    try {
      const videoData = testVideos[i];
      
      // Check if video already exists
      const existingVideo = await Video.findOne({ title: videoData.title });
      if (existingVideo) {
        console.log(`⚠️  Video "${videoData.title}" already exists, skipping...`);
        created++;
        continue;
      }

      const author = i % 2 === 0 ? adminUser : editorUser;
      
      const video = new Video({
        title: videoData.title,
        description: videoData.description,
        url: videoData.url,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        author: author?._id,
        category: videoData.category,
        tags: videoData.tags,
        featured: videoData.featured,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      
      await video.save();
      created++;
      console.log(`✅ Created video: ${videoData.title}`);
    } catch (videoError: any) {
      console.error(`❌ Failed to create video ${testVideos[i].title}:`, videoError.message);
    }
  }
  
  return created;
}

function displaySuccessSummary(users: any[], articlesCreated: number, videosCreated: number): void {
  console.log('\n🎉 Test data population completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   👥 Users processed: ${users.length}`);
  console.log(`   📝 Articles processed: ${articlesCreated}`);
  console.log(`   🎥 Videos processed: ${videosCreated}`);
  
  console.log('\n🔐 Test User Credentials:');
  testUsers.forEach(user => {
    console.log(`   ${user.role.toUpperCase()}: ${user.email} / ${user.password} (${user.membershipTier})`);
  });
  
  console.log('\n🚀 You can now test the daily limits system with these accounts!');
  console.log('   • Frontend: http://localhost:3000');
  console.log('   • Backend API: http://localhost:5001');
  console.log('   • API Docs: http://localhost:5001/api-docs');
}

async function populateTestData() {
  try {
    // Additional safety confirmation
    console.log('⚠️  WARNING: This will populate the database with test data!');
    console.log('   - Test users will be created or updated');
    console.log('   - Test articles will be created'); 
    console.log('   - Test videos will be created\n');
    
    console.log('🔗 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database successfully');

    // Clear existing test data only
    console.log('🗑️  Clearing existing test data...');
    try {
      await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
      await Article.deleteMany({ title: { $in: testArticles.map(a => a.title) } });
      await Video.deleteMany({ title: { $in: testVideos.map(v => v.title) } });
      console.log('✅ Existing test data cleared');
    } catch (clearError: any) {
      console.log('⚠️  Could not clear existing data (continuing anyway):', clearError.message);
    }

    // Create test data using helper functions
    const createdUsers = await createTestUsers();
    const articlesCreated = await createTestArticles(createdUsers);
    const videosCreated = await createTestVideos(createdUsers);

    // Display success summary
    displaySuccessSummary(createdUsers, articlesCreated, videosCreated);

  } catch (error: any) {
    console.error('❌ Error populating test data:', error.message);
    if (error.code === 8000) {
      console.error('   💡 Hint: Make sure MongoDB is running with authentication');
      console.error('   Try: docker compose up -d mongodb');
    }
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  populateTestData();
}

export { populateTestData };
