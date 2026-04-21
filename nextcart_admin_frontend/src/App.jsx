import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout          from '@/components/layout/AdminLayout'
import ProtectedRoute       from '@/components/common/ProtectedRoute'
import LoginPage            from '@/pages/LoginPage'
import ProductsPage         from '@/pages/ProductsPage'
import ProductCreatePage    from '@/pages/ProductCreatePage'
import CategoriesPage       from '@/pages/CategoriesPage'
import BrandsPage           from '@/pages/BrandsPage'
import UsersPage            from '@/pages/UsersPage'
import CustomersPage        from '@/pages/CustomersPage'
import RolesPage            from '@/pages/RolesPage'
import ApiMapsPage          from '@/pages/ApiMapsPage'
import ProfilePage          from '@/pages/ProfilePage'
import ForgotPasswordPage   from '@/pages/ForgotPasswordPage'
import ResetPasswordPage    from '@/pages/ResetPasswordPage'

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />

      {/* Protected — all admin pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products"     element={<ProductsPage />} />
          <Route path="/products/new" element={<ProductCreatePage />} />
          <Route path="/products/:productId/edit" element={<ProductCreatePage />} />
          <Route path="/categories"   element={<CategoriesPage />} />
          <Route path="/brands"       element={<BrandsPage />} />
          <Route path="/users"        element={<Navigate to="/admins" replace />} />
          <Route path="/admins"       element={<UsersPage />} />
          <Route path="/customers"    element={<CustomersPage />} />
          <Route path="/roles"        element={<RolesPage />} />
          <Route path="/api-maps"     element={<ApiMapsPage />} />
          <Route path="/profile"      element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
