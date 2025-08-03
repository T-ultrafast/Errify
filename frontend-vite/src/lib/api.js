import axios from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.error('Error getting session:', error);
  }
  
  // Debug request data
  if (config.data) {
    console.log('Request data being sent:', config.data);
    console.log('Request data type:', typeof config.data);
    console.log('Request data stringified:', JSON.stringify(config.data));
  }
  
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // User profile
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/profile', data),

  // Posts
  getPosts: (params) => api.get('/posts', { params }),
  createPost: (data) => api.post('/posts', data),
  getPost: (id) => api.get(`/posts/${id}`),
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  deletePost: (id) => api.delete(`/posts/${id}`),
  likePost: (id) => api.post(`/posts/${id}/like`),
  commentPost: (id, data) => api.post(`/posts/${id}/comment`, data),

  // Patents
  getPatents: (params) => api.get('/patents', { params }),
  createPatent: (data) => api.post('/patents', data),
  getPatent: (id) => api.get(`/patents/${id}`),
  updatePatent: (id, data) => api.put(`/patents/${id}`, data),
  deletePatent: (id) => api.delete(`/patents/${id}`),
  likePatent: (id) => api.post(`/patents/${id}/like`),
  commentPatent: (id, data) => api.post(`/patents/${id}/comment`, data),

  // Resources
  getResources: (params) => api.get('/resources', { params }),
  createResource: (data) => api.post('/resources', data),
  getResource: (id) => api.get(`/resources/${id}`),
  updateResource: (id, data) => api.put(`/resources/${id}`, data),
  deleteResource: (id) => api.delete(`/resources/${id}`),

  // Messages
  getConversations: () => api.get('/messages/conversations'),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  createConversation: (data) => api.post('/messages/conversations', data),
  sendMessage: (conversationId, data) => api.post(`/messages/conversations/${conversationId}`, data),
  markAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
  deleteConversation: (conversationId) => api.delete(`/messages/conversations/${conversationId}`),
  getUnreadCount: () => api.get('/messages/unread-count'),
};

export default api; 