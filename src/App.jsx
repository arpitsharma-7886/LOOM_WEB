import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './components/Header'
import MainTemplate from './components/MainTemplate'
import Home from './pages/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginSignUp'
import OtpVerification from './pages/Otp'
import ProductDetails from './pages/ProductDetails'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import CategoryProducts from './pages/CategoryProducts'
import WishlistPage from './pages/WishlistPage'
import { Toaster } from 'react-hot-toast'

function App() {

  
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/otp' element={<OtpVerification/>} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/sub-category/:name/:id" element={<CategoryProducts />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App