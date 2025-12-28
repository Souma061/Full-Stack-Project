# Direct Cloudinary Upload - Quick Reference

## 📋 Setup Checklist

- [ ] Create Cloudinary account at https://cloudinary.com
- [ ] Create unsigned upload preset in Dashboard → Settings → Upload
- [ ] Copy Cloud Name from dashboard
- [ ] Create `.env.local` in Frontend with Cloudinary credentials
- [ ] Restart frontend dev server

## 🚀 Quick Usage

### Option 1: Using the Hook (Recommended)

```javascript
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { publishVideo } from "@/api/video.api";

export function MyUploadComponent() {
  const { upload, isUploading, error } = useCloudinaryUpload();

  const handleUpload = async (file) => {
    try {
      const result = await upload(file, "video");
      console.log(result.url); // Cloudinary URL
    } catch (err) {
      console.error("Failed:", err);
    }
  };

  return (
    <input
      type="file"
      accept="video/*"
      onChange={(e) => handleUpload(e.target.files[0])}
      disabled={isUploading}
    />
  );
}
```

### Option 2: Using the Service

```javascript
import { uploadVideo, uploadImage } from "@/services/cloudinary.service";

const videoResult = await uploadVideo(videoFile);
const thumbnailResult = await uploadImage(thumbnailFile);

// Send to backend
await publishVideo({
  title: "My Video",
  description: "Description",
  videoUrl: videoResult.url,
  thumbnailUrl: thumbnailResult.url,
});
```

### Option 3: Use the Example Component

```javascript
import VideoUploadComponent from "@/components/VideoUploadComponent";

export function UploadPage() {
  return (
    <VideoUploadComponent
      onSuccess={(video) => console.log("Video created:", video)}
    />
  );
}
```

## 📦 Created Files

| Path                                               | Purpose                        |
| -------------------------------------------------- | ------------------------------ |
| `Frontend/src/services/cloudinary.service.js`      | Upload functions               |
| `Frontend/src/hooks/useCloudinaryUpload.js`        | React hook for uploads         |
| `Frontend/src/components/VideoUploadComponent.jsx` | Example component              |
| `Frontend/.env.example`                            | Environment variables template |
| `CLOUDINARY_DIRECT_UPLOAD.md`                      | Full documentation             |
| `IMPLEMENTATION_SUMMARY.md`                        | Implementation overview        |

## 🔧 Updated Files

| Path                                          | What Changed                     |
| --------------------------------------------- | -------------------------------- |
| `Backend/src/controllers/video.controller.js` | `publishAVideo` accepts URLs now |
| `Backend/src/routes/video.routes.js`          | Removed multer middleware        |
| `Backend/src/schemas/video.schemas.js`        | Added URL validation             |
| `Frontend/src/api/video.api.js`               | Updated `publishVideo` function  |

## 🎯 Key Functions

### `uploadToCloudinary(file, fileType)`

Upload any file to Cloudinary and get URL back

```javascript
const result = await uploadToCloudinary(file, "video");
// Returns: { url, publicId, duration, size }
```

### `useCloudinaryUpload()`

React hook to manage upload state

```javascript
const { upload, isUploading, uploadProgress, error, reset } =
  useCloudinaryUpload();
```

### `publishVideo(videoData)`

Send video metadata + URLs to backend

```javascript
await publishVideo({
  title: "Title",
  description: "Description",
  videoUrl: "https://cloudinary.../video.mp4",
  thumbnailUrl: "https://cloudinary.../thumb.jpg",
  duration: 120,
});
```

## 🔒 Environment Variables

```env
# Frontend/.env.local
VITE_BASE_URL=http://localhost:8000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

## ✅ Request/Response

### Request to Backend

```json
POST /api/v1/videos
{
  "title": "Video Title",
  "description": "Video Description",
  "videoUrl": "https://res.cloudinary.com/.../video.mp4",
  "thumbnailUrl": "https://res.cloudinary.com/.../image.jpg",
  "duration": 120
}
```

### Response from Backend

```json
{
  "statusCode": 201,
  "data": {
    "_id": "...",
    "title": "Video Title",
    "description": "Video Description",
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

## 🧪 Testing Steps

1. **Create Cloudinary account**
   - Go to https://cloudinary.com/console
   - Sign up and get Cloud Name

2. **Create unsigned preset**
   - Settings → Upload → Upload presets
   - Create preset with mode = "Unsigned"
   - Name it (e.g., "video_upload")

3. **Configure frontend**
   - Create `Frontend/.env.local`
   - Add credentials

4. **Test upload**
   - Use example component or create your own
   - Select video and thumbnail
   - Submit

5. **Verify in MongoDB**
   - Check that video has Cloudinary URLs

## 🆘 Troubleshooting

| Issue                | Solution                          |
| -------------------- | --------------------------------- |
| CORS Error           | Add domain to Cloudinary settings |
| URL validation fails | Check URL contains 'cloudinary'   |
| Env vars not loading | Restart dev server                |
| File upload fails    | Check upload preset is "Unsigned" |
| 400 Bad Request      | Verify JSON body has all fields   |

## 📚 More Info

See **CLOUDINARY_DIRECT_UPLOAD.md** for:

- Detailed setup with screenshots
- Security best practices
- Progress tracking implementation
- Advanced usage patterns
- Complete troubleshooting guide

See **IMPLEMENTATION_SUMMARY.md** for:

- Overview of all changes
- Benefits comparison
- File change summary
