import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
 
  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
<div className="header">
  <span>hi from user: {userId}</span>

  <Button
    variant="primary"
    className="logout-button"
    onClick={logout}
  >
    Logout
  </Button>
</div>
  );
}

export default Profile;