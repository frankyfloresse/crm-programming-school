import { axiosInstance } from "../axiosConfig";

export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  sortBy: string[][];
  searchBy: string[];
  filter: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    previous: string | null;
    current: string;
    next: string | null;
    last: string;
  };
}

export interface OrderManager {
  id: number;
  firstName: string;
  lastName: string;
}

export interface OrderGroup {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  name: string | null;
  surname: string | null;
  email: string | null;
  phone: string | null;
  age: number | null;
  course: string | null;
  course_format: string | null;
  course_type: string | null;
  sum: number | null;
  alreadyPaid: number | null;
  utm: string | null;
  msg: string | null;
  status: string | null;
  groupId: string | null;
  managerId: string | null;
  created_at: string;
  updated_at: string;
  manager: OrderManager | null;
  group: OrderGroup | null;
  comments: unknown[];
}

export const ordersService = {
  getOrders: async (params?: {
    page?: number | string | null;
    limit?: number | null;
    sortBy?: string | null;
    filter?: Record<string, unknown>;
  }): Promise<PaginatedResponse<Order>> => {
    const transformedParams: Record<string, unknown> = {};

    // Adapt paams to nestjs-paginate format

    if (params?.page) transformedParams.page = params.page;
    if (params?.limit) transformedParams.limit = params.limit;
    if (params?.sortBy) transformedParams.sortBy = params.sortBy;

    if (params?.filter) {
      const filter = params.filter;

      // Handle date filtering separately
      if (filter.startDate || filter.endDate) {
        if (filter.startDate && filter.endDate) {
          // If both start and end date are provided, use $btw operator
          transformedParams[
            "filter.created_at"
          ] = `$btw:${filter.startDate},${filter.endDate}`;
        } else if (filter.startDate) {
          // If only start date is provided, use $gte operator
          transformedParams["filter.created_at"] = `$gte:${filter.startDate}`;
        } else if (filter.endDate) {
          // If only end date is provided, use $lte operator
          transformedParams[
            "filter.created_at"
          ] = `$lte:${filter.endDate}T23:59:59.999Z`;
        }
      }

      // Handle other filters
      Object.entries(filter).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== "" &&
          key !== "startDate" &&
          key !== "endDate"
        ) {
          // Text fields should use ILIKE for partial matching
          const textFields = ["name", "surname", "email", "phone"];
          if (textFields.includes(key)) {
            transformedParams[`filter.${key}`] = `$ilike:${value}`;
          } else {
            transformedParams[`filter.${key}`] = value;
          }
        }
      });
    }

    const response = await axiosInstance.get("/orders", {
      params: transformedParams,
    });
    return response.data;
  },

  getOrder: async (id: number): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  createOrder: async (
    data: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<Order> => {
    const response = await axiosInstance.post("/orders", data);
    return response.data;
  },

  updateOrder: async (
    id: number,
    data: Partial<Omit<Order, "id" | "created_at" | "updated_at">>
  ): Promise<Order> => {
    const response = await axiosInstance.patch(`/orders/${id}`, data);
    return response.data;
  },

  deleteOrder: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/orders/${id}`);
  },
};
