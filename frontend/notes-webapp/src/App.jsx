import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  return (
    <div >
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Добавим fallback route */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  )
}

export default App