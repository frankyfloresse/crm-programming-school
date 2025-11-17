import { axiosInstance } from '../axiosConfig';

export interface Comment {
  id: number;
  message: string;
  userId: number;
  orderId: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateCommentDto {
  message: string;
  orderId: number;
}

export const commentsService = {
  createComment: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await axiosInstance.post('/comments', data);
    return response.data;
  },

  getCommentsByOrderId: async (orderId: number): Promise<Comment[]> => {
    const response = await axiosInstance.get(`/comments/order/${orderId}`);
    return response.data;
  },
};