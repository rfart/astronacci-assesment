// MongoDB initialization script
db = db.getSiblingDB('social-media-platform');

// Create admin user
db.createUser({
  user: 'appuser',
  pwd: 'apppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'social-media-platform'
    }
  ]
});

// Create initial collections with indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ socialId: 1, socialProvider: 1 }, { unique: true, sparse: true });

db.articles.createIndex({ title: 1 });
db.articles.createIndex({ category: 1 });
db.articles.createIndex({ author: 1 });
db.articles.createIndex({ createdAt: -1 });
db.articles.createIndex({ isPublished: 1 });

db.videos.createIndex({ title: 1 });
db.videos.createIndex({ category: 1 });
db.videos.createIndex({ author: 1 });
db.videos.createIndex({ createdAt: -1 });
db.videos.createIndex({ isPublished: 1 });

db.categories.createIndex({ name: 1 }, { unique: true });
db.categories.createIndex({ parent: 1 });

// Insert initial data
db.categories.insertMany([
  {
    name: 'Technology',
    description: 'Tech-related content',
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Business',
    description: 'Business and entrepreneurship',
    isActive: true,
    createdAt: new Date()
  },
  {
    name: 'Lifestyle',
    description: 'Lifestyle and personal development',
    isActive: true,
    createdAt: new Date()
  }
]);

print('Database initialized successfully!');
