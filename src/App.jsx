import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import LoginPage from './pages/LoginSignUp'
import OtpVerification from './pages/Otp'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import CategoryProducts from './pages/CategoryProducts'
import WishlistPage from './pages/WishlistPage'
import OrdersPage from './pages/OrdersPage'
import AccountPage from './pages/AccountPage'
import AddressesPage from './pages/AddressesPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/otp' element={<OtpVerification/>} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/sub-category/:name/:id" element={<CategoryProducts />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/addresses" element={<AddressesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App