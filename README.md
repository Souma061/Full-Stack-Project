# Full Stack Project - API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 🔐 User Authentication Routes

### Register User
```
POST /api/v1/users/register
Content-Type: multipart/form-data

Form Data:
- avatar: [image file]
- coverImage: [image file]
- fullName: "John Doe"
- username: "johndoe123"
- email: "johndoe@example.com"
- password: "SecurePass123!"
```

### Login User
```
POST /api/v1/users/login
Content-Type: application/json

Body:
{
  "email": "johndoe@example.com",
  "password": "SecurePass123!"
}
// OR
{
  "username": "johndoe123",
  "password": "SecurePass123!"
}
```

### Logout User
```
POST /api/v1/users/logout
Authorization: Bearer <ACCESS_TOKEN>
```

### Refresh Access Token
```
POST /api/v1/users/refresh-token
```

### Get Current User
```
GET /api/v1/users/current-user
Authorization: Bearer <ACCESS_TOKEN>
```

### Change Password
```
POST /api/v1/users/change-password
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body:
{
  "oldPassword": "current_password",
  "newPassword": "new_secure_password"
}
```

### Update Account Details
```
PATCH /api/v1/users/update-account
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body:
{
  "fullName": "Updated Name",
  "email": "newemail@example.com"
}
```

### Update Avatar
```
PATCH /api/v1/users/avatar
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data

Form Data:
- avatar: [new image file]
```

### Update Cover Image
```
PATCH /api/v1/users/cover-image
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data

Form Data:
- coverImage: [new image file]
```

### Get User Channel Profile
```
GET /api/v1/users/channel/:username
Authorization: Bearer <ACCESS_TOKEN>
```

### Get Watch History
```
GET /api/v1/users/history
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 🎥 Video Management Routes

### Get All Videos (Public)
```
GET /api/v1/videos?page=1&limit=10&query=search&sortBy=createdAt&sortType=desc&userId=<user_id>

Query Params:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 50)
- query: Search in title/description
- sortBy: views|createdAt|title|duration
- sortType: asc|desc
- userId: Filter by owner ID
```

### Upload Video
```
POST /api/v1/videos
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: multipart/form-data

Form Data:
- videoFile: [video file]
- thumbnail: [image file]
- title: "Video Title"
- description: "Video description"
```

### Get Video by ID
```
GET /api/v1/videos/:videoId
Authorization: Bearer <ACCESS_TOKEN> (optional)

// Increments view count
// Adds to watch history if authenticated
```

### Update Video
```
PATCH /api/v1/videos/:videoId
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json OR multipart/form-data

JSON Body:
{
  "title": "Updated Title",
  "description": "Updated Description"
}

OR Form Data (to update thumbnail):
- title: "Updated Title"
- description: "Updated Description"
- thumbnail: [new image file]
```

### Delete Video
```
DELETE /api/v1/videos/:videoId
Authorization: Bearer <ACCESS_TOKEN>
```

### Toggle Publish Status
```
PATCH /api/v1/videos/toggle/publish/:videoId
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 💬 Comment Routes

### Get Video Comments (Public)
```
GET /api/v1/videos/:videoId/comments?page=1&limit=10

Query Params:
- page: Page number (default: 1)
- limit: Items per page (default: 10)
```

### Add Comment
```
POST /api/v1/videos/:videoId/comments
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body:
{
  "content": "Great video! Really enjoyed it."
}
```

### Update Comment
```
PATCH /api/v1/videos/comments/:commentId
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

Body:
{
  "content": "Updated comment content"
}
```

### Delete Comment
```
DELETE /api/v1/videos/comments/:commentId
Authorization: Bearer <ACCESS_TOKEN>
```

---

## ❤️ Like System Routes

### Toggle Video Like
```
POST /api/v1/likes/toggle/v/:videoId
Authorization: Bearer <ACCESS_TOKEN>

// Toggles like status (if liked -> unlike, if not liked -> like)
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "totalLikes": 15
  },
  "message": "Video liked successfully",
  "success": true
}
```

### Toggle Comment Like
```
POST /api/v1/likes/toggle/c/:commentId
Authorization: Bearer <ACCESS_TOKEN>

// Toggles like status for a comment
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "isLiked": false,
    "totalLikes": 3
  },
  "message": "Comment unliked successfully",
  "success": true
}
```

### Toggle Tweet Like
```
POST /api/v1/likes/toggle/t/:tweetId
Authorization: Bearer <ACCESS_TOKEN>

// Toggles like status for a tweet (if tweet system implemented)
```

### Get User's Liked Videos
```
GET /api/v1/likes/videos?page=1&limit=10
Authorization: Bearer <ACCESS_TOKEN>

Query Params:
- page: Page number (default: 1)
- limit: Items per page (default: 10, max: 50)
```

**Response:**
```json
{
  "statusCode": 200,
  "data": {
    "videos": [
      {
        "_id": "68c1739712e714aed4e04a56",
        "title": "Amazing Tutorial",
        "description": "Learn programming basics",
        "videoFiles": "https://res.cloudinary.com/...",
        "thumbnail": "https://res.cloudinary.com/...",
        "duration": 120.5,
        "views": 1500,
        "createdAt": "2025-09-10T12:48:23.526Z",
        "owner": {
          "username": "johndoe123",
          "fullName": "John Doe",
          "avatar": "https://res.cloudinary.com/..."
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalDocs": 5,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "message": "Liked videos fetched successfully",
  "success": true
}
```

---

## 🚀 Quick Test Sequence

1. **Register a user** → Get access token from login
2. **Upload a video** → Get video ID
3. **Get all videos** → Verify your video appears
4. **Add a comment** → Test comment functionality
5. **Like the video** → Test like system
6. **Get liked videos** → Verify like appears in list
7. **Unlike the video** → Test unlike functionality
8. **Update video** → Change title/description
9. **Toggle publish** → Test visibility control

---

## 📝 Sample Data & Examples

### 🔐 User Registration Samples
```json
// User 1
{
  "fullName": "John Doe",
  "username": "johndoe123",
  "email": "johndoe@example.com",
  "password": "SecurePass123!"
}

// User 2
{
  "fullName": "Jane Smith",
  "username": "janesmith456",
  "email": "jane.smith@example.com",
  "password": "MyPassword456!"
}

// User 3
{
  "fullName": "Alex Johnson",
  "username": "alexjohnson789",
  "email": "alex.johnson@example.com",
  "password": "AlexPass789!"
}
```

### 🔑 Login Samples
```json
// Login with email
{
  "email": "johndoe@example.com",
  "password": "SecurePass123!"
}

// Login with username
{
  "username": "janesmith456",
  "password": "MyPassword456!"
}
```

### 🔒 Password Change Sample
```json
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

### 👤 Account Update Sample
```json
{
  "fullName": "John Michael Doe",
  "email": "john.michael.doe@example.com"
}
```

### 🎥 Video Upload Samples
```
Form Data Fields:

Sample 1 - Tech Tutorial:
- title: "Complete Node.js Tutorial for Beginners"
- description: "Learn Node.js from scratch with this comprehensive tutorial covering all the basics and advanced concepts."
- videoFile: [tutorial_video.mp4]
- thumbnail: [tutorial_thumb.jpg]

Sample 2 - Gaming Video:
- title: "Epic Gaming Moments Compilation 2025"
- description: "Watch the most incredible gaming moments from this year. Subscribe for more gaming content!"
- videoFile: [gaming_compilation.mp4]
- thumbnail: [gaming_thumb.png]

Sample 3 - Cooking Show:
- title: "How to Make Perfect Italian Pasta"
- description: "Step-by-step guide to making authentic Italian pasta at home. Easy recipe that anyone can follow!"
- videoFile: [cooking_video.mp4]
- thumbnail: [pasta_thumb.jpg]
```

### 📝 Video Update Samples
```json
// Simple text update
{
  "title": "Updated: Complete Node.js Tutorial for Beginners 2025",
  "description": "Updated tutorial with latest Node.js features and best practices."
}

// Creative content update
{
  "title": "🔥 VIRAL Gaming Moments That Broke The Internet",
  "description": "The most insane gaming clips that went viral! Don't miss the epic fails at 5:20 😂"
}
```

### 💬 Comment Samples
```json
// Positive feedback
{
  "content": "Amazing tutorial! This helped me understand Node.js concepts so much better. Thank you! 🙏"
}

// Question comment
{
  "content": "Great video! Quick question - which code editor do you recommend for beginners?"
}

// Detailed feedback
{
  "content": "Excellent explanation of async/await! The examples were super clear. Could you make a video about MongoDB integration next?"
}

// Short appreciation
{
  "content": "First! 🥇 Love your content, keep it up!"
}

// Technical discussion
{
  "content": "At 10:45, wouldn't it be better to use Promise.all() instead of sequential awaits for better performance?"
}
```

### ❤️ Like System Testing Examples
```json
// Like a video response
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "totalLikes": 1
  },
  "message": "Video liked successfully",
  "success": true
}

// Unlike a video response
{
  "statusCode": 200,
  "data": {
    "isLiked": false,
    "totalLikes": 0
  },
  "message": "Video unliked successfully",
  "success": true
}

// Like a comment response
{
  "statusCode": 200,
  "data": {
    "isLiked": true,
    "totalLikes": 5
  },
  "message": "Comment liked successfully",
  "success": true
}
```

### 🔥 Like System Demo Test Sequence
```bash
# 1. Like a video (POST)
POST /api/v1/likes/toggle/v/68c1739712e714aed4e04a56
Headers: Authorization: Bearer <token>
→ Response: isLiked: true, totalLikes: 1

# 2. Unlike same video (POST again)
POST /api/v1/likes/toggle/v/68c1739712e714aed4e04a56
Headers: Authorization: Bearer <token>
→ Response: isLiked: false, totalLikes: 0

# 3. Like video again (POST again)
POST /api/v1/likes/toggle/v/68c1739712e714aed4e04a56
Headers: Authorization: Bearer <token>
→ Response: isLiked: true, totalLikes: 1

# 4. Get all liked videos (GET)
GET /api/v1/likes/videos?page=1&limit=10
Headers: Authorization: Bearer <token>
→ Response: Array with the liked video + pagination data

# 5. Add a comment first
POST /api/v1/videos/68c1739712e714aed4e04a56/comments
Body: {"content": "Amazing video! 🔥"}
→ Copy comment _id from response

# 6. Like the comment
POST /api/v1/likes/toggle/c/<COMMENT_ID>
Headers: Authorization: Bearer <token>
→ Response: isLiked: true, totalLikes: 1
```

### 📊 Query Parameter Examples
```
// Get all videos with pagination
GET /api/v1/videos?page=2&limit=15

// Search for programming videos
GET /api/v1/videos?query=javascript&sortBy=views&sortType=desc

// Get videos by specific user
GET /api/v1/videos?userId=68c16ecad235b2c4c3f82437&limit=5

// Get latest videos
GET /api/v1/videos?sortBy=createdAt&sortType=desc&limit=20

// Get most viewed videos
GET /api/v1/videos?sortBy=views&sortType=desc

// Search and sort
GET /api/v1/videos?query=tutorial&sortBy=createdAt&sortType=desc&page=1&limit=10
```

### 🆔 Sample IDs (Replace with actual from your database)
```json
{
  "videoId": "68c1739712e714aed4e04a56",
  "userId": "68c16ecad235b2c4c3f82437",
  "commentId": "68c1739712e714aed4e04a99",
  "usernames": ["johndoe123", "janesmith456", "alexjohnson789"]
}
```

### 🎯 Complete API Test Flow
```json
// 1. Register User
POST /api/v1/users/register
Form-data: {fullName, username, email, password, avatar, coverImage}

// 2. Login & Get Token
POST /api/v1/users/login
Body: {"email": "johndoe@example.com", "password": "SecurePass123!"}
→ Copy accessToken from response

// 3. Upload Video
POST /api/v1/videos
Headers: Authorization: Bearer <token>
Form-data: {title, description, videoFile, thumbnail}
→ Copy video _id from response

// 4. Get All Videos
GET /api/v1/videos

// 5. Get Specific Video
GET /api/v1/videos/68c1739712e714aed4e04a56

// 6. Add Comment
POST /api/v1/videos/68c1739712e714aed4e04a56/comments
Headers: Authorization: Bearer <token>
Body: {"content": "Great video!"}

// 7. Update Video
PATCH /api/v1/videos/68c1739712e714aed4e04a56
Headers: Authorization: Bearer <token>
Body: {"title": "Updated Title"}

// 8. Get User Profile
GET /api/v1/users/channel/johndoe123
Headers: Authorization: Bearer <token>
```

### 🌟 Pro Testing Tips
```
1. Use Postman Environment Variables:
   - {{baseUrl}} = http://localhost:8000
   - {{token}} = <your_access_token>
   - {{videoId}} = <your_video_id>

2. Save responses to extract IDs:
   - After login: token = pm.response.json().data.accessToken
   - After upload: videoId = pm.response.json().data._id

3. Test error cases:
   - Invalid tokens
   - Missing required fields
   - Unauthorized access
   - Non-existent IDs
```
