import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
    Box, Flex, Heading, Spacer, Text, Center, Square, FormLabel,
    FormControl, Input, FormHelperText, WrapItem, Avatar, Button
} from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";
import "./style.css"

const Profile = () => {
    const initState = { username: "", first_name: "", last_name: "", email: "", phone_num: "", avatar: "" };
    const [userProfile, setuserProfile] = useState([]);
    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
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
                console.log(err);
            });
    }, []);

    return (
        <Box>
            <MainNavBar>
            </MainNavBar>

            <div className="Profile">
                <FormControl className="profForm" isReadOnly>
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
                                    <Input id='first-name' value={userProfile.first_name} />
                                </Center >
                                <Box w='1%'></Box>
                                <Center w='49.5%' >
                                    <Input id='last-name' value={userProfile.last_name} />
                                </Center >
                            </Flex>

                            <FormLabel htmlFor='email' className="profLabel">Email</FormLabel>
                            <Input id='email' type='email' value={userProfile.email} />
                            <FormLabel htmlFor='phone' className="profLabel">Phone Number</FormLabel>
                            <Input id='phone' value={userProfile.phone_num} />

                            <Center pr={'40%'} pt={'3%'} >
                                <Link to="/profile/edit" className="editProf btn btn-primary"> <Button colorScheme='blue' size='md'>EDIT PROFILE</Button> </Link>
                            </Center>
                            
                        </Box>
                    </Flex>
                </FormControl>
            </div>
        </Box>
    );
}

export default Profile;
