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

const RestaurantCreate = () => {
    // Component to create a new restaurant form 
    // Restaurant creation includes a Restaurant Name, logo, address,
    // postal code, and phone number
    const navigate = useNavigate();
    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
    };
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantLogo, setRestaurantLogo] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantPostalCode, setRestaurantPostalCode] = useState("");
    const [restaurantEmail, setRestaurantEmail] = useState("");
    const [restaurantPhoneNumber, setRestaurantPhoneNumber] = useState("");
    const fd = new FormData();

    const handleSubmit = (e) => {
        e.preventDefault();
        fd.append('name', restaurantName);
        fd.append('address', restaurantAddress);
        fd.append('postal_code', restaurantPostalCode);
        fd.append('phone_num', restaurantPhoneNumber);
        fd.append('email', restaurantEmail);

        axios.post("http://127.0.0.1:8000/restaurants/new/", fd, config)
        .then(res => {
            navigate(`/restaurants/${res.data.id}`)
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <MainNavBar />
            <Box
                as="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                maxW="sm"
                w="100%"
                h="100%"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                backgroundColor="white"
            >
                <Heading as="h1" size="lg" mb={4}>
                    Create a Restaurant
                </Heading>
                <Box>
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantName">Restaurant Name</FormLabel>
                        <Input
                            id="restaurantName"
                            placeholder="Restaurant Name"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter the name of the restaurant
                        </FormHelperText>

                    </FormControl>
                </Box>
                <Box>
                    {/* Upload a logo file image for the restaurant. A logo is an image file in the format of png or jpg. type should be file */}
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantLogo">Restaurant Logo</FormLabel>
                        <Input
                            id="restaurantLogo"
                            placeholder="Restaurant Logo"
                            type="file"
                            width="100%"
                            value={restaurantLogo}
                            onChange={(e) => setRestaurantLogo(e.target.value)}
                        />
                        <FormHelperText>
                            Please upload a logo for the restaurant
                        </FormHelperText>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantAddress">Restaurant Address</FormLabel>
                        <Input
                            id="restaurantAddress"
                            placeholder="Restaurant Address"
                            value={restaurantAddress}
                            onChange={(e) => setRestaurantAddress(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter the address of the restaurant
                        </FormHelperText>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantPostalCode">Restaurant Postal Code</FormLabel>
                        <Input
                            id="restaurantPostalCode"
                            placeholder="Restaurant Postal Code"
                            value={restaurantPostalCode}
                            onChange={(e) => setRestaurantPostalCode(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter the postal code of the restaurant
                        </FormHelperText>
                    </FormControl>
                </Box>
                <Box>
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantPhoneNumber">Restaurant Phone Number</FormLabel>
                        <Input
                            id="restaurantPhoneNumber"
                            placeholder="Restaurant Phone Number"
                            value={restaurantPhoneNumber}
                            onChange={(e) => setRestaurantPhoneNumber(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter the phone number of the restaurant
                        </FormHelperText>
                    </FormControl>
                </Box>
                {/* Add restaurant email field */}
                <Box>
                    <FormControl isRequired>
                        <FormLabel htmlFor="restaurantEmail">Restaurant Email</FormLabel>
                        <Input
                            id="restaurantEmail"
                            placeholder="Restaurant Email"
                            value={restaurantEmail}
                            onChange={(e) => setRestaurantEmail(e.target.value)}
                        />
                        <FormHelperText>
                            Please enter the email of the restaurant
                        </FormHelperText>
                    </FormControl>
                </Box>
                <Box>
                    <Button
                        type="submit"
                        variantColor="teal"
                        variant="outline"
                        w="100%"
                        mt={4}
                    >
                        Create Restaurant
                    </Button>
                </Box>
            </Box>
        </>
    )


}

export default RestaurantCreate;
