import api, { handleRequest } from './api';
import { ApiResponse } from '../types';

const roadmapService = {
  getRoadmap: (): Promise<ApiResponse<any>> => {
    return handleRequest<any>(api.get('/work-package/roadmap'));
  }
};

export default roadmapService;