import React from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { allowedUsers } from "../constants";


const Login = ({ setUser,setIsAuthenticated }) => {
    const navigate = useNavigate();


  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwt_decode(credentialResponse.credential);

    console.log(decoded);

    if (allowedUsers.includes(decoded.email)) {
      console.log("✅ Login allowed for:", decoded.email);
      // Save token or other necessary data
      localStorage.setItem("user", JSON.stringify(decoded)); // Store user data in session
      localStorage.setItem("googleAuthToken", credentialResponse.credential);

      const isAuthenticated = !!localStorage.getItem("user");
      setIsAuthenticated(true); // 👈 tell App that now user is logged in
      setUser(decoded)

      setTimeout(() => navigate("/"), 100); // Small delay to ensure the session is saved
    } else {
      console.error("❌ Access denied for:", decoded.email);
      alert("You are not authorized to access this application.");
    }
  };

  const handleLoginError = () => {
    alert("Login Failed");
  };

  return (
    <div className="login-container">
      <h2>Login to Access the Application</h2>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginError}
      />
    </div>
  );
};

export default Login;
