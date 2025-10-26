import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const auth = {
  register: (data: any) => api.post("/auth/register", data),
  login: (data: any) => api.post("/auth/login", data),
  verify: () => api.get("/auth/verify"),
};

// Story endpoints
export const stories = {
  getAll: (params?: any) => api.get("/stories", { params }),
  getById: (id: string) => api.get(`/stories/${id}`),
  create: (data: any, config?: any) => api.post("/stories", data, config),
  update: (id: string, data: any, config?: any) => api.put(`/stories/${id}`, data, config),
  delete: (id: string) => api.delete(`/stories/${id}`),
  like: (id: string) => api.post(`/stories/${id}/like`),
  getUserStories: (userId: string) => api.get(`/stories/user/${userId}`),
};

// Comment endpoints
export const comments = {
  getByStory: (storyId: string) => api.get(`/comments/story/${storyId}`),
  create: (data: any) => api.post("/comments", data),
  update: (id: string, data: any) => api.put(`/comments/${id}`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
};

// Favorite endpoints
export const favorites = {
  getUserFavorites: (userId: string) => api.get(`/favorites/user/${userId}`),
  checkFavorite: (userId: string, storyId: string) => api.get(`/favorites/user/${userId}/story/${storyId}`),
  add: (storyId: string) => api.post(`/favorites/story/${storyId}`),
  remove: (storyId: string) => api.delete(`/favorites/story/${storyId}`),
};

// Follow endpoints
export const follows = {
  getFollowers: (userId: string) => api.get(`/follows/followers/${userId}`),
  getFollowing: (userId: string) => api.get(`/follows/following/${userId}`),
  check: (userId: string) => api.get(`/follows/check/${userId}`),
  follow: (userId: string) => api.post(`/follows/${userId}`),
  unfollow: (userId: string) => api.delete(`/follows/${userId}`),
};

// User endpoints
export const users = {
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any, config?: any) => api.put(`/users/${id}`, data, config),
  search: (query: string) => api.get(`/users/search/${query}`),
};

// Stats endpoints
export const stats = {
  getOverview: () => api.get("/stats/overview"),
  getUserStats: (userId: string) => api.get(`/stats/user/${userId}`),
  getStoryStats: (storyId: string) => api.get(`/stats/story/${storyId}`),
};

export default api;
