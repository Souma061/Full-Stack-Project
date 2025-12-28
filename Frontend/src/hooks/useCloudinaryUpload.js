import { useCallback, useState } from 'react';
import { uploadToCloudinary } from '../services/cloudinary.service';

export const useCloudinaryUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (file, fileType = 'auto') => {
    try {
      setError(null);
      setIsUploading(true);
      setUploadProgress(0);

      // Note: FormData doesn't provide progress events in standard fetch
      // For progress tracking, you would need to use XMLHttpRequest or a library like axios
      // For now, we'll just show 50% during upload and 100% when complete

      setUploadProgress(50);
      const result = await uploadToCloudinary(file, fileType);
      setUploadProgress(100);

      return result;
    } catch (err) {
      const errorMessage = err.message || 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setUploadProgress(0);
  }, []);

  return {
    upload,
    isUploading,
    uploadProgress,
    error,
    reset,
  };
};
