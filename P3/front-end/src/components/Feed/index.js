import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
    Box, Flex, Heading, Spacer, Text, Center, Square, FormLabel,
    FormControl, Input, FormHelperText, WrapItem, Avatar, Button,
} from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";


const Feed = () => {
    const [userProfile, setuserProfile] = useState([]);

    const initState = { first_name: "", last_name: "", email: "", phone_num: "", avatar: "" };
    const [formValue, setFormValue] = useState(initState);
    const [formErr, setFormErr] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const navigate = useNavigate();

    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
    };

    const handleChange = (e) => {
        if (e.target.type === 'file'){
            setFormValue({ ...formValue, [e.target.name]: e.target.files[0] });
            setuserProfile({ ...userProfile, [e.target.name]: URL.createObjectURL(e.target.files[0])});
        }
        else {
            const { name, value } = e.target;
            setFormValue({ ...formValue, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErr(validation(formValue));
        setIsSubmit(true);
    };

    useEffect(() => {
        if (Object.keys(formErr).length === 0 && isSubmit) {
            const fd = new FormData();
            fd.append('_method', 'PATCH');
            if (formValue.first_name !== '') {
                fd.append('first_name', formValue.first_name);
            }
            if (formValue.last_name !== '') {
                fd.append('last_name', formValue.last_name);
            }
            if (formValue.email !== '') {
                fd.append('email', formValue.email);
            }
            if (formValue.phone_num !== '') {
                fd.append('phone_num', formValue.phone_num);
            }
            if (formValue.avatar !== '') {
                fd.append('avatar', formValue.avatar);
            }

            // Validated now send the request
            axios.patch(`http://127.0.0.1:8000/accounts/update/`, fd, config)
                .then(respond => {
                    axios
                    .get(
                        `http://127.0.0.1:8000/accounts/view/`,
                        config
                    )
                    .then(respond => {
                        window.sessionStorage.setItem("avatar", respond.data.avatar);
                    })
                    .catch((err) => {
                        if (err.response.status === 401){
                            navigate('/login');
                            alert('User Validation Failed. Please Login.');
                        }
                    });
                    alert("Profile Saved.");
                    navigate('/profile');
                })
                .catch(error => {
                    if (error.response.status === 401){
                        navigate('/login');
                        alert('User Validation Failed. Please Login.');
                    }
                    if (!error.response.data.id) {
                        // output error msg
                        alert("Saving Failed: Check Error Messages.");
                        if (error.response.data.first_name) {
                            setFormErr(formErr => ({ ...formErr, first_name: error.response.data.username }));
                        }
                        if (error.response.data.last_name) {
                            setFormErr(formErr => ({ ...formErr, last_name: error.response.data.last_name }));
                        }
                        if (error.response.data.email) {
                            setFormErr(formErr => ({ ...formErr, email: error.response.data.email }));
                        }
                        if (error.response.data.phone_num) {
                            setFormErr(formErr => ({ ...formErr, phone_num: error.response.data.phone_num }));
                        }
                        if (error.response.data.avatar) {
                            setFormErr(formErr => ({ ...formErr, avatar: error.response.data.avatar }));
                            alert("Avatar Upload Failed.");
                        }
                    }
                    console.log(error.response);
                });
        }
    }, [formErr]);

    const validation = (formValue) => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (formValue.email) {
            if (!emailRegex.test(formValue.email)) {
                errors.email = "Email Format Invalid."
            }
        }
        return errors;
    };

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:8000/accounts/view/`,
                config
            )
            .then(respond => {
                setuserProfile(respond.data);
            })
            .catch((err) => {
                if (err.response.status === 401){
                    navigate('/login');
                    alert('User Validation Failed. Please Login.');
                }
            });
    }, []);

    return (
        <Box>
            <MainNavBar>
            </MainNavBar>
        </Box>
    );
}

export default Feed;
