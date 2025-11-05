import axios from "axios";
import { getStoredAuth } from '../hooks/utilsAuth';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const authData = getStoredAuth();
  if (authData?.token) {
    config.headers.Authorization = `Bearer ${authData.token}`;
  }
  return config;
});

export const authService = {
  register: (username, email, password) =>
    api.post("/auth/register", { username, email, password }),
  login: async(username, password) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  }
};

export const postService = {
  getAllPosts: () => api.get("/posts/"),
  getMyPosts: () => api.get("/posts/me"),
  createPost: (title, content) =>
    api.post("/posts/", { title, content }),
  updatePost: (postId, title, content) =>
    api.put(`/posts/${postId}`, { title, content }),
  deletePost: (postId) =>
    api.delete(`/posts/${postId}`),
};

export default api;