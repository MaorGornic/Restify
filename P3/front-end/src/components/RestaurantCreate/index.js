import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import {
  Box,
  Flex,
  Heading,
  Spacer,
  Text,
  Center,
  Square,
  FormLabel,
  FormControl,
  Input,
  FormHelperText,
  WrapItem,
  Avatar,
  Button,
} from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";

const RestaurantCreate = () => {
  const [userProfile, setuserProfile] = useState([]);

  const initState = {
    name: "",
    address: "",
    email: "",
    postal_code: "",
    phone_num: "",
    avatar: "",
  };
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
    if (e.target.type === "file") {
      setFormValue({ ...formValue, [e.target.name]: e.target.files[0] });
      setuserProfile({
        ...userProfile,
        [e.target.name]: URL.createObjectURL(e.target.files[0]),
      });
    } else {
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
      fd.append("_method", "POST");
      if (formValue.name !== "") {
        fd.append("name", formValue.name);
      }
      if (formValue.address !== "") {
        fd.append("address", formValue.address);
      }
      if (formValue.email !== "") {
        fd.append("email", formValue.email);
      }
      if (formValue.postal_code !== "") {
        fd.append("postal_code", formValue.postal_code);
      }
      if (formValue.phone_num !== "") {
        fd.append("phone_num", formValue.phone_num);
      }
      if (formValue.avatar !== "") {
        fd.append("logo", formValue.avatar);
      }

      // Validated now send the request
      axios
        .post(`http://127.0.0.1:8000/restaurants/new/`, fd, config)
        .then((res) => {
          console.log(res);
          navigate(`/restaurants/${res.data.id}`);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/login");
            alert("User Validation Failed. Please Login.");
          }
          if (!error.response.data.id) {
            // output error msg
            alert("Saving Failed: Check Error Messages.");
            if (error.response.data.name) {
              setFormErr((formErr) => ({
                ...formErr,
                name: error.response.data.username,
              }));
            }
            if (error.response.data.address) {
              setFormErr((formErr) => ({
                ...formErr,
                address: error.response.data.address,
              }));
            }
            if (error.response.data.email) {
              setFormErr((formErr) => ({
                ...formErr,
                email: error.response.data.email,
              }));
            }
            if (error.response.data.postal_code) {
              setFormErr((formErr) => ({
                ...formErr,
                postal_code: error.response.data.postal_code,
              }));
            }
            if (error.response.data.phone_num) {
              setFormErr((formErr) => ({
                ...formErr,
                phone_num: error.response.data.phone_num,
              }));
            }
            if (error.response.data.avatar) {
              setFormErr((formErr) => ({
                ...formErr,
                avatar: error.response.data.avatar,
              }));
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
        errors.email = "Email Format Invalid.";
      }
    }
    return errors;
  };

  // Check if the user currently owns a restaurant.
  // Use an axios API request to  http://127.0.0.1:8000/restaurants/owned/
  // If yes, redirect to the restaurant page.
  // If no, render the form.

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/restaurants/owned/`, config)
      .then((res) => {
        console.log("navigating... to id ");
        navigate(`/restaurants/${res.data.id}`);
      })
      .catch((err) => {
        console.log("Got error...", err);
        if (err.response.status === 401) {
          navigate("/login");
          alert("User Validation Failed. Please Login.");
        } else if (err.response.status === 404) {
          console.log(err.response);
        }
      });
  }, []);

  return (
    <Box>
      <MainNavBar></MainNavBar>

      <div className="Profile">
        <FormControl className="profForm" onSubmit={handleSubmit}>
          <Flex>
            <Center>
              <Box w="300px" class="idCard">
                <Box>
                  <Center>
                    <Box>
                      <Avatar size="2xl" name="userAvatar" />{" "}
                    </Box>
                  </Center>
                  <Center>
                    <Box>
                      <Text as="abbr" fontSize="2xl" color={"black"}></Text>
                    </Box>
                  </Center>
                  <Center>
                    <Box>
                      <Text as="kbd" color={"gray"}>
                        {}
                      </Text>
                    </Box>
                  </Center>
                </Box>
                <Center pl={"28%"} pt={"3%"} maxWidth={"72%"}>
                  <Button
                    className="transButton"
                    name="avatar"
                    colorScheme="transparent"
                    size="md"
                  >
                    <input
                      type="file"
                      name="avatar"
                      id="submitButton"
                      onChange={handleChange}
                    />
                  </Button>
                </Center>
              </Box>
            </Center>

            <Box w="70%">
              <h4 className="profileTitle">Restaurant Creation Form</h4>

              <Flex>
                <Center></Center>
                <Box w="50.5%">
                  <FormLabel htmlFor="name" className="profLabel">
                    Restaurant name
                  </FormLabel>
                </Box>
                <Box w="49.5%">
                  <FormLabel htmlFor="address" className="profLabel">
                    Address
                  </FormLabel>
                </Box>
              </Flex>
              <Flex>
                <Center w="49.5%">
                  <Input id="name" name="name" onChange={handleChange} />
                </Center>
                <Box w="1%"></Box>
                <Center w="49.5%">
                  <Input id="address" name="address" onChange={handleChange} />
                </Center>
              </Flex>

              <Flex>
                <Box w="49.5%">
                  <p>{formErr.name}</p>
                </Box>
                <Box w="1%"></Box>
                <Box w="49.5%">
                  <p>{formErr.address}</p>
                </Box>
              </Flex>

              <FormLabel htmlFor="email" className="profLabel">
                Email
              </FormLabel>
              <Input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
              />
              <p>{formErr.email}</p>
              {/* postal code */}
              <FormLabel htmlFor="postal_code" className="profLabel">
                Postal Code
              </FormLabel>
              <Input
                id="email"
                name="postal_code"
                type="text"
                onChange={handleChange}
              />
              <p>{formErr.email}</p>
              <FormLabel htmlFor="phone" className="profLabel">
                Phone Number
              </FormLabel>
              <Input id="phone" name="phone_num" onChange={handleChange} />
              <p>{formErr.phone_num}</p>

              <Center pr={"40%"} pt={"3%"}>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  colorScheme="blue"
                  size="md"
                >
                  Create Restaurant
                </Button>
              </Center>
            </Box>
          </Flex>
        </FormControl>
      </div>
    </Box>
  );
};

export default RestaurantCreate;
