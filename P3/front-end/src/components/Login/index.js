import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";

const Login = () => {
    const initState = { username: "", password: "" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [user, setUser] = useState({ token: "" });
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
        // Source: https://stackoverflow.com/questions/38510640/how-to-make-a-rest-post-call-from-reactjs-code
        if (Object.keys(formErr).length === 0 && isSubmit) {
            // Validated now send the request
            fetch('http://127.0.0.1:8000/accounts/api/token/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formValue.username,
                    password: formValue.password,
                })
            })
                .then(response => response.json())
                .then(json => {
                    if (!json.access) {
                        alert("Login Failed. Please Recheck Login Information.");
                    }
                    else {
                        setUser({ token: json.access });
                        const globalState = {
                            token: json.access
                        };
                        const userToken = React.createContext(globalState);
                        window.sessionStorage.setItem("token", json.access);
                        alert("Login Success.");
                        navigate('/restaurants');
                    }
                })
        }
    }, [formErr]);

    const validation = (formValue) => {
        const errors = {};
        if (!formValue.username) {
            errors.username = "Username is required."
        }
        if (!formValue.password) {
            errors.password = "Password is required."
        }
        return errors;
    }

    // <pre>{JSON.stringify(formValue, undefined, 2)}</pre>
    return (<div className="Landing">
        <form onSubmit={handleSubmit}>
            <h3 class="landTitle">Login</h3>

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

            <Link to="/signup" id="noaccount">No account? Sign up now!</Link> <br />
            <button className="button blue">Login</button>
        </form></div>
    );
}

// Source: https://www.youtube.com/watch?v=EYpdEYK25Dc
export default Login;
