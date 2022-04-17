import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
    Box, Flex, Heading, Spacer, Text, Center, Square, FormLabel,
    FormControl, Input, FormHelperText, WrapItem, Avatar, Button,
} from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";


const ProfileEdit = () => {
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
            const fd = new FormData();
            fd.append('_method', 'PATCH');
            fd.append('first_name', formValue.first_name);
            fd.append('last_name', formValue.last_name);
            fd.append('email', formValue.email);
            fd.append('phone_num', formValue.phone_num);

            // Validated now send the request
            axios.patch(`http://127.0.0.1:8000/accounts/update/`, fd, config)
                .then(respond => {
                    alert("Profile Saved.");
                    navigate('/profile');
                })
                .catch(error => {
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
            if (!emailRegex.test(formValue.email)){
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
                console.log(err.response);
            });
    }, []);

    return (
        <Box>
            <MainNavBar>
            </MainNavBar>

            <div className="Profile">
                <FormControl className="profForm" onSubmit={handleSubmit}>
                    <Flex><Center>
                        <Box w='300px' class='idCard'>
                            <Box>
                                <Center><Box>
                                    <Avatar size='2xl' name='userAvatar' src={userProfile.avatar} />{' '}
                                </Box></Center>
                                <Center><Box>
                                    <Text as='abbr' fontSize='2xl' color={'black'}>{userProfile.username}</Text>
                                </Box></Center>
                                <Center><Box>
                                    <Text as='kbd' color={'gray'}>{userProfile.email}</Text>
                                </Box></Center>
                            </Box>
                        </Box></Center>

                        <Box w='70%'>
                            <h4 className="profileTitle">Profile Settings</h4>

                            <Flex>
                                <Box w='50.5%' >
                                    <FormLabel htmlFor='first-name' className="profLabel">First name</FormLabel>
                                </Box >
                                <Box w='49.5%' >
                                    <FormLabel htmlFor='last-name' className="profLabel">Last name</FormLabel>
                                </Box >
                            </Flex>
                            <Flex>
                                <Center w='49.5%' >
                                    <Input id='first-name' name="first_name" onChange={handleChange} 
                                    defaultValue={userProfile.first_name} />
                                </Center >
                                <Box w='1%'></Box>
                                <Center w='49.5%' >
                                    <Input id='last-name' name="last_name" onChange={handleChange} defaultValue={userProfile.last_name} />
                                </Center >
                            </Flex>

                            <Flex>
                                <Box w='49.5%' >
                                    <Text>{formErr.first_name}</Text>
                                </Box >
                                <Box w='1%'></Box>
                                <Box w='49.5%' >
                                    <Text>{formErr.last_name}</Text>
                                </Box >
                            </Flex>

                            <FormLabel htmlFor='email' className="profLabel">Email</FormLabel>
                            <Input id='email' name="email" type='email' onChange={handleChange} defaultValue={userProfile.email} />
                            <Text>{formErr.email}</Text>
                            <FormLabel htmlFor='phone' className="profLabel">Phone Number</FormLabel>
                            <Input id='phone' name="phone_num" onChange={handleChange} defaultValue={userProfile.phone_num} />
                            <Text>{formErr.phone_num}</Text>

                            <Center pr={'40%'} pt={'3%'} >
                                <Button type="submit" onClick={handleSubmit} colorScheme='blue' size='md'>SAVE PROFILE</Button>
                            </Center>

                        </Box>
                    </Flex>
                </FormControl>
            </div>
        </Box>
    );
}

export default ProfileEdit;
