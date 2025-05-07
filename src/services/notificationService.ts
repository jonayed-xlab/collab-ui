import api, { handleRequest } from './api';
import { Notification, ApiResponse } from '../types';

// Notification Services
const notificationService = {
  // Get all notifications for a user
  getAllNotifications: (userId: number): Promise<ApiResponse<Notification[]>> => {
    return handleRequest<Notification[]>(api.get(`/notification/all?userId=${userId}`));
  },

  // Get unread notifications for a user
  getUnreadNotifications: (userId: number): Promise<ApiResponse<Notification[]>> => {
    return handleRequest<Notification[]>(api.get(`/notification/unread?userId=${userId}`));
  }
};

export default notificationService;