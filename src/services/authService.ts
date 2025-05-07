import api, { handleRequest } from './api';
import { User, ApiResponse } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

// Auth Services
const authService = {
  // Register a new user
  register: (data: RegisterData): Promise<ApiResponse<any>> => {
    return handleRequest<ApiResponse<any>>(api.post('/user', data));
  },

  // Login user
  login: (credentials: LoginCredentials): Promise<ApiResponse<any>> => {
    return handleRequest<ApiResponse<any>>(api.post('/auth/login', credentials));
  },  

  // Logout user
  logout: (): Promise<ApiResponse<null>> => {
    return handleRequest<null>(api.post('/auth/logout'));
  },

  // Get user by id
  getUserById: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get(`/user/${id}`));
  },

  // Get current user
  getCurrentUser: (): Promise<ApiResponse<any>> => {
    return handleRequest<User>(api.get(`/user/me`));
  },

  // Change user password
  changePassword: (data: ChangePasswordData): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/user/change-password', data));
  },

  // Get all users
  getAllUsers: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/user'));
  },

  // Update user
  updateUser: (id: number, data: Partial<User>): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/user/${id}`, data));
  },

  // Delete user
  deleteUser: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.delete(`/user/${id}`));
  }
};

export default authService;