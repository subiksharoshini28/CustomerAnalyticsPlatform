import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layout
import MainLayout from './components/Layout/MainLayout';
import AuthLayout from './components/Layout/AuthLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Dashboard Pages
import Dashboard from './pages/Dashboard/Dashboard';

// Shopping Pages
import ProductList from './pages/Shopping/ProductList';
import ProductDetail from './pages/Shopping/ProductDetail';
import Cart from './pages/Shopping/Cart';
import Checkout from './pages/Shopping/Checkout';
import OrderConfirmation from './pages/Shopping/OrderConfirmation';
import Wishlist from './pages/Shopping/Wishlist';

// Customer Pages
import Profile from './pages/Customer/Profile';
import OrderHistory from './pages/Customer/OrderHistory';

// Analytics Pages
import CustomerJourney from './pages/Analytics/CustomerJourney';
import ChurnPrediction from './pages/Analytics/ChurnPrediction';
import Recommendations from './pages/Analytics/Recommendations';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Shopping Routes */}
                <Route path="products" element={<ProductList />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:orderNumber" element={<OrderConfirmation />} />
                <Route path="wishlist" element={<Wishlist />} />
                
                {/* Customer Routes */}
                <Route path="profile" element={<Profile />} />
                <Route path="orders" element={<OrderHistory />} />
                
                {/* Analytics Routes */}
                <Route path="analytics/journey" element={<CustomerJourney />} />
                <Route path="analytics/churn" element={<ChurnPrediction />} />
                <Route path="analytics/recommendations" element={<Recommendations />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
