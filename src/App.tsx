import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from './pages/HomePage'
import { StudentLoginPage } from './pages/StudentLoginPage'
import { TeacherLoginPage } from './pages/TeacherLoginPage'
import { WorldDetailsPage } from './pages/WorldDetailsPage'
import { TeacherDashboardPage } from './pages/TeacherDashboardPage'
import { StudentReportPage } from './pages/StudentReportPage'
import { StudentHubPage } from './pages/StudentHubPage'
import { AdventureMapPage } from './pages/AdventureMapPage'
import { LevelPlayerPage } from './pages/LevelPlayerPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<Navigate to="/login/student" replace />} />
          <Route path="login/student" element={<StudentLoginPage />} />
          <Route path="login/teacher" element={<TeacherLoginPage />} />
          <Route path="worlds/:worldId" element={<WorldDetailsPage />} />

          {/* Protected Educator Routes */}
          <Route
            path="teacher/dashboard"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <TeacherDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="teacher/students/:studentId"
            element={
              <ProtectedRoute allowedRoles={['teacher', 'admin']}>
                <StudentReportPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Student Routes */}
          <Route
            path="student/hub"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <StudentHubPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/map"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <AdventureMapPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/play/:worldId/:levelNumber"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <LevelPlayerPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
