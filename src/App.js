import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Devices from "./Pages/Devices";
import Settings from "./Pages/Settings";
import GuestNavbar from "./Components/GuestNavbar";
import Users from "./Pages/Users"
import { UserProvider, useUser } from "./Context/UserContext";
import { WebSocketProvider } from './Context/WebSocketContext';
import Cookies from 'js-cookie';


const ProtectedRoute = ({ children }) => {
  const authToken = Cookies.get("authToken");
  const guestToken = Cookies.get("guestToken");
  if (authToken) {
    console.log("ProtectedRoute: User is authenticated as admin.");
    return children;
  } else if (guestToken) {
    console.log("ProtectedRoute: User is authenticated as guest.");
    return children;
  } else {
    console.log("ProtectedRoute: No valid session. Redirecting to login.");
    return <Navigate to="/" replace />;
  }
};

function App() {
  const {isGuest} = useUser();
  return (
      <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={
              <>
                {isGuest ? <GuestNavbar /> : <Navbar />}
                <Routes>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
              </>
            } />
          </Routes>
        </Router>
      </WebSocketProvider>
    
  );
}

export default App;
