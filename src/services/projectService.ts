import api, { handleRequest } from './api';
import { Project, ApiResponse } from '../types';

interface CreateProjectData {
  name: string;
  description: string;
}

interface AssignProjectData {
  projectId: number;
  userId: number;
}

// Project Services
const projectService = {
  // Create a project
  createProject: (data: CreateProjectData): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/project', data));
  },

  // Get all projects
  getAllProjects: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/project'));
  },

  getProjectAssignments: (projectId: number): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/project/${projectId}/assign`));
  },

  // Get project by ID
  getProjectById: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get(`/project/${id}`));
  },

  // Update project
  updateProject: (id: number, data: Partial<Project>): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/project/${id}`, data));
  },

  // Delete project
  deleteProject: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.delete(`/project/${id}`));
  },

  updateAssignment: (projectId: number, userId: any): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/project/${projectId}/assign/${userId}`));
  },

  deleteAssignment:  (userId: number, projectId:number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.delete(`/project/${projectId}/assign/${userId}`));
  },

  getAllAssignments: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get('/project/assign'));
  },

  // Assign project to user
  assignProject: (data: AssignProjectData): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/project/assign', data));
  },

  // Get user projects
  getUserProjects: (userId: number): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/project/user/${userId}`));
  }
};

export default projectService;