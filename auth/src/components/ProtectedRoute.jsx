import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuth(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        localStorage.removeItem("token");
        setIsAuth(false);
        return;
      }

      setIsAuth(true);
    };

    checkAuth();
    const interval=setInterval(checkAuth,1000);
    return () => clearInterval(interval);

  }, []);

  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  if (isAuth === false) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;