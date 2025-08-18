import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './store/slices/authSlice';
import { fetchProducts } from './store/slices/productSlice';
import { fetchConversations } from './store/slices/chatSlice';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import CreateProduct from './pages/CreateProduct';
import EditProduct from './pages/EditProduct';
import MyProducts from './pages/MyProducts';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Products from './pages/Products'; // Import the Products component
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on app load
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    // Fetch products and conversations if authenticated
    if (isAuthenticated) {
      dispatch(fetchProducts({}));
      dispatch(fetchConversations());
    }
  }, [isAuthenticated, dispatch]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} /> {/* Add the Products route */}
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/" /> : <Register />} 
          />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route 
            path="/create-product" 
            element={isAuthenticated ? <CreateProduct /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/edit-product/:id" 
            element={isAuthenticated ? <EditProduct /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/my-products" 
            element={isAuthenticated ? <MyProducts /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat" 
            element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;