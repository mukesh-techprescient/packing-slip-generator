import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import PackingSlipPage from "./pages/PackingSlipPage";
import Login from "./pages/Login";
import SlipList from "./pages/SlipList";
import 'bootstrap/dist/css/bootstrap.min.css';
import SizingCalculatorInput from "./pages/SizingCalculatorInput";

// Helper function to check if token is expired
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if current time > token expiry time
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      if (parsedUser.token && !isTokenExpired(parsedUser.token)) {
        return true;
      } else {
        localStorage.removeItem("user");
        return false;
      }
    }
    return false;
  });

  useEffect(() => {
    if (user?.token && isTokenExpired(user.token)) {
      handleLogout();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <Routes>
      <Route 
        path="/slips/new/slip" 
        element={
          isAuthenticated 
            ? <PackingSlipPage user={user} handleLogout={handleLogout} /> 
            : <Navigate to="/login" />
        } 
      />

<Route 
        path="/sizing" 
        element={
          isAuthenticated 
            ? <SizingCalculatorInput user={user} handleLogout={handleLogout} /> 
            : <Navigate to="/login" />
        } 
      />

      <Route 
        path="/slips/:id" 
        element={
          isAuthenticated 
            ? <PackingSlipPage user={user} handleLogout={handleLogout} /> 
            : <Navigate to="/login" />
        } 
      />

      <Route 
        path="/login" 
        element={<Login setUser={setUser} setIsAuthenticated={setIsAuthenticated} />} 
      />

      <Route
        path="/"
        element={isAuthenticated ? <SlipList /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
