import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import ordersReducer from './orders/ordersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;