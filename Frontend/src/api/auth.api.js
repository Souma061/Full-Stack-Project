import axiosInstance from "./axiosInstance";

export const registerUser = async (formData) => {
  const { data } = await axiosInstance.post(
    "/users/register",
    formData
  );
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosInstance.post(
    "/users/login",
    credentials
  );
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post(
    "/users/logout"
  );
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get(
    "/users/me"
  );
  return data;
};
