import { Routes, Route, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import AdminLoginPage from "./pages/admin/AdminLoginPage"
import AdminDashboardPage from "./pages/admin/AdminDashboardPage"
import AdminUserEditPage from "./pages/admin/AdminUserEditPage"
import NotFoundPage from "./pages/NotFoundPage"

// Protected route component for user routes
const ProtectedRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)

  if (!userInfo) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />
  }

  return children
}

// Protected route component for admin routes
const AdminRoute = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth)
 
  if (!userInfo || userInfo.role !== "admin") {
    // Redirect to admin login if not authenticated as admin
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected user routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users/:id/edit"
        element={
          <AdminRoute>
            <AdminUserEditPage />
          </AdminRoute>
        }
      />

      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App

