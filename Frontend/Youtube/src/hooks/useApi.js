import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosInstance";

// ============ VIDEO QUERIES ============

export const useGetAllVideos = (params = {}) => {
  return useQuery({
    queryKey: ["videos", params],
    queryFn: async () => {
      const response = await apiClient.get("/videos", { params });
      return response.data;
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
    },
  });
};

// ============ LIKE MUTATIONS ============

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ videoId }) => {
      const response = await apiClient.post(`/likes/toggle/v/${videoId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

// ============ COMMENT MUTATIONS ============

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
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
};
