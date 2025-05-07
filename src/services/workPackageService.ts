import api, { handleRequest } from './api';
import { WorkPackage, ApiResponse } from '../types';

// Work Package Services
const workPackageService = {
  // Create a work package
  createWorkPackage: (data: Partial<WorkPackage>): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/work-package', data));
  },

  // Get all work packages
  getAllWorkPackages: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/work-package'));
  },

  // Get work package by ID
  getWorkPackageById: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get(`/work-package/${id}`));
  },

  // Update work package
  updateWorkPackage: (id: number, data: Partial<WorkPackage>): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/work-package/${id}`, data));
  },

  // Delete work package
  deleteWorkPackage: (id: number): Promise<ApiResponse<null>> => {
    return handleRequest<any>(api.delete(`/work-package/${id}`));
  },

  // Get project work packages
  getProjectWorkPackages: (projectId: number): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/work-package/${projectId}/project`));
  },

  getProjectWorkPackagesAll: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/work-package/all`));
  },

  // Get user work packages
  getUserWorkPackages: (userId: number): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/work-package/${userId}/user`));
  },

  // Get dashboard data
  getDashboardData: (projectId: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get(`/work-package/dashboard/${projectId}`));
  }
};

export default workPackageService;