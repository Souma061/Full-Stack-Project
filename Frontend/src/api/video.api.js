import axiosInstance from './axiosInstance';

export const getAllVideos = async (page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc', userId = '') => {
  // Construct the query string properly
  const params = new URLSearchParams({
    page,
    limit,
    query,
    sortBy,
    sortType,
  });
  // Add userId only if it exists
  if (userId) {
    params.append('userId', userId);
  }

  const { data } = await axiosInstance.get(`/videos?${params.toString()}`);
  return data;
};

export const getVideoById = async (videoId) => {
  const { data } = await axiosInstance.get(`/videos/${videoId}`);
  return data;
};

export const publishVideo = async (videoData, onUploadProgress) => {
  // videoData should contain: title, description, videoFile, thumbnail
  const { data } = await axiosInstance.post('/videos', videoData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onUploadProgress) {
        onUploadProgress(percentCompleted);
      }
    }
  });
  return data;
};

export const updateVideo = async (videoId, updateData) => {
  const { data } = await axiosInstance.patch(`/videos/${videoId}`, updateData);
  return data;
};

export const deleteVideo = async (videoId) => {
  const { data } = await axiosInstance.delete(`/videos/${videoId}`);
  return data;
};

export const togglePublishStatus = async (videoId) => {
  const { data } = await axiosInstance.patch(`/videos/toggle/publish/${videoId}`);
  return data;
};
