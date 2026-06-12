import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./ForgetPassword.css";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

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

       
      const response = await fetch(
        "http://localhost:5000/api/auth/forgetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email
          }),
        },
      );

      const resData=await response.json();
      if(response.status===400){
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      }
      else if(response.status===200){
        setMessage(resData.msg);
        setMessageType("success");
        return;
      }
        else if(response.status===500){
        setMessage(resData.msg);
        setMessageType("danger");
        return;
      }
    }
  };

  const check = () => {
    if (!email) return true;
    else return false;
  };

  return (
    <div className="forgetpassword-wrapper">
      <div className="forgetpassword-form-container">
        <h2 className="forgetpassword-title">Forget Password?</h2>
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

          <Button
            disabled={check()}
            variant="primary"
            type="submit"
            className="forgetpassword-button"
          >
            Reset Password
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

export default ForgetPassword;
