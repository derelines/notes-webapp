import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../api/api'

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('') // Очищаем ошибку при изменении поля
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Валидация
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('Пароли не совпадают')
      }

      if (formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов')
      }

      let response

      if (isLogin) {
        // Логин
        response = await authAPI.login({
          email: formData.email,
          password: formData.password
        })
      } else {
        // Регистрация
        response = await authAPI.register({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      }

      // Сохраняем токен и данные пользователя
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      console.log('Успешная авторизация!', response)
      navigate('/dashboard')
      
    } catch (err) {
      console.error('Ошибка авторизации:', err)
      setError(err.response?.data?.message || err.message || 'Произошла ошибка')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '28px'
        }}>
          📝 NotesApp
        </h1>

        {/* Toggle Buttons */}
        <div style={{
          display: 'flex',
          marginBottom: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: isLogin ? 'white' : 'transparent',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: isLogin ? '#667eea' : '#666',
              cursor: 'pointer',
              boxShadow: isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: !isLogin ? 'white' : 'transparent',
              borderRadius: '6px',
              fontWeight: 'bold',
              color: !isLogin ? '#667eea' : '#666',
              cursor: 'pointer',
              boxShadow: !isLogin ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Регистрация
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 style={{
            textAlign: 'center',
            marginBottom: '20px',
            color: '#333'
          }}>
            {isLogin ? 'Вход в аккаунт' : 'Создание аккаунта'}
          </h2>

          {!isLogin && (
            <div style={{ marginBottom: '15px' }}>
              <input
                name="username"
                type="text"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <input
              name="password"
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '16px'
              }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: '20px' }}>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '16px'
                }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              background: isLoading ? '#9ca3af' : '#667eea',
              color: 'white',
              padding: '12px',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#666' }}>
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#667eea',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {isLogin ? 'Создать аккаунт' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default AuthPage