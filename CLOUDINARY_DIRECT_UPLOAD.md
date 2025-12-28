# Direct Cloudinary Upload Implementation

## Overview

This implementation allows direct file uploads from the frontend to Cloudinary, bypassing the backend server. The backend only receives and stores the Cloudinary URLs in the database.

## Architecture

```
Frontend (Browser)
    ↓
Cloudinary (Direct Upload)
    ↓
Cloudinary (Returns URL)
    ↓
Backend (Store URL in Database)
```

## Benefits

- ✅ **Reduced Server Load**: Server doesn't process large files
- ✅ **Faster Uploads**: Direct connection to CDN
- ✅ **Better Scalability**: No bandwidth bottleneck on backend
- ✅ **Automatic Processing**: Cloudinary handles video/audio processing

## Setup Instructions

### 1. Cloudinary Configuration

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings → Upload**
3. Scroll to **Upload presets** section
4. Click **Create upload preset**
5. Configure:
   - **Name**: Choose any name (e.g., `your_preset_name`)
   - **Mode**: Select **Unsigned**
   - **Allowed file types**: Video, Image
   - **Save**: Click to create
6. Copy your **Cloud Name** from the dashboard header

### 2. Frontend Environment Setup

Create `.env.local` in the Frontend folder:

```env
VITE_BASE_URL=http://localhost:8000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### 3. Remove Multer Middleware (Optional)

If you're only using direct upload, you can remove or disable file upload middleware:

```javascript
// In routes, remove:
upload.fields([
  { name: "videoFile", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);
```

## Frontend Usage

### Using the Hook

```javascript
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { uploadVideo, uploadImage } from "@/services/cloudinary.service";

function MyComponent() {
  const { upload, isUploading, uploadProgress, error } = useCloudinaryUpload();

  const handleVideoUpload = async (file) => {
    try {
      const result = await upload(file, "video");
      console.log("Video URL:", result.url);
      console.log("Duration:", result.duration);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => handleVideoUpload(e.target.files[0])}
      />
      {isUploading && <p>Uploading... {uploadProgress}%</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### Using the Service Directly

```javascript
import { uploadVideo, uploadImage } from "@/services/cloudinary.service";

const videoResult = await uploadVideo(videoFile);
const thumbnailResult = await uploadImage(imageFile);

console.log(videoResult.url); // Cloudinary URL
console.log(videoResult.duration); // Video duration in seconds
```

### Complete Example: Video Upload Component

```javascript
import { useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { publishVideo } from "@/api/video.api";

export function VideoUploadPage() {
  const videoUpload = useCloudinaryUpload();
  const thumbnailUpload = useCloudinaryUpload();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await videoUpload.upload(file, "video");
      setVideoUrl(result.url);
    } catch (err) {
      console.error("Video upload failed:", err);
    }
  };

  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await thumbnailUpload.upload(file, "image");
      setThumbnailUrl(result.url);
    } catch (err) {
      console.error("Thumbnail upload failed:", err);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    try {
      const response = await publishVideo({
        title,
        description,
        videoUrl,
        thumbnailUrl,
      });
      console.log("Video published:", response.data);
    } catch (err) {
      console.error("Publish failed:", err);
    }
  };

  return (
    <form onSubmit={handlePublish}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        disabled={videoUpload.isUploading}
      />
      {videoUpload.isUploading && <p>Uploading video...</p>}
      {videoUrl && <p>✓ Video ready</p>}

      <input
        type="file"
        accept="image/*"
        onChange={handleThumbnailSelect}
        disabled={thumbnailUpload.isUploading}
      />
      {thumbnailUpload.isUploading && <p>Uploading thumbnail...</p>}
      {thumbnailUrl && <p>✓ Thumbnail ready</p>}

      <button type="submit" disabled={!videoUrl || !thumbnailUrl}>
        Publish Video
      </button>
    </form>
  );
}
```

## Backend Changes

### Updated Controller (`publishAVideo`)

```javascript
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, videoUrl, thumbnailUrl, duration } = req.body;

  if (!videoUrl || !thumbnailUrl) {
    throw new ApiError(400, "Video and thumbnail URLs are required");
  }

  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    videoFiles: videoUrl,
    thumbnail: thumbnailUrl,
    duration: duration || 0,
    owner: req.user._id,
    isPublished: true,
  });

  return res
    .status(201)
    .json(new ApiResponse(video, 201, "Video published successfully"));
});
```

### Updated Routes

```javascript
router.post(
  "/",
  verifyJWT,
  validateRequest({ body: VideoCreateBody }),
  publishAVideo
);
// No file upload middleware needed!
```

### Updated Validation Schema

```javascript
export const VideoCreateBody = z
  .object({
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(2000),
    videoUrl: z
      .string()
      .url()
      .refine(
        (url) => url.includes("cloudinary"),
        "Video URL must be from Cloudinary"
      ),
    thumbnailUrl: z
      .string()
      .url()
      .refine(
        (url) => url.includes("cloudinary"),
        "Thumbnail URL must be from Cloudinary"
      ),
    duration: z.number().min(0).optional().default(0),
  })
  .strict();
```

## API Endpoint

### Publish Video

**POST** `/api/v1/videos`

**Headers:**

```json
{
  "Authorization": "Bearer {accessToken}",
  "Content-Type": "application/json"
}
```

**Request Body:**

```json
{
  "title": "My Awesome Video",
  "description": "This is a great video",
  "videoUrl": "https://res.cloudinary.com/..../video.mp4",
  "thumbnailUrl": "https://res.cloudinary.com/..../image.jpg",
  "duration": 120
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "title": "My Awesome Video",
    "description": "This is a great video",
    "videoFiles": "https://res.cloudinary.com/.../video.mp4",
    "thumbnail": "https://res.cloudinary.com/.../image.jpg",
    "duration": 120,
    "owner": {...},
    "isPublished": true,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "message": "Video published successfully"
}
```

## Handling Audio Files

The same process works for audio files:

```javascript
import { uploadToCloudinary } from "@/services/cloudinary.service";

const audioResult = await uploadToCloudinary(audioFile, "auto");
// audioResult.url will contain the audio URL
// audioResult.duration will contain the audio duration
```

## Progress Tracking

For better progress tracking during upload, you can use XMLHttpRequest instead of fetch:

```javascript
export const uploadToCloudinaryWithProgress = async (
  file,
  fileType = "auto",
  onProgress
) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress?.(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          duration: data.duration || null,
        });
      } else {
        reject(new Error("Upload failed"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload error"));
    });

    const resourceType = fileType === "video" ? "video" : "image";
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`
    );
    xhr.send(formData);
  });
};
```

## Security Considerations

1. **Unsigned Upload Presets**: Only use unsigned presets for development or low-security apps
2. **Server-Side Validation**: Always validate Cloudinary URLs on the backend (already implemented)
3. **Rate Limiting**: Implement rate limiting on the `/api/v1/videos` endpoint
4. **File Size Limits**: Set max file sizes in Cloudinary upload preset settings
5. **File Type Restrictions**: Use allowed file types in Cloudinary settings

## Troubleshooting

### Upload fails with CORS error

- Check Cloudinary settings → Security → Allowed domains
- Add your frontend domain to allowed CORS origins

### Video URL not from Cloudinary

- Ensure the file is being uploaded to Cloudinary directly, not your server
- Check `VITE_CLOUDINARY_CLOUD_NAME` is correct

### Preset not found error

- Verify `VITE_CLOUDINARY_UPLOAD_PRESET` exists in your Cloudinary dashboard
- Check it's set to "Unsigned" mode

### Environment variables not loading

- Restart dev server after changing `.env.local`
- Prefix all variables with `VITE_`

## Files Modified/Created

✅ **Created:**

- `Frontend/src/services/cloudinary.service.js` - Upload service
- `Frontend/src/hooks/useCloudinaryUpload.js` - React hook
- `Frontend/src/components/VideoUploadComponent.jsx` - Example component
- `Frontend/.env.example` - Environment variables template

✅ **Updated:**

- `Backend/src/controllers/video.controller.js` - Updated `publishAVideo` to accept URLs
- `Backend/src/routes/video.routes.js` - Removed multer middleware from POST route
- `Backend/src/schemas/video.schemas.js` - Updated validation for URLs
- `Frontend/src/api/video.api.js` - Updated `publishVideo` function

## Next Steps

1. Set up Cloudinary unsigned upload preset
2. Configure `.env.local` with your credentials
3. Use the hook or service in your upload components
4. Test the flow: select file → upload to Cloudinary → send URL to backend
