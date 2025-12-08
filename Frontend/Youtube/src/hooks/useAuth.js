import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosInstance";

// ====================== LOGIN ======================
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const res = await apiClient.post("/users/login", credentials, {
        withCredentials: true,
      });
      return res.data; // Always return res.data
    },

    onSuccess: (data) => {
      // Store ONLY access token, NOT refresh token
      localStorage.setItem("accessToken", data.accessToken);

      // Refresh current user data
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// ====================== REGISTER ======================
export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData) => {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("fullName", userData.fullName);

      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }

      const res = await apiClient.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return res.data;
    },

    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
    },
  });
};

// ====================== LOGOUT ======================
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/users/logout", {}, { withCredentials: true });
    },

    onSuccess: () => {
      localStorage.removeItem("accessToken");
      queryClient.invalidateQueries(); // Clear logged-in queries
    },
  });
};

// ====================== GET CURRENT USER ======================
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["currentUser"],

    queryFn: async () => {
      const res = await apiClient.get("/users/me", {
        withCredentials: true,
      });
      return res.data;
    },

    enabled: !!localStorage.getItem("accessToken"),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ====================== AUTH STATE CHECK ======================
export const useIsAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};
