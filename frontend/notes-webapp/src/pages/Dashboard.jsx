import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NotesBoard from '../components/NotesBoard'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState('board') // 'board' или 'list'
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      navigate('/auth')
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error('Error parsing user data:', error)
      navigate('/auth')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth')
  }

  if (!user) {
    return (
      <div style={loadingStyle}>
        <div style={spinnerStyle}></div>
        <p style={loadingTextStyle}>Загрузка...</p>
      </div>
    )
  }

  return (
    <div style={dashboardStyle}>
      {/* Header */}
      <header style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={logoStyle}>
            <h1 style={titleStyle}>📝 NotesApp</h1>
            <span style={subtitleStyle}>Умные заметки с связями</span>
          </div>
          
          <div style={userInfoStyle}>
            <div style={userTextStyle}>
              <p style={usernameStyle}>{user.username}</p>
              <p style={emailStyle}>{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              style={logoutButtonStyle}
            >
              Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div style={tabsStyle}>
        <button
          onClick={() => setActiveTab('board')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'board' ? activeTabStyle : {})
          }}
        >
          🎯 Доска связей
        </button>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            ...tabButtonStyle,
            ...(activeTab === 'list' ? activeTabStyle : {})
          }}
        >
          📋 Список заметок
        </button>
      </div>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* Welcome Section */}
        <div style={welcomeSectionStyle}>
          <h2 style={welcomeTitleStyle}>
            Добро пожаловать, {user.username}! 👋
          </h2>
          <p style={welcomeTextStyle}>
            Создавайте заметки, устанавливайте связи и организуйте свои идеи в визуальной доске.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle('#3b82f6')}>📄</div>
            <div>
              <p style={statLabelStyle}>Всего заметок</p>
              <p style={statValueStyle}>4</p>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#10b981')}>🔗</div>
            <div>
              <p style={statLabelStyle}>Связей</p>
              <p style={statValueStyle}>3</p>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#8b5cf6')}>📁</div>
            <div>
              <p style={statLabelStyle}>Папки</p>
              <p style={statValueStyle}>0</p>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#f59e0b')}>👥</div>
            <div>
              <p style={statLabelStyle}>Общий доступ</p>
              <p style={statValueStyle}>0</p>
            </div>
          </div>
        </div>

        {/* Notes Board - ВИЗУАЛЬНАЯ ДОСКА СО СТИКЕРАМИ */}
        {activeTab === 'board' && (
          <div style={boardContainerStyle}>
            <div style={boardHeaderStyle}>
              <h3 style={boardTitleStyle}>🎯 Доска идей и связей</h3>
              <p style={boardDescriptionStyle}>
                Перетаскивайте стикеры, соединяйте их красными нитками для создания связей между идеями
              </p>
            </div>
            
            {/* Вот здесь используется наш компонент NotesBoard */}
            <NotesBoard />
          </div>
        )}

        {/* List View (заглушка) */}
        {activeTab === 'list' && (
          <div style={listContainerStyle}>
            <h3 style={boardTitleStyle}>📋 Список всех заметок</h3>
            <div style={placeholderStyle}>
              <span style={placeholderIconStyle}>📝</span>
              <p style={placeholderTextStyle}>Режим списка в разработке</p>
              <p style={placeholderSubtextStyle}>Пока используйте визуальную доску для работы с заметками</p>
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div style={tipsStyle}>
          <h4 style={tipsTitleStyle}>💡 Советы по использованию доски:</h4>
          <ul style={tipsListStyle}>
            <li><strong>Добавьте стикер</strong> - нажмите кнопку "Добавить стикер"</li>
            <li><strong>Создайте связь</strong> - перетащите от одного стикера к другому</li>
            <li><strong>Перемещайте стикеры</strong> - drag & drop для удобного расположения</li>
            <li><strong>Красные нитки</strong> - показывают связи между связанными идеями</li>
            <li><strong>Мини-карта</strong> - в правом нижнем углу для навигации по большой доске</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

// Стили (добавьте их в конец файла)
const dashboardStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
}

const loadingStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}

const spinnerStyle = {
  width: '48px',
  height: '48px',
  border: '4px solid #e2e8f0',
  borderTop: '4px solid #3b82f6',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
}

const loadingTextStyle = {
  marginTop: '16px',
  color: '#6b7280',
  fontSize: '16px',
}

const headerStyle = {
  background: 'white',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  borderBottom: '1px solid #e2e8f0',
}

const headerContentStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '70px',
}

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
}

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#3b82f6',
  margin: 0,
}

const subtitleStyle = {
  fontSize: '14px',
  color: '#6b7280',
  background: '#f3f4f6',
  padding: '4px 8px',
  borderRadius: '6px',
}

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const userTextStyle = {
  textAlign: 'right',
}

const usernameStyle = {
  margin: 0,
  fontSize: '14px',
  fontWeight: '600',
  color: '#1f2937',
}

const emailStyle = {
  margin: 0,
  fontSize: '12px',
  color: '#6b7280',
}

const logoutButtonStyle = {
  background: '#ef4444',
  color: 'white',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'background 0.2s',
}

const tabsStyle = {
  maxWidth: '1200px',
  margin: '20px auto',
  padding: '0 20px',
  display: 'flex',
  gap: '8px',
}

const tabButtonStyle = {
  background: 'white',
  border: '1px solid #e2e8f0',
  padding: '12px 24px',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'all 0.2s',
}

const activeTabStyle = {
  background: '#3b82f6',
  color: 'white',
  borderColor: '#3b82f6',
}

const mainStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px 40px',
}

const welcomeSectionStyle = {
  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  color: 'white',
  padding: '32px',
  borderRadius: '12px',
  marginBottom: '24px',
  textAlign: 'center',
}

const welcomeTitleStyle = {
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const welcomeTextStyle = {
  fontSize: '16px',
  margin: 0,
  opacity: 0.9,
}

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '16px',
  marginBottom: '24px',
}

const statCardStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
}

const statIconStyle = (color) => ({
  background: color,
  color: 'white',
  width: '48px',
  height: '48px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
})

const statLabelStyle = {
  margin: '0 0 4px 0',
  fontSize: '14px',
  color: '#6b7280',
}

const statValueStyle = {
  margin: 0,
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#1f2937',
}

const boardContainerStyle = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  marginBottom: '24px',
  overflow: 'hidden',
}

const boardHeaderStyle = {
  padding: '24px',
  borderBottom: '1px solid #e2e8f0',
}

const boardTitleStyle = {
  margin: '0 0 8px 0',
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1f2937',
}

const boardDescriptionStyle = {
  margin: 0,
  fontSize: '14px',
  color: '#6b7280',
}

const listContainerStyle = {
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  padding: '40px',
  textAlign: 'center',
}

const placeholderStyle = {
  padding: '40px',
}

const placeholderIconStyle = {
  fontSize: '48px',
  marginBottom: '16px',
  display: 'block',
}

const placeholderTextStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#1f2937',
  margin: '0 0 8px 0',
}

const placeholderSubtextStyle = {
  fontSize: '14px',
  color: '#6b7280',
  margin: 0,
}

const tipsStyle = {
  background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '20px',
}

const tipsTitleStyle = {
  margin: '0 0 12px 0',
  fontSize: '16px',
  fontWeight: '600',
  color: '#92400e',
}

const tipsListStyle = {
  margin: 0,
  paddingLeft: '20px',
  color: '#78350f',
  fontSize: '14px',
  lineHeight: '1.6',
}

// Добавляем CSS анимацию
const style = document.createElement('style')
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)

export default Dashboard