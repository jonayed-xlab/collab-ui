import api, { handleRequest } from './api';
import { ApiResponse } from '../types';

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string | null;
  email: string | null;
  role: string | null;
  active: boolean;
}

// User Services
const userService = {
  // Get all users
  getAllUsers: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/user'));
  },
  
  // Update user role and status
  updateUser: (userId: number, data: { role: string; active: boolean }): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/user/${userId}`, data));
  },
  
  // Add a new user (if needed)
  addUser: (userData: any): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/user', userData));
  },

  deleteUser: (userId: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.delete(`/user/${userId}`));
  }
};

export default userService;