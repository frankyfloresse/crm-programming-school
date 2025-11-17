import { axiosInstance } from '../axiosConfig';

export interface Group {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGroupDto {
  name: string;
}

export const groupsService = {
  getAllGroups: async (): Promise<Group[]> => {
    const response = await axiosInstance.get('/groups');
    return response.data;
  },

  createGroup: async (data: CreateGroupDto): Promise<Group> => {
    const response = await axiosInstance.post('/groups', data);
    return response.data;
  },
};