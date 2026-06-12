import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("danger");
      return;
    }

    const response = await fetch(
      `http://localhost:5000/api/auth/reset-password/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      }
    );

    const resData = await response.json();

    if (response.status === 200) {
      setMessage(resData.msg);
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else {
      setMessage(resData.msg);
      setMessageType("danger");
    }
  };

  return (
    <div className="resetpassword-wrapper">
      <div className="resetpassword-form-container">
        <h2 className="resetpassword-title">Reset Password</h2>

        {message && <Alert variant={messageType}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>New password</Form.Label>
            <Form.Control
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button className="resetpassword-button" type="submit">
            Save Password
          </Button>

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <Link style={{ textDecoration: "none" }} to="/login">
              Back to Login?
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default ResetPassword;