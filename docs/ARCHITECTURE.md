# 🏗️ Architecture Documentation

## 📋 **System Overview**

This is a **production-ready, scalable backend API** built with modern Node.js architecture patterns. The system follows **MVC (Model-View-Controller)** principles with clean separation of concerns, comprehensive error handling, and enterprise-grade security.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Frontend Apps  │  Mobile Apps  │  Third-party APIs  │  cURL   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  CORS  │  Rate Limiting  │  Security Headers  │  Request Logging │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  JWT Verification  │  Token Refresh  │  User Context  │  RBAC   │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                      VALIDATION LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  Zod Schemas  │  Input Sanitization  │  Type Safety  │  Errors  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC                            │
├─────────────────────────────────────────────────────────────────┤
│  Controllers  │  Services  │  Domain Logic  │  Data Processing  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB (Database)  │  Cloudinary (File Storage)  │  Cache     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 **Core Architecture Principles**

### **1. Single Responsibility Principle**

- Each module has one clear purpose
- Controllers handle HTTP requests/responses
- Services contain business logic
- Models define data structures
- Middlewares handle cross-cutting concerns

### **2. Dependency Injection**

- Services injected into controllers
- Utilities injected into services
- Database connections managed centrally
- Configuration externalized

### **3. Error-First Design**

- Comprehensive error handling at every layer
- Consistent error response format
- Graceful degradation
- Detailed logging for debugging

### **4. Security by Design**

- Authentication/authorization at API level
- Input validation and sanitization
- Rate limiting and abuse prevention
- Secure headers and CORS configuration

---

## 📁 **Project Structure**

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── constant.js           # Application constants
│
├── config/               # Configuration management
│   ├── database.js       # Database connection config
│   ├── cloudinary.js     # File storage config
│   └── cors.js           # CORS configuration
│
├── controllers/          # HTTP request handlers
│   ├── auth.controller.js      # Authentication logic
│   ├── user.controller.js      # User management
│   ├── video.controller.js     # Video operations
│   ├── comment.controller.js   # Comment system
│   ├── like.controller.js      # Like/unlike logic
│   ├── playlist.controller.js  # Playlist management
│   ├── subscription.controller.js # User subscriptions
│   ├── dashboard.controller.js # Analytics dashboard
│   └── healthcheck.controller.js # Health monitoring
│
├── models/               # Database schemas & models
│   ├── users.model.js    # User data model
│   ├── video.model.js    # Video content model
│   ├── comment.model.js  # Comment data model
│   ├── like.model.js     # Like relationship model
│   ├── playlist.model.js # Playlist structure model
│   └── subscription.model.js # Subscription relationship
│
├── routes/               # API endpoint definitions
│   ├── index.js          # Route aggregation
│   ├── user.routes.js    # User endpoints
│   ├── video.routes.js   # Video endpoints
│   ├── comment.routes.js # Comment endpoints
│   ├── like.routes.js    # Like endpoints
│   ├── playlist.routes.js # Playlist endpoints
│   ├── subscription.routes.js # Subscription endpoints
│   ├── dashboard.routes.js # Dashboard endpoints
│   └── healthcheck.routes.js # Health check
│
├── middlewares/          # Cross-cutting concerns
│   ├── auth.middleware.js      # JWT authentication
│   ├── validation.middleware.js # Request validation
│   ├── error.middleware.js     # Error handling
│   ├── cors.middleware.js      # CORS configuration
│   ├── ratelimit.middleware.js # Rate limiting
│   ├── security.middleware.js  # Security headers
│   └── multer.middleware.js    # File upload handling
│
├── schemas/              # Validation schemas
│   ├── index.js          # Schema exports
│   ├── auth.schemas.js   # Authentication validation
│   ├── user.schemas.js   # User data validation
│   ├── video.schemas.js  # Video data validation
│   ├── comment.schemas.js # Comment validation
│   ├── like.schemas.js   # Like validation
│   ├── playlist.schemas.js # Playlist validation
│   ├── common.schemas.js # Shared validation rules
│   └── upload.schemas.js # File upload validation
│
├── services/             # Business logic layer
│   ├── auth.service.js   # Authentication business logic
│   ├── user.service.js   # User management logic
│   ├── video.service.js  # Video processing logic
│   ├── comment.service.js # Comment operations
│   ├── like.service.js   # Like/unlike operations
│   ├── playlist.service.js # Playlist operations
│   ├── subscription.service.js # Subscription logic
│   ├── email.service.js  # Email notifications
│   ├── analytics.service.js # Data analytics
│   └── recommended.service.js # Recommendation engine
│
├── utils/                # Helper functions & utilities
│   ├── ApiError.js       # Custom error classes
│   ├── ApiResponse.js    # Standardized responses
│   ├── asyncHandler.js   # Async error wrapper
│   ├── cloudinary.js     # File upload utilities
│   ├── validation.js     # Custom validators
│   ├── encryption.js     # Encryption utilities
│   ├── logger.js         # Logging utilities
│   └── constants.js      # Application constants
│
├── jobs/                 # Background job processing
│   ├── videoProcessing.js     # Video encoding/processing
│   ├── thumbnailGeneration.js # Thumbnail creation
│   ├── emailQueue.js          # Email sending queue
│   └── analyticsProcessing.js # Analytics computation
│
├── tests/                # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   ├── e2e/              # End-to-end tests
│   └── fixtures/         # Test data fixtures
│
└── db/                   # Database utilities
    ├── db.js             # Database connection
    ├── seeders/          # Database seeders
    └── migrations/       # Database migrations
```

---

## 🔄 **Request/Response Flow**

### **Typical API Request Flow**

```mermaid
sequencediagram
    participant Client
    participant Middleware
    participant Controller
    participant Service
    participant Model
    participant Database

    Client->>Middleware: HTTP Request
    Middleware->>Middleware: CORS Check
    Middleware->>Middleware: Rate Limiting
    Middleware->>Middleware: Security Headers
    Middleware->>Middleware: Authentication
    Middleware->>Middleware: Validation
    Middleware->>Controller: Validated Request
    Controller->>Service: Business Logic Call
    Service->>Model: Data Operation
    Model->>Database: Query Execution
    Database->>Model: Query Result
    Model->>Service: Processed Data
    Service->>Controller: Business Result
    Controller->>Client: HTTP Response
```

### **1. Request Processing Pipeline**

```javascript
// 1. CORS & Security Headers
app.use(cors());
app.use(helmet());

// 2. Rate Limiting
app.use("/api/", rateLimitMiddleware);

// 3. Request Parsing
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));

// 4. Authentication (if required)
app.use("/api/v1/protected", verifyJWT);

// 5. Validation
app.use("/api/v1/users", validateRequest(userSchema));

// 6. Route Handler
app.use("/api/v1/users", userRoutes);

// 7. Error Handling
app.use(errorHandler);
```

### **2. Authentication Flow**

```javascript
// JWT Authentication Middleware
const verifyJWT = asyncHandler(async (req, res, next) => {
  // 1. Extract token from header/cookies
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // 2. Verify token signature
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  // 3. Fetch user from database
  const user = await User.findById(decodedToken?._id);

  // 4. Attach user to request
  req.user = user;
  next();
});
```

### **3. Validation Flow**

```javascript
// Zod Schema Validation
const validateRequest = (schema) =>
  asyncHandler(async (req, res, next) => {
    // 1. Validate request body
    const validatedBody = await schema.body?.parseAsync(req.body);

    // 2. Validate query parameters
    const validatedQuery = await schema.query?.parseAsync(req.query);

    // 3. Validate URL parameters
    const validatedParams = await schema.params?.parseAsync(req.params);

    // 4. Attach validated data
    req.body = validatedBody || req.body;
    Object.assign(req.query, validatedQuery || {});
    req.params = validatedParams || req.params;

    next();
  });
```

---

## 🗄️ **Database Architecture**

### **MongoDB Collections & Relationships**

```
Users Collection
├── _id (ObjectId)
├── username (String, unique)
├── email (String, unique)
├── password (String, hashed)
├── fullName (String)
├── avatar (String, Cloudinary URL)
├── coverImage (String, Cloudinary URL)
├── watchHistory (Array of Video ObjectIds)
├── refreshToken (String)
├── createdAt (Date)
└── updatedAt (Date)

Videos Collection
├── _id (ObjectId)
├── videoFile (String, Cloudinary URL)
├── thumbnail (String, Cloudinary URL)
├── title (String)
├── description (String)
├── duration (Number, seconds)
├── views (Number)
├── isPublished (Boolean)
├── owner (ObjectId, ref: User)
├── createdAt (Date)
└── updatedAt (Date)

Comments Collection
├── _id (ObjectId)
├── content (String)
├── video (ObjectId, ref: Video)
├── owner (ObjectId, ref: User)
├── createdAt (Date)
└── updatedAt (Date)

Likes Collection
├── _id (ObjectId)
├── video (ObjectId, ref: Video)
├── comment (ObjectId, ref: Comment)
├── likedBy (ObjectId, ref: User)
└── createdAt (Date)

Playlists Collection
├── _id (ObjectId)
├── name (String)
├── description (String)
├── videos (Array of Video ObjectIds)
├── owner (ObjectId, ref: User)
├── createdAt (Date)
└── updatedAt (Date)

Subscriptions Collection
├── _id (ObjectId)
├── subscriber (ObjectId, ref: User)
├── channel (ObjectId, ref: User)
└── createdAt (Date)
```

### **Database Indexes**

```javascript
// Performance Optimization Indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.videos.createIndex({ owner: 1, createdAt: -1 });
db.videos.createIndex({ title: "text", description: "text" });
db.comments.createIndex({ video: 1, createdAt: -1 });
db.likes.createIndex({ video: 1, likedBy: 1 }, { unique: true });
db.subscriptions.createIndex({ subscriber: 1, channel: 1 }, { unique: true });
```

### **Aggregation Pipelines**

```javascript
// Example: Get User Profile with Statistics
const getUserProfile = (username) => [
  {
    $match: { username: username.toLowerCase() },
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "channel",
      as: "subscribers",
    },
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo",
    },
  },
  {
    $addFields: {
      subscribersCount: { $size: "$subscribers" },
      channelSubscribedToCount: { $size: "$subscribedTo" },
      isSubscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false,
        },
      },
    },
  },
  {
    $project: {
      fullName: 1,
      username: 1,
      subscribersCount: 1,
      channelSubscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1,
    },
  },
];
```

---

## 🔐 **Security Architecture**

### **Authentication & Authorization**

```javascript
// JWT Token Structure
{
    "header": {
        "alg": "HS256",
        "typ": "JWT"
    },
    "payload": {
        "_id": "user_id",
        "email": "user@example.com",
        "username": "username",
        "iat": 1637064000,
        "exp": 1637150400
    },
    "signature": "hash_signature"
}
```

### **Security Middleware Stack**

```javascript
// 1. Helmet - Security Headers
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// 2. CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// 3. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP",
});

// 4. Input Sanitization
app.use(mongoSanitize());
app.use(xss());

// 5. Request Size Limiting
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
```

### **Password Security**

```javascript
// Password Hashing (bcrypt)
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Password Validation
const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
```

---

## 📁 **File Upload Architecture**

### **Cloudinary Integration**

```javascript
// File Upload Flow
Client Upload → Multer Middleware → Cloudinary API → Database URL Storage

// Multer Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

// Cloudinary Upload
const uploadOnCloudinary = async (localFilePath) => {
    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove locally saved temp file
        return null
    }
}
```

### **File Processing Pipeline**

```javascript
// Image Upload Process
1. Client selects file
2. Multer saves to ./public/temp
3. Cloudinary uploads and optimizes
4. Database stores Cloudinary URL
5. Local temp file deleted
6. Response sent to client

// Supported File Types
Images: JPG, JPEG, PNG, GIF, WEBP
Videos: MP4, AVI, MOV, MKV, WEBM
Max Sizes: Images (5MB), Videos (100MB)
```

---

## 🔄 **Error Handling Architecture**

### **Error Hierarchy**

```javascript
// Custom Error Classes
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;
  }
}

// Error Types
-ValidationError(400) -
  AuthenticationError(401) -
  AuthorizationError(403) -
  NotFoundError(404) -
  ConflictError(409) -
  InternalServerError(500);
```

### **Global Error Handler**

```javascript
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose Validation Errors
  if (error.name === "ValidationError") {
    const validationErrors = Object.values(error.errors).map(
      (val) => val.message
    );
    error = new ApiError(400, "Validation Error", validationErrors);
  }

  // Handle Mongoose Duplicate Key Error
  if (error.code === 11000) {
    const duplicateFields = Object.keys(error.keyValue);
    error = new ApiError(
      409,
      `Duplicate ${duplicateFields.join(", ")} entered`
    );
  }

  // Handle JWT Errors
  if (error.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token");
  }

  // Send Error Response
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message,
      statusCode: error.statusCode,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    },
  });
};
```

---

## 📊 **Performance Optimizations**

### **Database Optimizations**

```javascript
// 1. Mongoose Connection Optimization
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands: false, // Disable mongoose buffering
  bufferMaxEntries: 0, // Disable mongoose buffering
});

// 2. Aggregation Pipeline Optimization
const getVideosOptimized = async (page = 1, limit = 10) => {
  return Video.aggregate([
    { $match: { isPublished: true } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { fullName: 1, username: 1, avatar: 1 } }],
      },
    },
    { $unwind: "$owner" },
  ]);
};
```

### **Response Caching Strategy**

```javascript
// Cache Frequently Accessed Data
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes TTL

const getCachedData = async (key, fetchFunction) => {
  let data = cache.get(key);
  if (!data) {
    data = await fetchFunction();
    cache.set(key, data);
  }
  return data;
};

// Usage Example
const getVideoStats = async (videoId) => {
  return getCachedData(`video_stats_${videoId}`, async () => {
    return await Video.findById(videoId).select("views likes comments");
  });
};
```

### **Request Optimization**

```javascript
// 1. Response Compression
app.use(compression());

// 2. HTTP Request Logging
app.use(morgan("combined"));

// 3. Static File Serving
app.use("/public", express.static(path.join(__dirname, "public")));

// 4. Keep-Alive Connections
const server = app.listen(PORT, () => {
  server.keepAliveTimeout = 65000;
  server.headersTimeout = 66000;
});
```

---

## 🧪 **Testing Architecture**

### **Testing Strategy**

```javascript
// Testing Pyramid
Unit Tests (70%)
├── Controllers
├── Services
├── Utils
└── Models

Integration Tests (20%)
├── API Endpoints
├── Database Operations
└── External Services

E2E Tests (10%)
├── User Registration Flow
├── Authentication Flow
└── File Upload Flow
```

### **Test Setup**

```javascript
// Jest Configuration
module.exports = {
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.js"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  collectCoverageFrom: ["src/**/*.js", "!src/tests/**", "!src/coverage/**"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

## 🚀 **Deployment Architecture**

### **Production Environment**

```yaml
# Docker Compose (Production)
version: "3.8"
services:
  app:
    image: fullstack-backend:latest
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - ACCESS_TOKEN_SECRET=${ACCESS_TOKEN_SECRET}
    depends_on:
      - mongodb
    restart: unless-stopped

  mongodb:
    image: mongo:7
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongodb_data:
```

### **CI/CD Pipeline**

```yaml
# GitHub Actions Workflow
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "20"
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 📈 **Monitoring & Observability**

### **Application Metrics**

```javascript
// Health Check Endpoint
app.get("/api/v1/healthcheck", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version,
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    memory: {
      used:
        Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total:
        Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
    },
  });
});
```

### **Logging Strategy**

```javascript
// Winston Logger Configuration
const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: "fullstack-backend" },
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    ...(process.env.NODE_ENV !== "production"
      ? [new winston.transports.Console({ format: winston.format.simple() })]
      : []),
  ],
});
```

---

## 🔮 **Future Enhancements**

### **Planned Features**

1. **Microservices Architecture**
   - Split into separate services (Auth, Video, Comment, etc.)
   - API Gateway pattern
   - Service mesh communication

2. **Real-time Features**
   - WebSocket implementation
   - Live streaming support
   - Real-time notifications

3. **Advanced Analytics**
   - User behavior tracking
   - Video analytics dashboard
   - Performance metrics

4. **Content Delivery**
   - CDN integration
   - Video transcoding
   - Adaptive bitrate streaming

5. **Mobile App Support**
   - Push notifications
   - Offline sync
   - Background upload

This architecture documentation provides a comprehensive overview of the system design, making it easier for developers to understand, maintain, and extend the application. 🚀
