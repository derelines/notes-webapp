import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Базовый API slice - основа для всех запросов к бэкенду
export const apiSlice = createApi({
  // Уникальный ключ для этого API
  reducerPath: 'api',
  
  // Базовые настройки для всех запросов
  baseQuery: fetchBaseQuery({
    // Базовый URL вашего бэкенда
    baseUrl: 'http://localhost:5000/api',
    
    // Функция для подготовки заголовков
    prepareHeaders: (headers, { getState }) => {
      // Получаем токен из localStorage (или из state)
      const token = localStorage.getItem('token')
      
      // Если токен есть, добавляем его в заголовки
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      
      headers.set('content-type', 'application/json')
      return headers
    }
  }),
  
  // Теги для кэширования (важно для инвалидации кэша)
  tagTypes: ['User', 'Note', 'Folder', 'Complaint'],
  
  // endpoints будут добавлены ниже через injectEndpoints
  endpoints: builder => ({})
})

// Расширяем базовый API slice конкретными endpoints
export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
      
      // 🔐 АУТЕНТИФИКАЦИЯ
      // Регистрация пользователя
      register: builder.mutation({
        query: (userData) => ({
          url: '/auth/register',
          method: 'POST',
          body: userData
        }),
        invalidatesTags: ['User']
      }),
      
      // Логин пользователя
      login: builder.mutation({
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials
        }),
        invalidatesTags: ['User']
      }),
      
      // Получение профиля пользователя
      getProfile: builder.query({
        query: () => '/auth/profile',
        providesTags: ['User']
      }),
      
      // 📝 ЗАМЕТКИ
      // Получить все заметки пользователя
      getNotes: builder.query({
        query: () => '/notes',
        providesTags: (result = [], error, arg) => [
          'Note',
          ...result.map(({ id }) => ({ type: 'Note', id }))
        ]
      }),
      
      // Получить одну заметку по ID
      getNote: builder.query({
        query: (noteId) => `/notes/${noteId}`,
        providesTags: (result, error, arg) => [{ type: 'Note', id: arg }]
      }),
      
      // Создать новую заметку
      createNote: builder.mutation({
        query: (noteData) => ({
          url: '/notes',
          method: 'POST',
          body: noteData
        }),
        invalidatesTags: ['Note']
      }),
      
      // Обновить заметку
      updateNote: builder.mutation({
        query: ({ id, ...updates }) => ({
          url: `/notes/${id}`,
          method: 'PUT',
          body: updates
        }),
        invalidatesTags: (result, error, arg) => [{ type: 'Note', id: arg.id }]
      }),
      
      // Удалить заметку
      deleteNote: builder.mutation({
        query: (noteId) => ({
          url: `/notes/${noteId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['Note']
      }),
      
      // 📁 ПАПКИ
      // Получить все папки
      getFolders: builder.query({
        query: () => '/folders',
        providesTags: ['Folder']
      }),
      
      // Создать папку
      createFolder: builder.mutation({
        query: (folderData) => ({
          url: '/folders',
          method: 'POST',
          body: folderData
        }),
        invalidatesTags: ['Folder']
      }),
      
      // 🔍 ПОИСК
      // Поиск по заметкам
      searchNotes: builder.query({
        query: (searchTerm) => `/search?q=${encodeURIComponent(searchTerm)}`,
        providesTags: ['Note']
      }),
      
      // ⚠️ ЖАЛОБЫ
      // Подать жалобу
      createComplaint: builder.mutation({
        query: (complaintData) => ({
          url: '/complaints',
          method: 'POST',
          body: complaintData
        }),
        invalidatesTags: ['Complaint']
      }),
      
      // 👑 АДМИН ФУНКЦИИ
      // Получить все жалобы (для админа)
      getComplaints: builder.query({
        query: () => '/admin/complaints',
        providesTags: ['Complaint']
      }),
      
      // Установить лимиты хранения
      setStorageLimit: builder.mutation({
        query: ({ userId, limit }) => ({
          url: `/admin/users/${userId}/storage-limit`,
          method: 'PUT',
          body: { limit }
        }),
        invalidatesTags: ['User']
      })
    })
  })
  
  // Экспортируем автоматически сгенерированные хуки
  export const {
    // Аутентификация
    useRegisterMutation,
    useLoginMutation,
    useGetProfileQuery,
    
    // Заметки
    useGetNotesQuery,
    useGetNoteQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation,
    
    // Папки
    useGetFoldersQuery,
    useCreateFolderMutation,
    
    // Поиск
    useSearchNotesQuery,
    
    // Жалобы
    useCreateComplaintMutation,
    useGetComplaintsQuery,
    
    // Админ
    useSetStorageLimitMutation,
  } = extendedApiSlice