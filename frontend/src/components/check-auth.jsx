import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

async function validateToken(token) {
  if (!token) return false;
  
  try {
    const res = await fetch(`http://localhost:5173`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return res.ok;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      console.log("Auth check - Token:", token ? "[token exists]" : "No token");
      console.log("Protected route:", protectedRoute);

      if (protectedRoute) {
        if (!token) {
          console.log("No token, redirecting to login");
          navigate("/login");
          return;
        }
        
        // Validate the token with the server
        const isValid = await validateToken(token);
        if (!isValid) {
          console.log("Invalid or expired token, redirecting to login");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        
        console.log("Token valid, allowing access");
        setLoading(false);
      } else {
        // For non-protected routes (like login/signup)
        if (token) {
          const isValid = await validateToken(token);
          if (isValid) {
            console.log("Already logged in, redirecting to home");
            navigate("/");
            return;
          } else {
            // Clear invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
        console.log("No valid session, showing login/signup");
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, protectedRoute]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}

export default CheckAuth;