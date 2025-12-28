// Cloudinary upload service
export const uploadToCloudinary = async (file, fileType = 'auto') => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    // Set resource type based on file type
    const resourceType = fileType === 'video' ? 'video' : 'image';

    console.log('Uploading to Cloudinary:', {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      fileType,
      resourceType,
      fileName: file.name,
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Cloudinary error response:', error);
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('Cloudinary upload success:', {
      url: data.secure_url,
      publicId: data.public_id,
      duration: data.duration,
    });

    return {
      url: data.secure_url,
      publicId: data.public_id,
      duration: data.duration || null,
      size: data.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const uploadVideo = async (videoFile) => {
  return uploadToCloudinary(videoFile, 'video');
};

export const uploadImage = async (imageFile) => {
  return uploadToCloudinary(imageFile, 'image');
};
