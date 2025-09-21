# 📖 API Documentation

## 🔧 **Base Configuration**

### **Base URLs**

- **Production**: `https://full-stack-project-1-ut99.onrender.com/api/v1`
- **Development**: `http://localhost:8000/api/v1`

### **Authentication**

Include JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### **Standard Response Format**

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    /* response data */
  },
  "timestamp": "2025-09-20T13:45:30.123Z"
}
```

### **Error Response Format**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "details": {
      /* additional error info */
    },
    "timestamp": "2025-09-20T13:45:30.123Z"
  }
}
```

---

## 🔐 **Authentication Endpoints**

### **Register User**

**POST** `/users/register`

**Request Body:**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://res.cloudinary.com/...",
      "createdAt": "2025-09-20T13:45:30.123Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**cURL Example:**

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

**POST** `/users/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://res.cloudinary.com/...",
      "lastLogin": "2025-09-20T13:45:30.123Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Logout User**

**POST** `/users/logout`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "User logged out successfully",
  "data": {}
}
```

### **Refresh Access Token**

**POST** `/users/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Access token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 👤 **User Management**

### **Get Current User**

**GET** `/users/current-user`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Current user fetched successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "avatar": "https://res.cloudinary.com/...",
      "coverImage": "https://res.cloudinary.com/...",
      "watchHistory": [],
      "createdAt": "2025-09-20T13:45:30.123Z"
    }
  }
}
```

### **Update User Account**

**PATCH** `/users/update-account`
🔒 **Auth Required**

**Request Body:**

```json
{
  "fullName": "John Updated Doe",
  "email": "john.updated@example.com"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Account details updated successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "email": "john.updated@example.com",
      "fullName": "John Updated Doe",
      "avatar": "https://res.cloudinary.com/...",
      "updatedAt": "2025-09-20T14:30:15.456Z"
    }
  }
}
```

### **Change Password**

**POST** `/users/change-password`
🔒 **Auth Required**

**Request Body:**

```json
{
  "oldPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {}
}
```

### **Update Avatar**

**PATCH** `/users/avatar`
🔒 **Auth Required**
📁 **Multipart Form Data**

**Form Fields:**

- `avatar` (file): Image file (JPG, PNG, etc.)

**Response (200):**

```json
{
  "success": true,
  "message": "Avatar updated successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "avatar": "https://res.cloudinary.com/your-cloud/image/upload/v1726839930/new-avatar.jpg"
    }
  }
}
```

**cURL Example:**

```bash
curl -X PATCH https://full-stack-project-1-ut99.onrender.com/api/v1/users/avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/avatar.jpg"
```

### **Get User by Username**

**GET** `/users/c/:username`

**Response (200):**

```json
{
  "success": true,
  "message": "Channel profile fetched successfully",
  "data": {
    "user": {
      "_id": "64a1b2c3d4e5f6789abc123",
      "username": "johndoe",
      "fullName": "John Doe",
      "avatar": "https://res.cloudinary.com/...",
      "coverImage": "https://res.cloudinary.com/...",
      "subscribersCount": 1250,
      "channelSubscribedToCount": 89,
      "isSubscribed": false
    }
  }
}
```

### **Get Watch History**

**GET** `/users/history`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Watch history fetched successfully",
  "data": {
    "watchHistory": [
      {
        "_id": "64a1b2c3d4e5f6789abc456",
        "title": "Amazing Tutorial Video",
        "description": "Learn something new...",
        "videoFile": "https://res.cloudinary.com/video.mp4",
        "thumbnail": "https://res.cloudinary.com/thumb.jpg",
        "duration": 600,
        "views": 1500,
        "owner": {
          "_id": "64a1b2c3d4e5f6789abc789",
          "username": "creator",
          "fullName": "Content Creator",
          "avatar": "https://res.cloudinary.com/..."
        },
        "createdAt": "2025-09-19T10:20:30.123Z"
      }
    ]
  }
}
```

---

## 🎥 **Video Management**

### **Get All Videos**

**GET** `/videos`

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `query` (string): Search query
- `sortBy` (string): Sort field (createdAt, views, duration)
- `sortType` (string): Sort order (asc, desc)
- `userId` (string): Filter by user ID

**Example Request:**

```
GET /videos?page=1&limit=10&query=tutorial&sortBy=views&sortType=desc
```

**Response (200):**

```json
{
  "success": true,
  "message": "Videos fetched successfully",
  "data": {
    "videos": [
      {
        "_id": "64a1b2c3d4e5f6789abc456",
        "title": "Amazing Tutorial Video",
        "description": "Learn something new with this comprehensive tutorial...",
        "videoFile": "https://res.cloudinary.com/video.mp4",
        "thumbnail": "https://res.cloudinary.com/thumb.jpg",
        "duration": 600,
        "views": 1500,
        "isPublished": true,
        "owner": {
          "_id": "64a1b2c3d4e5f6789abc789",
          "username": "creator",
          "fullName": "Content Creator",
          "avatar": "https://res.cloudinary.com/..."
        },
        "createdAt": "2025-09-19T10:20:30.123Z"
      }
    ],
    "totalDocs": 25,
    "page": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### **Upload Video**

**POST** `/videos`
🔒 **Auth Required**
📁 **Multipart Form Data**

**Form Fields:**

- `videoFile` (file, required): Video file
- `thumbnail` (file, required): Thumbnail image
- `title` (string, required): Video title
- `description` (string, required): Video description

**Response (201):**

```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": {
    "video": {
      "_id": "64a1b2c3d4e5f6789abc456",
      "title": "My New Video",
      "description": "This is an amazing video...",
      "videoFile": "https://res.cloudinary.com/video.mp4",
      "thumbnail": "https://res.cloudinary.com/thumb.jpg",
      "duration": 0,
      "views": 0,
      "isPublished": true,
      "owner": "64a1b2c3d4e5f6789abc123",
      "createdAt": "2025-09-20T13:45:30.123Z"
    }
  }
}
```

**cURL Example:**

```bash
curl -X POST https://full-stack-project-1-ut99.onrender.com/api/v1/videos \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "videoFile=@/path/to/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "title=My Amazing Video" \
  -F "description=This is my amazing video description"
```

### **Get Video by ID**

**GET** `/videos/:videoId`

**Response (200):**

```json
{
  "success": true,
  "message": "Video fetched successfully",
  "data": {
    "video": {
      "_id": "64a1b2c3d4e5f6789abc456",
      "title": "Amazing Tutorial Video",
      "description": "Learn something new...",
      "videoFile": "https://res.cloudinary.com/video.mp4",
      "thumbnail": "https://res.cloudinary.com/thumb.jpg",
      "duration": 600,
      "views": 1501,
      "isPublished": true,
      "owner": {
        "_id": "64a1b2c3d4e5f6789abc789",
        "username": "creator",
        "fullName": "Content Creator",
        "avatar": "https://res.cloudinary.com/...",
        "subscribersCount": 1250
      },
      "isLiked": false,
      "isSubscribed": false,
      "createdAt": "2025-09-19T10:20:30.123Z"
    }
  }
}
```

### **Update Video**

**PATCH** `/videos/:videoId`
🔒 **Auth Required** (Owner only)

**Request Body:**

```json
{
  "title": "Updated Video Title",
  "description": "Updated video description..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": {
    "video": {
      "_id": "64a1b2c3d4e5f6789abc456",
      "title": "Updated Video Title",
      "description": "Updated video description...",
      "videoFile": "https://res.cloudinary.com/video.mp4",
      "thumbnail": "https://res.cloudinary.com/thumb.jpg",
      "updatedAt": "2025-09-20T14:30:15.456Z"
    }
  }
}
```

### **Delete Video**

**DELETE** `/videos/:videoId`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Video deleted successfully",
  "data": {}
}
```

### **Toggle Publish Status**

**PATCH** `/videos/:videoId/toggle-publish`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Video publish status toggled successfully",
  "data": {
    "video": {
      "_id": "64a1b2c3d4e5f6789abc456",
      "title": "Amazing Tutorial Video",
      "isPublished": false,
      "updatedAt": "2025-09-20T14:30:15.456Z"
    }
  }
}
```

---

## 💬 **Comments**

### **Get Video Comments**

**GET** `/videos/:videoId/comments`

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

**Response (200):**

```json
{
  "success": true,
  "message": "Comments fetched successfully",
  "data": {
    "comments": [
      {
        "_id": "64a1b2c3d4e5f6789abc111",
        "content": "Great video! Very helpful.",
        "video": "64a1b2c3d4e5f6789abc456",
        "owner": {
          "_id": "64a1b2c3d4e5f6789abc222",
          "username": "commenter",
          "fullName": "Comment User",
          "avatar": "https://res.cloudinary.com/..."
        },
        "likesCount": 5,
        "isLiked": false,
        "createdAt": "2025-09-19T11:30:45.789Z"
      }
    ],
    "totalDocs": 15,
    "page": 1,
    "totalPages": 2
  }
}
```

### **Add Comment**

**POST** `/videos/:videoId/comments`
🔒 **Auth Required**

**Request Body:**

```json
{
  "content": "This is an amazing video! Thanks for sharing."
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "_id": "64a1b2c3d4e5f6789abc111",
      "content": "This is an amazing video! Thanks for sharing.",
      "video": "64a1b2c3d4e5f6789abc456",
      "owner": {
        "_id": "64a1b2c3d4e5f6789abc123",
        "username": "johndoe",
        "fullName": "John Doe",
        "avatar": "https://res.cloudinary.com/..."
      },
      "createdAt": "2025-09-20T13:45:30.123Z"
    }
  }
}
```

### **Update Comment**

**PATCH** `/comments/:commentId`
🔒 **Auth Required** (Owner only)

**Request Body:**

```json
{
  "content": "Updated comment content..."
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "comment": {
      "_id": "64a1b2c3d4e5f6789abc111",
      "content": "Updated comment content...",
      "updatedAt": "2025-09-20T14:30:15.456Z"
    }
  }
}
```

### **Delete Comment**

**DELETE** `/comments/:commentId`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {}
}
```

---

## ❤️ **Likes**

### **Toggle Video Like**

**POST** `/likes/video/:videoId`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Video like toggled successfully",
  "data": {
    "isLiked": true,
    "likesCount": 126
  }
}
```

### **Toggle Comment Like**

**POST** `/likes/comment/:commentId`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Comment like toggled successfully",
  "data": {
    "isLiked": true,
    "likesCount": 8
  }
}
```

### **Get Liked Videos**

**GET** `/likes/videos`
🔒 **Auth Required**

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

**Response (200):**

```json
{
  "success": true,
  "message": "Liked videos fetched successfully",
  "data": {
    "likedVideos": [
      {
        "_id": "64a1b2c3d4e5f6789abc456",
        "title": "Amazing Tutorial Video",
        "description": "Learn something new...",
        "thumbnail": "https://res.cloudinary.com/thumb.jpg",
        "duration": 600,
        "views": 1500,
        "owner": {
          "username": "creator",
          "fullName": "Content Creator",
          "avatar": "https://res.cloudinary.com/..."
        },
        "likedAt": "2025-09-19T15:20:10.456Z"
      }
    ],
    "totalDocs": 5,
    "page": 1,
    "totalPages": 1
  }
}
```

---

## 🔔 **Subscriptions**

### **Toggle Subscription**

**POST** `/subscriptions/c/:channelId`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Subscription toggled successfully",
  "data": {
    "isSubscribed": true,
    "subscribersCount": 1251
  }
}
```

### **Get Channel Subscribers**

**GET** `/subscriptions/u/:channelId`

**Response (200):**

```json
{
  "success": true,
  "message": "Subscribers fetched successfully",
  "data": {
    "subscribers": [
      {
        "_id": "64a1b2c3d4e5f6789abc123",
        "username": "subscriber1",
        "fullName": "Subscriber One",
        "avatar": "https://res.cloudinary.com/...",
        "subscribedAt": "2025-09-15T10:30:15.123Z"
      }
    ],
    "subscribersCount": 1251
  }
}
```

### **Get User Subscriptions**

**GET** `/subscriptions/s/:subscriberId`

**Response (200):**

```json
{
  "success": true,
  "message": "Subscriptions fetched successfully",
  "data": {
    "subscriptions": [
      {
        "_id": "64a1b2c3d4e5f6789abc789",
        "username": "creator",
        "fullName": "Content Creator",
        "avatar": "https://res.cloudinary.com/...",
        "subscribersCount": 1250,
        "subscribedAt": "2025-09-10T09:15:30.456Z"
      }
    ],
    "subscriptionsCount": 89
  }
}
```

---

## 📚 **Playlists**

### **Get User Playlists**

**GET** `/playlists`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Playlists fetched successfully",
  "data": {
    "playlists": [
      {
        "_id": "64a1b2c3d4e5f6789abc333",
        "name": "My Favorite Videos",
        "description": "Collection of my favorite tutorials",
        "videosCount": 12,
        "totalViews": 15000,
        "updatedAt": "2025-09-18T16:45:20.789Z"
      }
    ]
  }
}
```

### **Create Playlist**

**POST** `/playlists`
🔒 **Auth Required**

**Request Body:**

```json
{
  "name": "Web Development Tutorials",
  "description": "Complete web development learning path"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Playlist created successfully",
  "data": {
    "playlist": {
      "_id": "64a1b2c3d4e5f6789abc444",
      "name": "Web Development Tutorials",
      "description": "Complete web development learning path",
      "owner": "64a1b2c3d4e5f6789abc123",
      "videos": [],
      "createdAt": "2025-09-20T13:45:30.123Z"
    }
  }
}
```

### **Get Playlist Details**

**GET** `/playlists/:playlistId`

**Response (200):**

```json
{
  "success": true,
  "message": "Playlist fetched successfully",
  "data": {
    "playlist": {
      "_id": "64a1b2c3d4e5f6789abc333",
      "name": "My Favorite Videos",
      "description": "Collection of my favorite tutorials",
      "owner": {
        "_id": "64a1b2c3d4e5f6789abc123",
        "username": "johndoe",
        "fullName": "John Doe",
        "avatar": "https://res.cloudinary.com/..."
      },
      "videos": [
        {
          "_id": "64a1b2c3d4e5f6789abc456",
          "title": "Amazing Tutorial Video",
          "thumbnail": "https://res.cloudinary.com/thumb.jpg",
          "duration": 600,
          "views": 1500
        }
      ],
      "videosCount": 12,
      "totalViews": 15000,
      "createdAt": "2025-09-15T12:30:45.123Z"
    }
  }
}
```

### **Update Playlist**

**PATCH** `/playlists/:playlistId`
🔒 **Auth Required** (Owner only)

**Request Body:**

```json
{
  "name": "Updated Playlist Name",
  "description": "Updated description"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Playlist updated successfully",
  "data": {
    "playlist": {
      "_id": "64a1b2c3d4e5f6789abc333",
      "name": "Updated Playlist Name",
      "description": "Updated description",
      "updatedAt": "2025-09-20T14:30:15.456Z"
    }
  }
}
```

### **Delete Playlist**

**DELETE** `/playlists/:playlistId`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Playlist deleted successfully",
  "data": {}
}
```

### **Add Video to Playlist**

**PATCH** `/playlists/add/:videoId/:playlistId`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Video added to playlist successfully",
  "data": {
    "playlist": {
      "_id": "64a1b2c3d4e5f6789abc333",
      "name": "My Favorite Videos",
      "videosCount": 13
    }
  }
}
```

### **Remove Video from Playlist**

**PATCH** `/playlists/remove/:videoId/:playlistId`
🔒 **Auth Required** (Owner only)

**Response (200):**

```json
{
  "success": true,
  "message": "Video removed from playlist successfully",
  "data": {
    "playlist": {
      "_id": "64a1b2c3d4e5f6789abc333",
      "name": "My Favorite Videos",
      "videosCount": 12
    }
  }
}
```

---

## 📊 **Dashboard**

### **Get Channel Statistics**

**GET** `/dashboard/stats`
🔒 **Auth Required**

**Response (200):**

```json
{
  "success": true,
  "message": "Channel stats fetched successfully",
  "data": {
    "totalVideos": 25,
    "totalViews": 50000,
    "totalSubscribers": 1250,
    "totalLikes": 3500,
    "totalComments": 890,
    "averageViews": 2000,
    "topVideo": {
      "_id": "64a1b2c3d4e5f6789abc456",
      "title": "Most Popular Video",
      "views": 10000,
      "likes": 450
    }
  }
}
```

### **Get Channel Videos**

**GET** `/dashboard/videos`
🔒 **Auth Required**

**Query Parameters:**

- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page
- `sortBy` (string): Sort field
- `sortType` (string): Sort order

**Response (200):**

```json
{
  "success": true,
  "message": "Channel videos fetched successfully",
  "data": {
    "videos": [
      {
        "_id": "64a1b2c3d4e5f6789abc456",
        "title": "Amazing Tutorial Video",
        "thumbnail": "https://res.cloudinary.com/thumb.jpg",
        "duration": 600,
        "views": 1500,
        "likes": 85,
        "comments": 23,
        "isPublished": true,
        "createdAt": "2025-09-19T10:20:30.123Z"
      }
    ],
    "totalDocs": 25,
    "page": 1,
    "totalPages": 3
  }
}
```

---

## 🚨 **Error Codes**

| Code | Description                              |
| ---- | ---------------------------------------- |
| 400  | Bad Request - Invalid request data       |
| 401  | Unauthorized - Missing or invalid token  |
| 403  | Forbidden - Insufficient permissions     |
| 404  | Not Found - Resource doesn't exist       |
| 409  | Conflict - Resource already exists       |
| 413  | Payload Too Large - File size exceeded   |
| 422  | Unprocessable Entity - Validation failed |
| 429  | Too Many Requests - Rate limit exceeded  |
| 500  | Internal Server Error - Server error     |

---

## 📝 **Rate Limiting**

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## 🔧 **File Upload Specifications**

### **Avatar/Cover Images**

- **Formats**: JPG, JPEG, PNG, GIF
- **Max Size**: 5MB
- **Recommended**: 400x400px (avatar), 1200x300px (cover)

### **Video Files**

- **Formats**: MP4, AVI, MOV, MKV
- **Max Size**: 100MB
- **Recommended**: 1080p, 30fps

### **Thumbnails**

- **Formats**: JPG, JPEG, PNG
- **Max Size**: 2MB
- **Recommended**: 1280x720px (16:9 ratio)
