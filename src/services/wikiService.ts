import api, { handleRequest } from './api';
import { WikiPage, ApiResponse } from '../types';


const wikiService = {
  // Create a wiki page
  createWikiPage: (data: WikiPage): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.post('/wikis', data));
  },

  // Get all wiki pages
  getAllWikiPages: (): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/wikis`));
  },

  // Get wiki page by ID
  getWikiPageById: (id: number): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get(`/wikis/${id}`));
  },

  // Update wiki page
  updateWikiPage: (id: number, data: Partial<any>): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.put(`/wikis/${id}`, data));
  },

  // Delete wiki page
  deleteWikiPage: (id: number): Promise<ApiResponse<null>> => {
    return handleRequest<null>(api.delete(`/wikis/${id}`));
  },

  // Get wiki page history
  getWikiPageHistory: (id: number): Promise<ApiResponse<any[]>> => {
    return handleRequest<any[]>(api.get(`/wikis/${id}/history`));
  }
};

export default wikiService;