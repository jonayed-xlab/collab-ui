import api, { handleRequest } from './api';
import { Notification, ApiResponse } from '../types';

const notificationService = {
  getAllNotifications: (userId: number): Promise<ApiResponse<Notification[]>> => {
    return handleRequest<Notification[]>(api.get(`/notification/all?userId=${userId}`));
  },

  getUnreadNotifications: (userId: number): Promise<ApiResponse<Notification[]>> => {
    return handleRequest<Notification[]>(api.get(`/notification/unread?userId=${userId}`));
  },

  markAsRead: (id: number): Promise<ApiResponse<void>> => {
    return handleRequest<void>(api.put(`/notification/${id}/read`));
  }
};

export default notificationService;