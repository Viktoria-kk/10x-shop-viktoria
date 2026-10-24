import { Route, Routes } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import CartPage from '../pages/CartPage'
import CatalogPage from '../pages/CatalogPage'
import CheckoutPage from '../pages/CheckoutPage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProductPage from '../pages/ProductPage'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<CatalogPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="products/:id" element={<ProductPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
