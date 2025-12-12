import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosInstance";

// ============ VIDEO QUERIES ============

export const useGetAllVideos = (params = {}) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: async () => {
      const response = await apiClient.get("/videos", { params });
      // response is already { statusCode, data: { videos, pagination }, message, success }
      return {
        data: response.data.videos, // Return just the videos array
        pagination: response.data.pagination,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetVideoById = (videoId) => {
  return useQuery({
    queryKey: ["video", videoId],
    queryFn: async () => {
      const response = await apiClient.get(`/videos/${videoId}`);
      return response.data;
    },
    enabled: !!videoId, // Only run query if videoId exists
    staleTime: 5 * 60 * 1000,
  });
};

// ============ USER QUERIES ============

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await apiClient.get("/users/current");
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============ USER MUTATIONS ============

export const useRegisterUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userData) => {
      const response = await apiClient.post("/users/register", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate user queries after successful registration
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post("/users/login", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Store tokens if returned
      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
      }
      if (data.data?.refreshToken) {
        localStorage.setItem("refreshToken", data.data.refreshToken);
      }
      // Refetch current user
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useLogoutUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.post("/users/logout");
      return response.data;
    },
    onSuccess: () => {
      // Clear tokens
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Clear all queries
      queryClient.clear();
    },
  });
};

// ============ VIDEO MUTATIONS ============

export const usePublishVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (videoData) => {
      const response = await apiClient.post("/videos", videoData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, data }) => {
      const response = await apiClient.patch(`/videos/${videoId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["video", variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (videoId) => {
      const response = await apiClient.delete(`/videos/${videoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["channelVideos"] });
    },
  });
};

export const useTogglePublishStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (videoId) => {
      const response = await apiClient.patch(`/videos/toggle/publish/${videoId}`);
      return response.data;
    },
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["video", videoId] });
      queryClient.invalidateQueries({ queryKey: ["channelVideos"] });
    },
  });
};

// ============ LIKE QUERIES & MUTATIONS ============

export const useGetLikedVideos = () => {
  return useQuery({
    queryKey: ["likedVideos"],
    queryFn: async () => {
      const response = await apiClient.get("/likes/videos");
      return response.data;
    },
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId }) => {
      const response = await apiClient.post(`/likes/toggle/v/${videoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      queryClient.invalidateQueries({ queryKey: ["likedVideos"] });
    },
  });
};

// ============ COMMENT QUERIES & MUTATIONS ============

export const useGetComments = (videoId) => {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: async () => {
      const response = await apiClient.get(`/videos/${videoId}/comments`);
      return response.data;
    },
    enabled: !!videoId,
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, content }) => {
      const response = await apiClient.post(
        `/videos/${videoId}/comments`,
        { content }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.videoId],
      });
    },
  });
};

// ============ SUBSCRIPTION MUTATIONS ============

export const useGetSubscribedChannels = (subscriberId) => {
  return useQuery({
    queryKey: ["subscribedChannels", subscriberId],
    queryFn: async () => {
      const response = await apiClient.get(`/subscriptions/u/${subscriberId}`);
      return response.data;
    },
    enabled: !!subscriberId,
  });
};

export const useToggleSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channelId) => {
      const response = await apiClient.post(
        `/subscriptions/c/${channelId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribedChannels"] });
      queryClient.invalidateQueries({ queryKey: ["channelProfile"] });
    },
  });
};

// ============ HISTORY QUERIES ============

export const useGetWatchHistory = () => {
  return useQuery({
    queryKey: ["watchHistory"],
    queryFn: async () => {
      const response = await apiClient.get("/users/watch-history");
      return response.data;
    },
  });
};

// ============ DASHBOARD QUERIES ============

export const useGetChannelStats = () => {
  return useQuery({
    queryKey: ["channelStats"],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/stats");
      return response.data;
    },
  });
};

export const useGetChannelVideos = (params = {}) => {
  return useQuery({
    queryKey: ["channelVideos", params],
    queryFn: async () => {
      const response = await apiClient.get("/dashboard/videos", { params });
      return response.data;
    },
  });
};

// ============ PLAYLIST QUERIES & MUTATIONS ============

export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playlistData) => {
      const response = await apiClient.post("/playlists", playlistData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useGetPlaylistById = (playlistId) => {
  return useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: async () => {
      const response = await apiClient.get(`/playlists/${playlistId}`);
      return response.data;
    },
    enabled: !!playlistId,
  });
};

export const useGetUserPlaylists = (userId) => {
  return useQuery({
    queryKey: ["playlists", userId],
    queryFn: async () => {
      const response = await apiClient.get(`/playlists/user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ playlistId, data }) => {
      const response = await apiClient.patch(`/playlists/${playlistId}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playlistId) => {
      const response = await apiClient.delete(`/playlists/${playlistId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlists"] });
    },
  });
};

export const useAddVideoToPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const response = await apiClient.patch(`/playlists/add/${videoId}/${playlistId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
};

export const useRemoveVideoFromPlaylist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId, playlistId }) => {
      const response = await apiClient.patch(`/playlists/remove/${videoId}/${playlistId}`);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["playlist", variables.playlistId] });
    },
  });
};

// ============ CHANNEL PROFILE ===========

export const useGetUserChannelProfile = (username) => {
  return useQuery({
    queryKey: ["channelProfile", username],
    queryFn: async () => {
      const response = await apiClient.get(`/users/channel/${username}`);
      return response.data;
    },
    enabled: !!username,
  });
};
