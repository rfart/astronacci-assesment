# Deployment Guide

## Production Deployment

### Environment Variables

#### Backend (.env)
```bash
# Server Configuration
NODE_ENV=production
PORT=5001

# Database
MONGODB_URI=mongodb://your-mongo-host:27017/social-media-platform
REDIS_URL=redis://your-redis-host:6379

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
SESSION_SECRET=your-super-secure-session-secret

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend (.env)
```bash
# API Configuration
REACT_APP_API_URL=https://your-api-domain.com/api

# Environment
NODE_ENV=production
```

### Docker Production Deployment

#### 1. Build Production Images
```bash
# Build backend
docker build -t social-media-backend ./apps/backend

# Build frontend  
docker build -t social-media-frontend ./apps/frontend
```

#### 2. Production Docker Compose
Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: your-secure-password
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

  redis:
    image: redis:7.2-alpine
    restart: always
    command: redis-server --requirepass your-redis-password
    volumes:
      - redis_data:/data
    networks:
      - app-network

  backend:
    image: social-media-backend
    restart: always
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:your-secure-password@mongodb:27017/social-media-platform?authSource=admin
      REDIS_URL: redis://:your-redis-password@redis:6379
    depends_on:
      - mongodb
      - redis
    ports:
      - "5001:5001"
    networks:
      - app-network

  frontend:
    image: social-media-frontend
    restart: always
    ports:
      - "80:80"
    networks:
      - app-network

volumes:
  mongodb_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

#### 3. Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Platform Deployment

#### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

#### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build and start commands:
   - Build: `cd apps/backend && npm run build`
   - Start: `cd apps/backend && npm start`

#### MongoDB Atlas (Database)
1. Create MongoDB Atlas cluster
2. Update connection string in environment variables
3. Configure IP whitelist and security

### Nginx Configuration

For production, use Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Configuration

Use Certbot for free SSL certificates:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Monitoring

#### Health Checks
- Backend: `GET /health`
- Database: Monitor MongoDB connection
- Redis: Monitor Redis connection

#### Logging
Configure structured logging for production:

```javascript
// Backend logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### Performance Optimization

#### Backend
- Enable gzip compression
- Use Redis for session storage
- Implement API caching
- Database indexing
- Connection pooling

#### Frontend
- Code splitting
- Image optimization
- CDN for static assets
- Service worker for caching

### Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] SQL injection protection
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Security headers
- [ ] Regular security updates

### Backup Strategy

#### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb://username:password@host:port/database" --out=/backup/

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backup/mongodb_$DATE"
tar -czf "/backup/mongodb_$DATE.tar.gz" "/backup/mongodb_$DATE"
rm -rf "/backup/mongodb_$DATE"
```

#### File Backup
- Regular backups of uploaded files
- Environment configuration backup
- Code repository backup

### Rollback Procedure

1. Keep previous Docker images tagged
2. Database migration rollback scripts
3. Environment variable rollback
4. DNS failover configuration

### Scaling Considerations

#### Horizontal Scaling
- Load balancer configuration
- Database replication
- Redis clustering
- CDN implementation

#### Vertical Scaling
- Monitor CPU and memory usage
- Database query optimization
- Caching strategies
- Connection pooling
