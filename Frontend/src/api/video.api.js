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
