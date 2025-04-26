import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

import App from "./App";
import "./styles.css"; // Optional: if you want custom styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="393397266315-66u342a4rvbv4bsq1t6upk5d6e0adkab.apps.googleusercontent.com">
      <Router>  {/* Wrap App with Router */}
        <App />
      </Router>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
