import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Profile() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
 
  const logout=()=>{
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div>
      hi from user: {userId}
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