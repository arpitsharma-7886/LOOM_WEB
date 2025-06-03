import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Home from './pages/Home';
import LoginSignUp from './pages/LoginSignUp';
import Otp from './pages/Otp';
import Register from './pages/Register';
import Account from './pages/Account';
import ProductDetails from './pages/ProductDetails';
// import Products from './pages/Products';
// import About from './pages/About';
// import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import CategoryProducts from './pages/CategoryProducts'
import OrderSuccessPage from './pages/OrderSuccessPage'
import WishlistPage from './pages/WishlistPage'
import useAuth from './store/useAuth';
import Cart from './pages/Cart';
import PaymentPage from './pages/PaymentPage';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import SearchResults from './pages/SearchResults';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
};

function App() {
  const { initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Toaster position="top-center" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        } />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/checkout/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/sub-category/:name/:id" element={<CategoryProducts />} />
        <Route path="/order-success" element={
          <ProtectedRoute>
            <OrderSuccessPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          // <ProtectedRoute>
            <PaymentPage />
          // </ProtectedRoute>
        } />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </Router>
  );
}

export default App;