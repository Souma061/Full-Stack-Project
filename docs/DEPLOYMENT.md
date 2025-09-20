# 🚀 Deployment Guide

## 📋 **Pre-Deployment Checklist**

### ✅ **Code Quality**

- [ ] All tests passing (`npm test`)
- [ ] No console.log statements in production code
- [ ] Environment variables properly configured
- [ ] Error handling implemented
- [ ] API responses consistent
- [ ] Security headers configured

### ✅ **Production Setup**

- [ ] MongoDB Atlas cluster created
- [ ] Cloudinary account configured
- [ ] JWT secrets generated
- [ ] CORS origins configured
- [ ] Rate limiting enabled

---

## 🌟 **Railway Deployment (Recommended)**

### **Step 1: Prepare Your Repository**

1. **Push to GitHub** (if not already done):

```bash
git add .
git commit -m "Production ready deployment"
git push origin main
```

2. **Create `.env.example`**:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Configuration
ACCESS_TOKEN_SECRET=your-super-secret-access-token-min-32-chars
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-min-32-chars
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=8000
CORS_ORIGIN=*
NODE_ENV=production

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### **Step 2: Deploy to Railway**

1. **Visit Railway**: Go to [railway.app](https://railway.app)

2. **Sign in with GitHub**: Connect your GitHub account

3. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

4. **Configure Environment Variables**:

   ```
   MONGODB_URI=mongodb+srv://your-cluster-url
   ACCESS_TOKEN_SECRET=your-access-secret-here
   REFRESH_TOKEN_SECRET=your-refresh-secret-here
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   PORT=8000
   CORS_ORIGIN=*
   NODE_ENV=production
   ```

5. **Deploy**: Railway will automatically detect your Node.js app and deploy

### **Step 3: Verify Deployment**

1. **Check Health**: Visit `https://your-app.railway.app/api/v1/healthcheck`
2. **Test API**: Try registering a user via API
3. **Monitor Logs**: Check Railway dashboard for any errors

---

## 🔷 **Heroku Deployment**

### **Prerequisites**

- Heroku CLI installed
- Heroku account created

### **Step 1: Setup Heroku**

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-backend-api

# Add MongoDB addon (optional)
heroku addons:create mongolab:sandbox
```

### **Step 2: Configure Environment Variables**

```bash
# Set environment variables
heroku config:set MONGODB_URI="mongodb+srv://your-cluster-url"
heroku config:set ACCESS_TOKEN_SECRET="your-access-secret"
heroku config:set REFRESH_TOKEN_SECRET="your-refresh-secret"
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloud-name"
heroku config:set CLOUDINARY_API_KEY="your-api-key"
heroku config:set CLOUDINARY_API_SECRET="your-api-secret"
heroku config:set NODE_ENV="production"
heroku config:set CORS_ORIGIN="*"
```

### **Step 3: Create Procfile**

```bash
# Create Procfile in root directory
echo "web: npm start" > Procfile
```

### **Step 4: Deploy**

```bash
# Add Heroku remote
heroku git:remote -a your-backend-api

# Deploy to Heroku
git push heroku main
```

---

## 🟩 **Vercel Deployment**

### **Step 1: Install Vercel CLI**

```bash
npm i -g vercel
```

### **Step 2: Create vercel.json**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "ACCESS_TOKEN_SECRET": "@access-token-secret",
    "REFRESH_TOKEN_SECRET": "@refresh-token-secret",
    "CLOUDINARY_CLOUD_NAME": "@cloudinary-cloud-name",
    "CLOUDINARY_API_KEY": "@cloudinary-api-key",
    "CLOUDINARY_API_SECRET": "@cloudinary-api-secret"
  }
}
```

### **Step 3: Deploy**

```bash
# Deploy to Vercel
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add ACCESS_TOKEN_SECRET
# ... repeat for all variables

# Redeploy with environment variables
vercel --prod
```

---

## 🐳 **Docker Deployment**

### **Step 1: Create Dockerfile**

```dockerfile
# Use Node.js 20 Alpine
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/healthcheck || exit 1

# Start application
CMD ["npm", "start"]
```

### **Step 2: Create .dockerignore**

```
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### **Step 3: Build and Run**

```bash
# Build Docker image
docker build -t fullstack-backend .

# Run container
docker run -p 8000:8000 \
  -e MONGODB_URI="your-mongodb-uri" \
  -e ACCESS_TOKEN_SECRET="your-secret" \
  -e REFRESH_TOKEN_SECRET="your-secret" \
  -e CLOUDINARY_CLOUD_NAME="your-cloud" \
  -e CLOUDINARY_API_KEY="your-key" \
  -e CLOUDINARY_API_SECRET="your-secret" \
  fullstack-backend
```

---

## ☁️ **MongoDB Atlas Setup**

### **Step 1: Create Cluster**

1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up/Login
3. Create new project
4. Build a database (Free M0 cluster)
5. Choose cloud provider and region

### **Step 2: Configure Security**

1. **Database Access**:
   - Create database user
   - Set username/password
   - Grant read/write permissions

2. **Network Access**:
   - Add IP address (0.0.0.0/0 for all IPs)
   - Or add specific deployment IPs

### **Step 3: Get Connection String**

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your user password
5. Replace `<dbname>` with your database name

---

## 🎨 **Cloudinary Setup**

### **Step 1: Create Account**

1. Visit [Cloudinary](https://cloudinary.com)
2. Sign up for free account
3. Verify email

### **Step 2: Get Credentials**

1. Go to Dashboard
2. Copy Cloud Name, API Key, API Secret
3. Add to environment variables

### **Step 3: Configure Upload Settings**

1. **Settings > Upload**:
   - Set upload presets
   - Configure auto-optimization
   - Set file size limits

---

## 🔐 **Security Configuration**

### **Generate JWT Secrets**

```bash
# Generate strong secrets (Node.js)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use online generators
# https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx
```

### **Environment Variables Security**

```bash
# Use strong, unique secrets for each environment
ACCESS_TOKEN_SECRET=64-character-random-string
REFRESH_TOKEN_SECRET=different-64-character-random-string

# Use specific CORS origins in production
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Set secure NODE_ENV
NODE_ENV=production
```

---

## 📊 **Health Monitoring**

### **Health Check Endpoint**

Your app includes a health check at `/api/v1/healthcheck`:

```json
{
  "success": true,
  "message": "Server is healthy",
  "data": {
    "uptime": "5h 32m 18s",
    "timestamp": "2025-09-20T13:45:30.123Z",
    "environment": "production",
    "database": "connected",
    "memory": {
      "used": "45.2 MB",
      "total": "128 MB"
    }
  }
}
```

### **Monitoring Setup**

1. **UptimeRobot**: Free monitoring service
   - Add your health check URL
   - Get alerts via email/SMS

2. **Railway Monitoring**: Built-in metrics
   - View in Railway dashboard
   - Monitor CPU, memory, network

---

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Port Issues**:

   ```javascript
   // Use environment PORT or default
   const PORT = process.env.PORT || 8000;
   ```

2. **CORS Errors**:

   ```javascript
   // Configure CORS properly
   app.use(
     cors({
       origin: process.env.CORS_ORIGIN?.split(",") || "*",
       credentials: true,
     })
   );
   ```

3. **Database Connection**:

   ```javascript
   // Add connection timeout
   mongoose.connect(process.env.MONGODB_URI, {
     maxPoolSize: 10,
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   });
   ```

4. **File Upload Issues**:
   ```javascript
   // Check Cloudinary configuration
   console.log("Cloudinary config:", {
     cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
     api_key: !!process.env.CLOUDINARY_API_KEY,
     api_secret: !!process.env.CLOUDINARY_API_SECRET,
   });
   ```

### **Debugging Steps**

1. **Check Logs**:

   ```bash
   # Railway
   railway logs

   # Heroku
   heroku logs --tail

   # Docker
   docker logs container-name
   ```

2. **Test Locally**:

   ```bash
   # Set NODE_ENV to production locally
   NODE_ENV=production npm start
   ```

3. **Verify Environment Variables**:
   ```bash
   # Check if all required variables are set
   echo $MONGODB_URI
   echo $ACCESS_TOKEN_SECRET
   ```

---

## 🎯 **Post-Deployment Tasks**

### **Immediate**

- [ ] Test all API endpoints
- [ ] Verify file uploads work
- [ ] Check authentication flow
- [ ] Test error handling
- [ ] Monitor initial traffic

### **Within 24 Hours**

- [ ] Set up monitoring alerts
- [ ] Configure logging
- [ ] Test database backups
- [ ] Verify SSL certificate
- [ ] Update documentation with live URLs

### **Within a Week**

- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Backup strategy
- [ ] Disaster recovery plan

---

## 📚 **Useful Commands**

```bash
# Check deployment status
curl https://your-app.railway.app/api/v1/healthcheck

# Test user registration
curl -X POST https://your-app.railway.app/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!","fullName":"Test User"}'

# Test authentication
curl -X GET https://your-app.railway.app/api/v1/users/current-user \
  -H "Authorization: Bearer YOUR_TOKEN"

# Monitor logs (Railway)
railway logs --follow

# Check environment variables (Railway)
railway variables
```

---

## 🎉 **Success Checklist**

Your deployment is successful when:

- ✅ Health check returns 200 OK
- ✅ User registration works
- ✅ Authentication flow works
- ✅ File uploads work (avatar/video)
- ✅ Database operations work
- ✅ All API endpoints respond correctly
- ✅ HTTPS is working
- ✅ CORS is configured properly
- ✅ Error handling works
- ✅ Monitoring is active

**🎊 Congratulations! Your backend is now live and production-ready!**
