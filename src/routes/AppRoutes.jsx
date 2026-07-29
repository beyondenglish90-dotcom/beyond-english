import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import HomePage from '../pages/HomePage'
import AboutPage from '../pages/AboutPage'
import CurriculumPage from '../pages/CurriculumPage'
import PricingPage from '../pages/PricingPage'
import ResourcesPage from '../pages/ResourcesPage'
import NoticesPage from '../pages/NoticesPage'
import NoticeDetailPage from '../pages/NoticeDetailPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import MyPage from '../pages/MyPage'
import AdminPage from '../pages/AdminPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/curriculum" element={<CurriculumPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/resources" element={<ResourcesPage />} />
      <Route path="/notices" element={<NoticesPage />} />
      <Route path="/notices/:id" element={<NoticeDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
