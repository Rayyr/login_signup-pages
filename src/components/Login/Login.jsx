import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    //password validation
    if (!password) newErrors.password = "Password is required";
    else if (password.length <= 3)
      newErrors.password = "Password must be at least 4 chars";

    //email validation
    if (!email) newErrors.email = "Email is required";
    else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (emailRegex.test(email) === false) newErrors.email = "Invalid email";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      //invalid form
      setErrors(newErrors);
    } else {
      //valid form
      setErrors({});
      // handle it with backend

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const resData = await response.json();

      if (response.status === 400) {
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      } else if (response.status === 200) {
        setMessage(resData.msg);
        setMessageType("success");
        setTimeout(() => {
          navigate("/home");
        }, 3000);
        return;
      } else {
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      }
    }
  };

  const check = () => {
    if (!email || !password) return true;
    else return false;
  };

  return (
    <div className="login-wrapper">
      <div className="login-form-container">
        <h2 className="login-title">Login</h2>
        {message && <Alert variant={messageType}>{message}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              required
              isInvalid={!!errors.email}
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {setEmail(e.target.value);setMessage("");}}
            />

            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              isInvalid={!!errors.password}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {setPassword(e.target.value);setMessage("");}}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            disabled={check()}
            variant="primary"
            type="submit"
            className="login-button"
          >
            Login
          </Button>

          <p>
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Login;
