import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import PackingSlipPage from "./pages/PackingSlipPage";
import Login from "./pages/Login";
import SlipList from "./pages/SlipList";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user"));

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
