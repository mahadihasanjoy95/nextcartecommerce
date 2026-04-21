import { Routes, Route } from 'react-router-dom'
import ScrollToTop from '@/components/common/ScrollToTop'
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import HomePage from '@/pages/HomePage'
import ProductDetailsPage from '@/pages/ProductDetailsPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ProfilePage from '@/pages/ProfilePage'
import FavouritesPage from '@/pages/FavouritesPage'
import OAuthCallbackPage from '@/pages/OAuthCallbackPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* OAuth2 callback — standalone, no layout wrapper */}
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

        {/* Auth pages — standalone split layout, no Navbar/Footer */}
        <Route element={<AuthLayout />}>
          <Route path="/login"            element={<LoginPage />} />
          <Route path="/signup"           element={<SignupPage />} />
          <Route path="/forgot-password"  element={<ForgotPasswordPage />} />
          <Route path="/reset-password"   element={<ResetPasswordPage />} />
        </Route>

        {/* Main site pages — Navbar + Footer via MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/"               element={<HomePage />} />
          <Route path="/products/:slug" element={<ProductDetailsPage />} />

          {/* Protected pages */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile"    element={<ProfilePage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
