import api, { handleRequest } from './api';
import { Comment, ApiResponse } from '../types';

interface CreateCommentData {
  content: string;
  entityType: string;
  entityId: number;
  mentionedUserId?: number;
}

// Comment Services
const commentService = {
  // Create a comment
  createComment: (data: CreateCommentData): Promise<ApiResponse<Comment>> => {
    return handleRequest<Comment>(api.post('/comments', data));
  },

  // Get comments by entity
  getCommentsByEntity: (entityType: string, entityId: number): Promise<ApiResponse<Comment[]>> => {
    return handleRequest<Comment[]>(api.get(`/comments?entityType=${entityType}&entityId=${entityId}`));
  },

  // Update comment
  updateComment: (id: number, data: Partial<CreateCommentData>): Promise<ApiResponse<Comment>> => {
    return handleRequest<Comment>(api.put(`/comments/${id}`, data));
  }
};

export default commentService;