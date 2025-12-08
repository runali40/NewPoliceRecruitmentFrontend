import React, { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter as Router, Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { apiClient } from "./apiClient.js";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

// Import your components
import Sidebar from "./Components/Dashboard/Sidebar";
import Login from "./Pages/Login/Login";
import Loading from "./Components/Utils/Loading";

// Secure Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = Cookies.get("UserCredential");

  if (!token) {
    sessionStorage.removeItem('intendedPath');
    sessionStorage.setItem('intendedPath', location.pathname);
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication on mount and route changes
  useEffect(() => {
    const token = Cookies.get("UserCredential");
    setIsAuthenticated(!!token);

    // Only redirect if not already on login page
    if (!token && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    apiClient.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    apiClient.interceptors.response.use(
      (config) => {
        setLoading(false);
        return config;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      }
    );
  }, []);
  // Handle authentication state changes
  const handleLogin = () => {
    setIsAuthenticated(true);

    const intendedPath = sessionStorage.getItem('intendedPath');
    sessionStorage.removeItem('intendedPath'); // Clear it after use

    navigate(intendedPath || "/dashboard", { replace: true });
  };

  const handleLogout = () => {
    // First clear all auth-related data
    Cookies.remove("UserCredential");
    setIsAuthenticated(false);
    sessionStorage.clear();

    // Then navigate to login page
    navigate("/", { replace: true });
  };

  return (
    <div className={loading ? "blur-effect" : ""}>

      <ToastContainer />
      <Loading show={loading} />
      {/* <div className={loading ? "blur-effect" : ""}> */}
      <Routes>
        {/* Public Route - Login */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLogin} />
            )
          }
        />

        {/* Protected Routes - Everything else */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Sidebar onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>


    // </div>
  );
};

// Wrap the app with Router
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWrapper;

