import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersService, type Order } from '../../api/services/orders.service';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchOrders = createAsyncThunk<Order[]>(
  'orders/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersService.getOrders();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrder = createAsyncThunk<Order, number>(
  'orders/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await ordersService.getOrder(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order');
    }
  }
);

export const updateOrder = createAsyncThunk<Order, { id: number; data: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>> }>(
  'orders/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await ordersService.updateOrder(id, data);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update order');
    }
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single order
      .addCase(fetchOrder.fulfilled, (state, action) => {
        const existingIndex = state.orders.findIndex(order => order.id === action.payload.id);
        if (existingIndex >= 0) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      // Update order
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index >= 0) {
          state.orders[index] = action.payload;
        }
      })
  },
});

export const { clearError } = ordersSlice.actions;
export default ordersSlice.reducer;