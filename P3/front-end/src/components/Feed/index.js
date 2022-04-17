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

    const [formErr, setFormErr] = useState({});
    const [blog, setBlog] = useState({});
    const [totalBlogs, setTotalBlogs] = useState(0)
    const navigate = useNavigate();

    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
    };

    useEffect(() => {
        axios
            .get(
                `http://127.0.0.1:8000/restaurants/blog/feed/`,
                config
            )
            .then(respond => {
                setBlog(respond.data.results);
                setTotalBlogs(respond.data.count);
                console.log(blog[0]); 
                console.log(totalBlogs);
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
