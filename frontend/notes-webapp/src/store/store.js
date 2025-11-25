import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from '../api/apiSlice'

export const store = configureStore({
  reducer: {
    // Добавляем API slice в store
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  
  // Добавляем middleware API
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})