import axios from 'axios';
import { ApiResponse } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3300/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration here if needed
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Handle authentication error (e.g., redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Generic request handler
const handleRequest = async <T>(request: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const response = await request;
    const { statusCode, message, data } = response.data;

    return {
      statusCode,
      message,
      data,
    };
  } catch (error: any) {
    return {
      statusCode: error?.response?.data?.statusCode || "E500",
      message: error?.response?.data?.message || error?.message || "An error occurred",
    };
  }
};


export default api;
export { handleRequest };