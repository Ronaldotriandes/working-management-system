import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from './features/authSlice';
import userReducer from './features/userSlice';
import workOrderReducer from './features/workOrderSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'users', 'workOrders']
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    workOrders: workOrderReducer,
    users: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;