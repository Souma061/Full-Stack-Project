# Full-Stack YouTube Clone Platform

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green.svg)](https://mongodb.com)
[![Jest](https://img.shields.io/badge/Tests-Jest-red.svg)](https://jestjs.io)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

> A professional, production-grade full-stack platform inspired by YouTube. Includes a robust backend API (Node.js, Express, MongoDB) and a modern frontend (React, Vite, Material UI, Tailwind CSS). Features user authentication, video management, social interactions, and more.

---

## � Live Demo & Documentation

- **Live API:** [https://full-stack-project-1-ut99.onrender.com](https://full-stack-project-1-ut99.onrender.com)
- **Health Check:** `/api/v1/healthcheck`
- **API Documentation:** [API Docs](./docs/API_DOCUMENTATION.md)
- **Architecture:** [System Architecture](./docs/ARCHITECTURE.md)
- **Deployment:** [Deployment Guide](./docs/DEPLOYMENT.md)

---

## ✨ Key Features

- Secure JWT authentication & role-based access
- Video upload, management, and streaming
- Social features: comments, likes, playlists, subscriptions
- File storage & optimization with Cloudinary
- Robust validation, error handling, and logging
- Modern, responsive frontend UI
- 90%+ backend test coverage

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone https://github.com/Souma061/Full-Stack-Project.git
cd Full-Stack-Project

# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start backend server
npm run dev

# Run backend tests
npm test
```

### Environment Setup

```env
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

---

## 📋 API Overview

### Base URLs

- Production: `https://full-stack-project-1-ut99.onrender.com/api/v1`
- Development: `http://localhost:8000/api/v1`

### Authentication

Most endpoints require a JWT token in the Authorization header:

`Authorization: Bearer YOUR_ACCESS_TOKEN`

### Quick Test

```bash
# Health check
curl http://localhost:8000/api/v1/healthcheck

# Register user
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123!","fullName":"Test User"}'
```

---

## 📚 Documentation

### 📖 **[API Documentation](./docs/API_DOCUMENTATION.md)**

Complete API reference with examples, request/response formats, and authentication details.

### 🏗️ **[Architecture Documentation](./docs/ARCHITECTURE.md)**

Detailed system architecture, design patterns, database schema, and technical decisions.

### 🚀 **[Deployment Guide](./docs/DEPLOYMENT.md)**

Step-by-step deployment instructions for Render, Heroku, Vercel, and Docker.

### 🎯 **[Interview Preparation](./docs/INTERVIEW_PREPARATION.md)**

Comprehensive backend developer interview guide with questions, answers, and talking points.

### ⚡ **[Quick Reference Card](./docs/INTERVIEW_QUICK_REFERENCE.md)**

Last-minute interview prep with key concepts and confidence builders.

---

## 🔗 Core API Endpoints

| Category             | Endpoints                                                             | Description          |
| -------------------- | --------------------------------------------------------------------- | -------------------- |
| **🔐 Auth**          | `/users/register`, `/users/login`, `/users/logout`                    | User authentication  |
| **👤 Users**         | `/users/current-user`, `/users/update-account`, `/users/avatar`       | User management      |
| **🎥 Videos**        | `/videos`, `/videos/:id`, `/videos/upload`                            | Video operations     |
| **💬 Comments**      | `/videos/:id/comments`, `/comments/:id`                               | Comment system       |
| **❤️ Likes**         | `/likes/video/:id`, `/likes/comment/:id`                              | Like functionality   |
| **📚 Playlists**     | `/playlists`, `/playlists/:id`, `/playlists/add/:videoId/:playlistId` | Playlist management  |
| **🔔 Subscriptions** | `/subscriptions/c/:channelId`, `/subscriptions/u/:channelId`          | User subscriptions   |
| **📊 Dashboard**     | `/dashboard/stats`, `/dashboard/videos`                               | Analytics & insights |

---

## 🧪 Backend Testing

### **Running Tests**

```bash
# Run all tests
npm test

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

---

## 🎬 Frontend: Youtube Clone

The frontend is a modern, responsive YouTube-inspired platform located in [`Frontend/Youtube`](./Frontend/Youtube).

### Tech Stack

- React 19
- Vite
- Material UI (MUI) & Icons
- Tailwind CSS

### Key Features

- Material UI components and iconography
- Utility-first styling with Tailwind CSS
- Fast, modern development with Vite

### Getting Started

```sh
cd Frontend/Youtube
npm install
npm run dev
```

### Example: Using Material UI & Icons

```jsx
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

function App() {
  return (
    <div>
      <HomeIcon />
      <Button variant="contained">Hello World</Button>
    </div>
  );
}
```

For more details, see [`Frontend/Youtube/README.md`](./Frontend/Youtube/README.md).

---

## 🏗️ Architecture

### Backend Tech Stack

- Node.js 20+
- Express.js 5.x
- MongoDB (Mongoose ODM)
- JWT authentication
- Cloudinary file storage
- Zod validation
- Jest + Supertest
- Security: Helmet, express-rate-limit, bcrypt

### Backend Project Structure

```
src/
├── controllers/        # Route handlers and business logic
├── models/            # Mongoose database schemas
├── routes/            # API route definitions
├── middlewares/       # Custom middleware
├── schemas/           # Zod validation schemas
├── services/          # Business logic services
├── utils/             # Helper functions
├── config/            # Configuration files
└── tests/             # Test suites
```

---

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** using bcrypt with salt rounds
- **Input Validation** with Zod schemas on all endpoints
- **Rate Limiting** to prevent abuse (100 requests per 15 minutes)
- **CORS Configuration** for cross-origin requests
- **Security Headers** via Helmet middleware
- **MongoDB Injection Protection** with express-mongo-sanitize
- **XSS Protection** with input sanitization

---

## 🚀 Deployment Options

### **Render (Recommended)**

[![Deploy on Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Souma061/Full-Stack-Project)

### **Heroku**

```bash
heroku create your-backend-api
git push heroku main
```

### **Docker**

```bash
docker build -t fullstack-backend .
docker run -p 8000:8000 fullstack-backend
```

### **Vercel**

```bash
npm i -g vercel
vercel
```

---

## 📊 Performance Features

- **Database Indexing** on frequently queried fields
- **Aggregation Pipelines** for complex queries
- **Response Compression** with gzip
- **Efficient Pagination** with skip/limit
- **Image Optimization** via Cloudinary transformations
- **Request Logging** for monitoring and debugging

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Soumabrata Ghosh**

- 🐱 GitHub: [@Souma061](https://github.com/Souma061)
- 💼 LinkedIn: [Your LinkedIn Profile]
- 📧 Email: [Your Email]

---

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB team for the robust database
- Cloudinary for seamless file management
- Jest team for the testing framework
- Open source community for inspiration

---

---

⭐ If you found this project helpful, please give it a star!

_For detailed information, please refer to the documentation linked above._
