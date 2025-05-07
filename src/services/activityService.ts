import api, { handleRequest } from './api';
import {  ApiResponse } from '../types';

// Activity Services
const activityService = {
  // Get all activity logs
  getAllActivityLogs: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/logs/all'));
  },

  getActivityLogsPaginated: (
    page = 0,
    size = 5
  ): Promise<ApiResponse<{ content: any[]; totalPages: number; number: number }>> => {
    return handleRequest(api.get(`/logs/all?page=${page}&size=${size}`));
  },

  // Get activity logs by entity
  getActivityLogsByEntity: (entityId: number, entityType: string): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/logs/all?entityId=${entityId}&entityType=${entityType}`));
  }
};

export default activityService;