# Direct Cloudinary Upload - Visual Guide

## 🎯 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR APPLICATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React)                      │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │                                                          │  │
│  │  1. VideoUploadComponent.jsx                           │  │
│  │     ├─ File Input (video + thumbnail)                 │  │
│  │     ├─ useCloudinaryUpload() hook                     │  │
│  │     └─ publishVideo() API call                        │  │
│  │                                                        │  │
│  │  2. cloudinary.service.js                            │  │
│  │     └─ uploadToCloudinary(file, type)                │  │
│  │                                                        │  │
│  │  3. useCloudinaryUpload.js hook                       │  │
│  │     ├─ isUploading state                             │  │
│  │     ├─ uploadProgress tracking                        │  │
│  │     └─ error handling                                │  │
│  │                                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                                      │
│           │ 1. File Upload (Direct)                            │
│           │                                                      │
└───────────┼──────────────────────────────────────────────────────┘
            │
            ├──────────────────────────────────────────────────────┐
            │                                                      │
            │          ┌──────────────────────────────────┐       │
            │          │   CLOUDINARY (CDN)              │       │
            │          ├──────────────────────────────────┤       │
            │          │                                 │       │
            │          │  File Processing:               │       │
            │          │  • Video transcoding           │       │
            │          │  • Thumbnail generation        │       │
            │          │  • Metadata extraction         │       │
            │          │  • Duration calculation        │       │
            │          │                                 │       │
            │          └──────────────────────────────────┘       │
            │                      │                               │
            │                      │ 2. Return URLS              │
            │                      │                               │
            └─────────────────────┬┤────────────────────────────────┘
                                  │
                    ┌─────────────┴──────────────┐
                    │                            │
        videoUrl    │                 thumbnailUrl
   res.cloudinary.../                    res.cloudinary.../
   video.mp4                          thumbnail.jpg
        │                                       │
        │         3. Send to Backend           │
        └──────────────────┬────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          │                                 │
│  ┌──────────────────────┴─────────────────────────────┐   │
│  │           BACKEND (Node.js/Express)               │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                    │   │
│  │  POST /api/v1/videos                            │   │
│  │  ├─ Receive videoUrl & thumbnailUrl            │   │
│  │  ├─ Validate Zod schema                        │   │
│  │  ├─ Validate URLs are from Cloudinary         │   │
│  │  ├─ Create Video in MongoDB                    │   │
│  │  └─ Return created video                       │   │
│  │                                                    │   │
│  │  Required fields:                              │   │
│  │  • title (string)                              │   │
│  │  • description (string)                        │   │
│  │  • videoUrl (Cloudinary URL)                  │   │
│  │  • thumbnailUrl (Cloudinary URL)              │   │
│  │  • duration (number, optional)                │   │
│  │                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │ 4. Store in Database                           │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │          MONGODB                                    │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                    │   │
│  │  Video Document:                               │   │
│  │  {                                             │   │
│  │    _id: ObjectId,                            │   │
│  │    title: "My Video",                        │   │
│  │    description: "...",                       │   │
│  │    videoFiles: "https://cloudinary.../", ◄─ URL │   │
│  │    thumbnail: "https://cloudinary.../",  ◄─ URL │   │
│  │    duration: 120,                          │   │
│  │    owner: ObjectId,                        │   │
│  │    views: 0,                               │   │
│  │    isPublished: true,                      │   │
│  │    createdAt: ISODate,                     │   │
│  │  }                                           │   │
│  │                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 📊 Request Flow Sequence

```
User                Frontend             Cloudinary           Backend           Database
│                     │                    │                   │                 │
│ 1. Select files     │                    │                   │                 │
├────────────────────>│                    │                   │                 │
│                     │ 2. Upload video    │                   │                 │
│                     ├───────────────────>│                   │                 │
│                     │                    │ 3. Process video  │                 │
│                     │                    │ (transcode,etc)   │                 │
│                     │<───────────────────┤                   │                 │
│                     │ 4. Video URL       │                   │                 │
│                     │                    │                   │                 │
│                     │ 5. Upload thumbnail
│                     ├───────────────────>│                   │                 │
│                     │<───────────────────┤                   │                 │
│                     │ 6. Thumbnail URL   │                   │                 │
│                     │                                        │                 │
│                     │ 7. POST /api/v1/videos               │                 │
│                     │ {videoUrl, thumbnailUrl}             │                 │
│                     ├──────────────────────────────────────>│                 │
│                     │                    │                   │ 8. Validate   │
│                     │                    │                   ├─────────────┐  │
│                     │                    │                   │ URL Checks  │  │
│                     │                    │                   │<────────────┘  │
│                     │                    │                   │ 9. Create Doc │
│                     │                    │                   ├─────────────┐  │
│                     │                    │                   │ Insert into │  │
│                     │                    │                   │ MongoDB     │  │
│                     │                    │                   │<────────────┘  │
│                     │                    │                   │ 10. Success   │
│                     │<──────────────────────────────────────┤                 │
│ 11. Video created!  │                    │                   │                 │
│<────────────────────┤                    │                   │                 │
│                     │                    │                   │                 │
```

## 🔧 Component Interactions

```
┌─────────────────────────────────────────────────────────────┐
│         VideoUploadComponent.jsx (Main Component)           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ State Management:                                   │   │
│  │ • title, description (form inputs)                │   │
│  │ • videoUrl, thumbnailUrl (from Cloudinary)       │   │
│  │ • isPublishing (button state)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ useCloudinaryUpload() Hook                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Returns:                                            │   │
│  │ • upload() - async function                       │   │
│  │ • isUploading - boolean                           │   │
│  │ • uploadProgress - 0-100                          │   │
│  │ • error - error message or null                   │   │
│  │ • reset() - reset state                           │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ cloudinary.service.js                              │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ • uploadToCloudinary(file, type)                  │   │
│  │   ├─ Creates FormData                             │   │
│  │   ├─ Adds upload_preset                           │   │
│  │   ├─ Adds cloud_name                              │   │
│  │   ├─ POST to Cloudinary API                       │   │
│  │   └─ Returns {url, publicId, duration, size}     │   │
│  │                                                   │   │
│  │ • uploadVideo(file)                              │   │
│  │   └─ calls uploadToCloudinary(file, 'video')    │   │
│  │                                                   │   │
│  │ • uploadImage(file)                              │   │
│  │   └─ calls uploadToCloudinary(file, 'image')    │   │
│  └─────────────────────────────────────────────────────┘   │
│                     │                                       │
│                     ▼                                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ video.api.js                                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ • publishVideo({                                   │   │
│  │     title,                                        │   │
│  │     description,                                 │   │
│  │     videoUrl,      ◄─ From Cloudinary           │   │
│  │     thumbnailUrl   ◄─ From Cloudinary           │   │
│  │   })                                             │   │
│  │   └─ POST to /api/v1/videos                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔐 Validation Flow

```
Request arrives at Backend
        │
        ▼
┌─────────────────────────────────────────┐
│ 1. JWT Authentication Middleware        │
│ • Verify token exists                   │
│ • Decode JWT                            │
│ • Extract user info                     │
└─────────────────────────────────────────┘
        │ ✓ Authenticated
        ▼
┌─────────────────────────────────────────┐
│ 2. Zod Schema Validation (VideoCreateBody)
│ • title: string, 1-200 chars           │
│ • description: string, max 2000 chars  │
│ • videoUrl: URL, must have 'cloudinary' │
│ • thumbnailUrl: URL, must have 'cloudinary'
│ • duration: number, optional            │
└─────────────────────────────────────────┘
        │ ✓ Schema valid
        ▼
┌─────────────────────────────────────────┐
│ 3. Business Logic Validation            │
│ • Check user owns video (if updating)  │
│ • Validate file types (if applicable)  │
│ • Check resource limits                │
└─────────────────────────────────────────┘
        │ ✓ All valid
        ▼
┌─────────────────────────────────────────┐
│ 4. Database Operation                   │
│ • Create/Update document                │
│ • Return result                         │
└─────────────────────────────────────────┘
        │ ✓ Success
        ▼
Response sent to client
```

## 📦 Data Flow

```
Browser File Input
        │
        ├─────────────────┐
        │                 │
        ▼                 ▼
   Video File        Thumbnail File
        │                 │
        └────────┬────────┘
                 │
        useCloudinaryUpload hook
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    uploadVideo()   uploadImage()
        │                 │
        └────────┬────────┘
                 │
    uploadToCloudinary()
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
    VideoUrl        ThumbnailUrl
        │                 │
        └────────┬────────┘
                 │
    { videoUrl, thumbnailUrl, title, description }
                 │
        publishVideo() API
                 │
        POST /api/v1/videos
                 │
        Backend Controller
                 │
        ┌────────┴────────┐
        │                 │
   Validate          Create in MongoDB
        │                 │
        └────────┬────────┘
                 │
         Video Document
                 │
        ┌────────┴────────┐
        │                 │
   Stored URLs       Ready to Stream
```

## 📝 Implementation Checklist

```
FRONTEND SETUP
☐ Install dependencies (if needed)
☐ Create cloudinary.service.js ✓
☐ Create useCloudinaryUpload.js ✓
☐ Create VideoUploadComponent.jsx ✓
☐ Create .env.local with Cloudinary credentials
☐ Import and use in your pages

BACKEND SETUP
☐ Update video.controller.js ✓
☐ Update video.routes.js ✓
☐ Update video.schemas.js ✓
☐ Test endpoint with Postman/curl

CLOUDINARY SETUP
☐ Create account at cloudinary.com
☐ Create unsigned upload preset
☐ Copy Cloud Name
☐ Add to .env.local

TESTING
☐ Upload video file
☐ Upload thumbnail file
☐ Check Cloudinary dashboard for files
☐ Verify URLs in database
☐ Stream video from database
```

---

This visual guide shows how all components work together to create a seamless direct upload experience!
