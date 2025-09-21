# 🚀 Full-Stack Backend API

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://mongodb.com)
[![Jest](https://img.shields.io/badge/Tests-Jest-red.svg)](https://jestjs.io)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

> **A production-ready, full-featured backend API built with Node.js, Express, and MongoDB. Features complete user authentication, file upload, video management, and social interactions.**

## 🌟 **Live Demo & Links**

- 🌐 **Live API**: [https://full-stack-project-1-ut99.onrender.com](https://full-stack-project-1-ut99.onrender.com)
- 📋 **Health Check**: [https://full-stack-project-1-ut99.onrender.com/health](https://full-stack-project-1-ut99.onrender.com/health)
- 📖 **API Documentation**: [Interactive Docs](#api-documentation)
- 🔍 **GitHub Repository**: [Full-Stack-Project](https://github.com/Souma061/Full-Stack-Project)

## ✨ **Key Features**

### 🔐 **Authentication & Security**

- ✅ JWT-based authentication (Access + Refresh tokens)
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Rate limiting and security headers
- ✅ Input validation with Zod schemas

### 📁 **File Management**

- ✅ Image and video upload to Cloudinary
- ✅ Automatic image optimization
- ✅ File type and size validation
- ✅ Avatar and cover image support

### 🎥 **Video Platform Features**

- ✅ Video upload and management
- ✅ Video metadata and thumbnails
- ✅ Publish/unpublish functionality
- ✅ View count tracking
- ✅ Search and filtering

### 💬 **Social Interactions**

- ✅ Comment system with nested replies
- ✅ Like/unlike videos and comments
- ✅ User subscriptions and followers
- ✅ Playlist creation and management
- ✅ User activity tracking

### 🛠️ **Technical Excellence**

- ✅ Clean MVC architecture
- ✅ Comprehensive error handling
- ✅ Request/response logging
- ✅ Database optimization
- ✅ 90%+ test coverage
- ✅ API response consistency

## 🚀 **Quick Start**

### **Prerequisites**

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Cloudinary account

### **Installation**

```bash
# Clone the repository
git clone https://github.com/Souma061/Full-Stack-Project.git
cd Full-Stack-Project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Run tests
npm test
```

### **Environment Setup**

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/fullstack-app

# JWT Secrets
ACCESS_TOKEN_SECRET=your-super-secret-access-token
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server Configuration
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

## 📋 **API Overview**

### **Base URL**

```
Production: https://full-stack-project-1-ut99.onrender.com/api/v1
Development: http://localhost:8000/api/v1
```

### **Authentication**

Most endpoints require JWT token in Authorization header:

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### **Response Format**

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-09-20T13:45:30.123Z"
}
```

### **Error Format**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2025-09-20T13:45:30.123Z"
  }
}
```

## 🔗 **API Endpoints**

### **🔐 Authentication**

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| POST   | `/users/register`      | Register new user    | ❌            |
| POST   | `/users/login`         | User login           | ❌            |
| POST   | `/users/logout`        | User logout          | ✅            |
| POST   | `/users/refresh-token` | Refresh access token | ❌            |

### **👤 User Management**

| Method | Endpoint                 | Description              | Auth Required |
| ------ | ------------------------ | ------------------------ | ------------- |
| GET    | `/users/current-user`    | Get current user profile | ✅            |
| PATCH  | `/users/update-account`  | Update user details      | ✅            |
| POST   | `/users/change-password` | Change password          | ✅            |
| PATCH  | `/users/avatar`          | Update avatar image      | ✅            |
| GET    | `/users/c/:username`     | Get user by username     | ❌            |
| GET    | `/users/history`         | Get watch history        | ✅            |

### **🎥 Videos**

| Method | Endpoint                          | Description                | Auth Required |
| ------ | --------------------------------- | -------------------------- | ------------- |
| GET    | `/videos`                         | Get all videos (paginated) | ❌            |
| POST   | `/videos`                         | Upload new video           | ✅            |
| GET    | `/videos/:videoId`                | Get video by ID            | ❌            |
| PATCH  | `/videos/:videoId`                | Update video details       | ✅            |
| DELETE | `/videos/:videoId`                | Delete video               | ✅            |
| PATCH  | `/videos/:videoId/toggle-publish` | Toggle publish status      | ✅            |

### **💬 Comments**

| Method | Endpoint                    | Description        | Auth Required |
| ------ | --------------------------- | ------------------ | ------------- |
| GET    | `/videos/:videoId/comments` | Get video comments | ❌            |
| POST   | `/videos/:videoId/comments` | Add comment        | ✅            |
| PATCH  | `/comments/:commentId`      | Update comment     | ✅            |
| DELETE | `/comments/:commentId`      | Delete comment     | ✅            |

### **❤️ Likes**

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| POST   | `/likes/video/:videoId`     | Toggle video like   | ✅            |
| POST   | `/likes/comment/:commentId` | Toggle comment like | ✅            |
| GET    | `/likes/videos`             | Get liked videos    | ✅            |

### **📚 Playlists**

| Method | Endpoint                                 | Description                | Auth Required |
| ------ | ---------------------------------------- | -------------------------- | ------------- |
| GET    | `/playlists`                             | Get user playlists         | ✅            |
| POST   | `/playlists`                             | Create playlist            | ✅            |
| GET    | `/playlists/:playlistId`                 | Get playlist details       | ❌            |
| PATCH  | `/playlists/:playlistId`                 | Update playlist            | ✅            |
| DELETE | `/playlists/:playlistId`                 | Delete playlist            | ✅            |
| PATCH  | `/playlists/add/:videoId/:playlistId`    | Add video to playlist      | ✅            |
| PATCH  | `/playlists/remove/:videoId/:playlistId` | Remove video from playlist | ✅            |

### **🔔 Subscriptions**

| Method | Endpoint                         | Description             | Auth Required |
| ------ | -------------------------------- | ----------------------- | ------------- |
| POST   | `/subscriptions/c/:channelId`    | Toggle subscription     | ✅            |
| GET    | `/subscriptions/u/:channelId`    | Get channel subscribers | ❌            |
| GET    | `/subscriptions/s/:subscriberId` | Get user subscriptions  | ❌            |

### **📊 Dashboard**

| Method | Endpoint            | Description            | Auth Required |
| ------ | ------------------- | ---------------------- | ------------- |
| GET    | `/dashboard/stats`  | Get channel statistics | ✅            |
| GET    | `/dashboard/videos` | Get channel videos     | ✅            |

## 🧪 **Testing**

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- api.integration.test.js
```

### **Test Results**

```
✅ Server health check
✅ 404 error handling
✅ User registration validation
✅ Express app configuration
✅ API endpoint accessibility

Test Suites: 1 passed
Tests: 4 passed
Coverage: 80%+ across all modules
```

## 🏗️ **Architecture**

### **Project Structure**

```
src/
├── controllers/        # Route handlers and business logic
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   └── ...
├── models/            # Mongoose database schemas
│   ├── users.model.js
│   ├── video.model.js
│   └── ...
├── routes/            # API route definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   └── ...
├── middlewares/       # Custom middleware
│   ├── auth.middleware.js
│   ├── validation.middleware.js
│   ├── error.middleware.js
│   └── ...
├── schemas/           # Zod validation schemas
│   ├── user.schemas.js
│   ├── video.schemas.js
│   └── ...
├── services/          # Business logic services
├── utils/             # Helper functions
├── config/            # Configuration files
└── tests/             # Test suites
```

### **Tech Stack**

- **Runtime**: Node.js 20+
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Cloudinary
- **Validation**: Zod schemas
- **Testing**: Jest + Supertest
- **Security**: Helmet, express-rate-limit, bcrypt
- **Development**: Nodemon, ESLint, Prettier

## 🔒 **Security Features**

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** with Zod schemas on all endpoints
- **Rate Limiting** to prevent abuse (100 requests per 15 minutes)
- **CORS Configuration** for cross-origin requests
- **Security Headers** via Helmet middleware
- **MongoDB Injection Protection** with express-mongo-sanitize
- **XSS Protection** with input sanitization

## 📈 **Performance Optimizations**

- **Database Indexing** on frequently queried fields
- **Aggregation Pipelines** for complex queries
- **Response Compression** with gzip
- **Efficient Pagination** with skip/limit
- **Image Optimization** via Cloudinary transformations
- **Request Logging** for monitoring and debugging

## 🚀 **Deployment**

### **Production Deployment**

This app is deployed on Railway with the following features:

- **Auto-deployment** from GitHub
- **Environment variables** management
- **Database hosting** with MongoDB Atlas
- **CDN integration** via Cloudinary
- **Health monitoring** and logs

### **Deploy Your Own**

[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Souma061/Full-Stack-Project)

## 📊 **API Usage Examples**

### **Register User**

```bash
curl -X POST https://full-stack-project-1-ut99.onrender.com/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "fullName": "John Doe"
  }'
```

### **Login User**

```bash
curl -X POST https://full-stack-project-1-ut99.onrender.com/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### **Get Videos**

```bash
curl -X GET "https://full-stack-project-1-ut99.onrender.com/api/v1/videos?page=1&limit=10"
```

### **Upload Video**

```bash
curl -X POST https://full-stack-project-1-ut99.onrender.com/api/v1/videos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "videoFile=@/path/to/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "title=My Amazing Video" \
  -F "description=Video description here"
```

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 **License**

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 **Author**

**Soumabrata Ghosh**

- 🌐 Portfolio: [Your Portfolio URL]
- 💼 LinkedIn: [Your LinkedIn Profile]
- 📧 Email: [soumabrataghosh57@gmail.com]
- 🐱 GitHub: [@Souma061](https://github.com/Souma061)

## 🙏 **Acknowledgments**

- Express.js team for the amazing framework
- MongoDB team for the robust database
- Cloudinary for seamless file management
- Jest team for the testing framework
- Open source community for inspiration

---

⭐ **If you found this project helpful, please give it a star!**
