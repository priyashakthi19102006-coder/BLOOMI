import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'
import { StudentLoginPage } from './pages/StudentLoginPage'
import { TeacherLoginPage } from './pages/TeacherLoginPage'
import { WorldDetailsPage } from './pages/WorldDetailsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login/student" element={<StudentLoginPage />} />
        <Route path="login/teacher" element={<TeacherLoginPage />} />
        <Route path="worlds/:worldId" element={<WorldDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
