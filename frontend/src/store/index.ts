import { configureStore, combineReducers, createAction, type UnknownAction } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import ordersReducer from './orders/ordersSlice';

export const clearStore = createAction('store/clear');

const appReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: UnknownAction) => {
  if (clearStore.match(action)) {
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;