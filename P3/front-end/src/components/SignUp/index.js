import React from "react";
import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  document.body.style = 'background: rgb(71, 64, 210); background: linear-gradient(to top,rgba(137, 247, 254, 1),rgba(102, 166, 255, 1));';
  const initState = { username: "", password: "", password2: "", email: "", firstname: "", lastname: "" };
  const [formValue, setFormValue] = useState(initState);
  const [formErr, setFormErr] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErr(validation(formValue));
    setIsSubmit(true);
  };

  useEffect(() => {
    if (Object.keys(formErr).length === 0 && isSubmit) {
      // Validated now send the request
      fetch('http://127.0.0.1:8000/accounts/register/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formValue.username,
          password: formValue.password,
          password2: formValue.password2,
          email: formValue.email,
          first_name: formValue.firstname,
          last_name: formValue.lastname,
        })
      })
        .then(response => response.json())
        .then(json => {
          console.log(json);
          if (!json.last_name) {
            // output error msg
            alert("Register Failed: Check Error Messages.");
            if (json.username){
              setFormErr(formErr => ({ ...formErr, username: json.username }));
            }
            if (json.email){
              setFormErr(formErr => ({ ...formErr, email: json.email }));
            }
          }
          else {
            alert("Register Success.");
            navigate('/login');
          }
        })
    }
  }, [formErr]);

  const validation = (formValue) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!formValue.username) {
      errors.username = "Username is required."
    }
    if (!formValue.password) {
      errors.password = "Password is required."
    }
    if (!formValue.password2) {
      errors.password2 = "Confirm Password is required."
    }
    if (!formValue.email) {
      errors.email = "Email is required."
    } else if (!emailRegex.test(formValue.email)) {
      errors.email = "Email Format Invalid."
    }
    if (!formValue.firstname) {
      errors.firstname = "Firstname is required."
    }
    if (!formValue.lastname) {
      errors.lastname = "Lastname is required."
    }
    return errors;
  }

  // <pre>{JSON.stringify(formValue, undefined, 2)}</pre>
  return (<div className="Landing">
    <form onSubmit={handleSubmit}>
      <h3 class="landTitle">Sign Up</h3>

      <div className="form-group">
        <label>Username</label>
        <input type="text" name="username" value={formValue.username} onChange={handleChange}
          className="form-control" placeholder="Username" />
      </div>
      <p>{formErr.username}</p>

      <div className="form-group">
        <label>Password</label>
        <input type="password" name="password" value={formValue.password} onChange={handleChange}
          className="form-control" placeholder="Password" />
      </div>
      <p>{formErr.password}</p>

      <div className="form-group">
        <label>Confirm Password</label>
        <input type="password" name="password2" value={formValue.password2} onChange={handleChange}
          className="form-control" placeholder="Confirm Password" />
      </div>
      <p>{formErr.password2}</p>

      <div className="form-group">
        <label>Email address</label>
        <input type="email" name="email" value={formValue.email} onChange={handleChange}
          className="form-control" placeholder="Enter email" />
      </div>
      <p>{formErr.email}</p>

      <div className="form-group">
        <label>First name</label>
        <input type="text" name="firstname" value={formValue.firstname} onChange={handleChange}
          className="form-control" placeholder="First name" />
      </div>
      <p>{formErr.firstname}</p>

      <div className="form-group">
        <label>Last name</label>
        <input type="text" name="lastname" value={formValue.lastname} onChange={handleChange}
          className="form-control" placeholder="Last name" />
      </div>
      <p>{formErr.lastname}</p>

      <button className="fluid ui button blue">Sign Up</button>
    </form></div>
  );
}

// Source: https://www.youtube.com/watch?v=EYpdEYK25Dc
export default SignUp;
