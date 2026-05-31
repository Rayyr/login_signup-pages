import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import "./Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
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

    if (password !== confirmedPassword) {
      newErrors.confirmedPassword = "The passwords must be matched";
    }
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
      console.log("Signup attempted with:", { email, password });
      // handle it with backend

      //send the email , passowrd in req inside response fetch
      const response = await fetch("http://localhost:5000/api/auth/signup", {
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
        //email already exist
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      }

      if (response.status === 201) {
        setMessage(resData.msg);
        setMessageType("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      else{
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      }
    }
  };

  const check = () => {
    if (!email || !password || !confirmedPassword) return true;
    else return false;
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-form-container">
        <h2 className="signup-title">Sign up</h2>
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
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage("");
              }}
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
              placeholder="Create password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              isInvalid={!!errors.confirmedPassword}
              type="password"
              placeholder="Confirm password"
              value={confirmedPassword}
              onChange={(e) => {
                setConfirmedPassword(e.target.value);
                setMessage("");
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmedPassword}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            disabled={check()}
            variant="primary"
            type="submit"
            className="signup-button"
          >
            Signup
          </Button>

          <p>
            Already have an account? <Link to="/login">Log in here</Link>
          </p>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
