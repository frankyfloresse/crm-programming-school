import { axiosInstance } from "../axiosConfig";

export interface CreateManagerDto {
  email: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserStatusDto {
  is_banned?: boolean;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface UserStatistics {
  totalOrders: number;
  byStatus: Array<{
    status: string;
    count: string;
  }>;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "manager";
  is_active: boolean;
  is_banned: boolean;
  createdAt: string;
  updatedAt: string;
  statistics?: UserStatistics;
}

export interface ManagersResponse {
  managers: User[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateManagerResponse {
  message: string;
  activationLink: string;
}

export interface ActivateAccountDto {
  token: string;
  password: string;
}

export interface OverallStatistics {
  stats: Array<{
    status: string;
    count: string;
  }>;
  totalOrders: number;
}

export const managersService = {
  // Create new manager
  async createManager(data: CreateManagerDto): Promise<CreateManagerResponse> {
    const response = await axiosInstance.post("/auth/create-manager", data);
    return response.data;
  },

  // Get all managers with pagination
  async getManagers(
    page: number = 1,
    limit: number = 10
  ): Promise<ManagersResponse> {
    const response = await axiosInstance.get(
      `/auth/managers?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Update user status (ban/unban)
  async updateUserStatus(
    userId: number,
    data: UpdateUserStatusDto
  ): Promise<{ message: string }> {
    const response = await axiosInstance.put(
      `/auth/users/${userId}/status`,
      data
    );
    return response.data;
  },

  // Get manager statistics
  async getManagerStatistics(
    managerId?: number
  ): Promise<
    | {
        managerId?: number;
        stats: Array<{ status: string; count: string }>;
        totalOrders: number;
      }
    | Array<{
        managerId: number;
        firstName: string;
        lastName: string;
        email: string;
        totalOrders: number;
      }>
  > {
    const url = managerId
      ? `/auth/manager-statistics?managerId=${managerId}`
      : "/auth/manager-statistics";
    const response = await axiosInstance.get(url);
    return response.data;
  },

  // Get overall order statistics
  async getOverallStatistics(): Promise<OverallStatistics> {
    const response = await axiosInstance.get("/auth/overall-statistics");
    return response.data;
  },

  // Get password recovery token for user
  async recoveryPassword(userId: number): Promise<{ token: string }> {
    const response = await axiosInstance.post(
      `/auth/recovery-password/${userId}`
    );
    return response.data;
  },
};
