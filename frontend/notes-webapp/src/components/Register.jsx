import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from './AuthForm'
import { useRegisterMutation } from '../api/apiSlice'

function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    try {
      // Временно используем моковые данные для тестирования
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: Date.now(),
          email: formData.email,
          username: formData.username,
          role: 'user'
        }
      }
      
      // Сохраняем токен
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      
      console.log('Успешная регистрация:', mockResponse)
      
      // Перенаправляем в дашборд
      navigate('/dashboard')
    } catch (err) {
      setError(err.data?.message || 'Ошибка при регистрации')
      console.error('Register error:', err)
    }
  }

  return (
    <AuthForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading}
      submitText="Зарегистрироваться"
    >
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Имя пользователя
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={formData.username}
          onChange={handleChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Ваше имя"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Минимум 6 символов"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleChange}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Повторите пароль"
        />
      </div>

      <div className="text-xs text-gray-500">
        Регистрируясь, вы соглашаетесь с нашими Условиями использования и Политикой конфиденциальности.
      </div>
    </AuthForm>
  )
}

export default Register