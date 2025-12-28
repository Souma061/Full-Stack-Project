import { useState } from 'react';
import { publishVideo } from '../api/video.api';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';

/**
 * Example: VideoUploadComponent
 * Shows how to use direct Cloudinary upload for videos
 *
 * Usage:
 * import VideoUploadComponent from '@/components/VideoUploadComponent';
 *
 * <VideoUploadComponent onSuccess={(video) => console.log(video)} />
 */
export const VideoUploadComponent = ({ onSuccess }) => {
  const { upload: uploadVideo, isUploading: isUploadingVideo, error: uploadError } = useCloudinaryUpload();
  const { upload: uploadThumbnail, isUploading: isUploadingThumbnail, error: thumbnailError } = useCloudinaryUpload();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [duration, setDuration] = useState(0);

  const handleVideoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting video upload to Cloudinary:', file.name);
      const result = await uploadVideo(file, 'video');
      console.log('Video upload result:', result);
      setVideoUrl(result.url);
      // Get video duration from Cloudinary response if available
      if (result.duration) {
        setDuration(result.duration);
      }
      console.log('Video URL set to:', result.url);
    } catch (err) {
      console.error('Video upload failed:', err);
    }
  };

  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      console.log('Starting thumbnail upload to Cloudinary:', file.name);
      const result = await uploadThumbnail(file, 'image');
      console.log('Thumbnail upload result:', result);
      setThumbnailUrl(result.url);
      console.log('Thumbnail URL set to:', result.url);
    } catch (err) {
      console.error('Thumbnail upload failed:', err);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    console.log('Publish clicked:', {
      title,
      description,
      videoUrl,
      thumbnailUrl,
      duration,
    });

    if (!title || !description || !videoUrl || !thumbnailUrl) {
      const missing = [];
      if (!title) missing.push('Title');
      if (!description) missing.push('Description');
      if (!videoUrl) missing.push('Video URL');
      if (!thumbnailUrl) missing.push('Thumbnail URL');
      console.error('Missing fields:', missing);
      alert('Please fill all fields and upload both video and thumbnail:\n' + missing.join(', '));
      return;
    }

    try {
      setIsPublishing(true);
      console.log('Publishing video to backend...', {
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
      });

      const response = await publishVideo({
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration,
      });

      console.log('Video published successfully:', response);

      // Reset form
      setTitle('');
      setDescription('');
      setVideoUrl('');
      setThumbnailUrl('');
      setDuration(0);

      if (onSuccess) {
        onSuccess(response.data);
      }

      alert('Video published successfully!');
    } catch (err) {
      console.error('Publish failed:', err);
      alert('Failed to publish video: ' + err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <form onSubmit={handlePublish} className="video-upload-form">
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          required
        />
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          required
        />
      </div>

      <div>
        <label>Video File:</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleVideoSelect}
          disabled={isUploadingVideo}
        />
        {isUploadingVideo && <p>Uploading video to Cloudinary...</p>}
        {uploadError && <p style={{ color: 'red' }}>Error: {uploadError}</p>}
        {videoUrl && <p style={{ color: 'green' }}>✓ Video uploaded: {videoUrl}</p>}
      </div>

      <div>
        <label>Thumbnail:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailSelect}
          disabled={isUploadingThumbnail}
        />
        {isUploadingThumbnail && <p>Uploading thumbnail to Cloudinary...</p>}
        {thumbnailError && <p style={{ color: 'red' }}>Error: {thumbnailError}</p>}
        {thumbnailUrl && <p style={{ color: 'green' }}>✓ Thumbnail uploaded: {thumbnailUrl}</p>}
      </div>

      <button
        type="submit"
        disabled={isPublishing || isUploadingVideo || isUploadingThumbnail || !videoUrl || !thumbnailUrl}
      >
        {isPublishing ? 'Publishing...' : 'Publish Video'}
      </button>
    </form>
  );
};

export default VideoUploadComponent;
