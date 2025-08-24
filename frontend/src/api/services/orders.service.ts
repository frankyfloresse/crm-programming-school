import { axiosInstance } from '../axiosConfig';

export interface Order {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  age: number;
  course: string;
  course_format: string;
  course_type: string;
  sum: number | null;
  alreadyPaid: number | null;
  utm: string;
  msg: string;
  status: string | null;
  groupId: string | null;
  managerId: string | null;
  created_at: string;
  updated_at: string;
  manager: any;
  group: any;
  comments: any[];
}

export const ordersService = {
  getOrders: async (): Promise<Order[]> => {
    const response = await axiosInstance.get('/orders');
    return response.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const response = await axiosInstance.post('/orders', data);
    return response.data;
  },

  updateOrder: async (id: number, data: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Order> => {
    const response = await axiosInstance.patch(`/orders/${id}`, data);
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/orders/${id}`);
  },
};