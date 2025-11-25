import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Создаем экземпляр axios с базовыми настройками
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерцептор для автоматической подстановки токена
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// API функции
export const authAPI = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Логин
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  // Получение профиля
  getProfile: async () => {
    const response = await api.get('/auth/profile')
    return response.data
  }
}

export default api