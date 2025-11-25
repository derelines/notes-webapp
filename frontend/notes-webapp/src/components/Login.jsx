import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthForm from './AuthForm'
import { useLoginMutation } from '../api/apiSlice'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      // Временно используем моковые данные для тестирования
      const mockResponse = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 1,
          email: email,
          username: email.split('@')[0],
          role: 'user'
        }
      }
      
      // Сохраняем токен
      localStorage.setItem('token', mockResponse.token)
      localStorage.setItem('user', JSON.stringify(mockResponse.user))
      
      console.log('Успешный вход:', mockResponse)
      
      // Перенаправляем в дашборд
      navigate('/dashboard')
    } catch (err) {
      setError(err.data?.message || 'Ошибка при входе')
      console.error('Login error:', err)
    }
  }

  return (
    <AuthForm onSubmit={handleSubmit} isLoading={isLoading}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
          placeholder="Ваш пароль"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
            Запомнить меня
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Забыли пароль?
          </a>
        </div>
      </div>
    </AuthForm>
  )
}

export default Login