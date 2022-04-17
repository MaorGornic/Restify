import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Center,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Button,
} from "@chakra-ui/react";
import MainNavBar from "../../components/MainNavBar";
import * as colors from "../../utils/colors";

const BlogCreate = () => {
  const { id } = useParams();
  const [userProfile, setuserProfile] = useState([]);

  const initState = {
    title: "",
    contents: "",
    thumbnail: "",
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
        fd.append("title", formValue.title);
      }

      if (formValue.thumbnail !== "") {
        fd.append("banner", formValue.thumbnail);
      }

      if (formValue.contents !== "") {
        fd.append("contents", formValue.contents);
      }

      // Validated now send the request
      axios
        .post(`http://127.0.0.1:8000/restaurants/${id}/blog/new/`, fd, config)
        .then((res) => {
          console.log(res);
          navigate(`/restaurants/${id}`);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            navigate("/login");
            alert("User Validation Failed. Please Login.");
          }
          if (!error.response.data.id) {
            // output error msg
            // alert("Saving Failed: Check Error Messages.");
            if (error.response.data.title) {
              setFormErr((formErr) => ({
                ...formErr,
                title: error.response.data.title,
              }));
            }
            if (error.response.data.contents) {
              setFormErr((formErr) => ({
                ...formErr,
                contents: error.response.data.contents,
              }));
            }
            if (error.response.data.thumbnail) {
              setFormErr((formErr) => ({
                ...formErr,
                banner: error.response.data.banner,
              }));
              alert("Thumbnail Upload Failed.");
            }
          }
          console.log(error.response);
        });
    }
  }, [formErr]);

  const validation = (formValue) => {
    const errors = {};
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
        // navigate(`/restaurants/${res.data.id}`);
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
      <MainNavBar />

      <FormControl className="profForm" onSubmit={handleSubmit}>
        <Flex>
          <Center>
            <Box w="100%" class="idCard">
              <Box>
                <Center>
                  <Box>
                    <Text as="abbr" fontSize="2xl" color={"black"}></Text>
                  </Box>
                </Center>
              </Box>
            </Box>
          </Center>

          <Box w="100%">
            <h4 className="profileTitle">Blog Creation Form</h4>
            <Center></Center>
            <Box w="50.5%">
              <FormLabel htmlFor="title" className="profLabel">
                Title
              </FormLabel>
            </Box>
            <Flex>
              <Center w="100%">
                <Input
                  placeholder="Your blog post's title"
                  id="title"
                  name="title"
                  onChange={handleChange}
                />
              </Center>
            </Flex>

            <Flex>
              <Box w="49.5%">
                <p>{formErr.name}</p>
              </Box>
              <Box w="1%"></Box>
            </Flex>

            <FormLabel htmlFor="thumbnail" className="profLabel">
              Thumbnail
            </FormLabel>
            <Button
              className="transButton"
              name="avatar"
              colorScheme="transparent"
              size="md"
            >
              <input
                type="file"
                name="thumbnail"
                id="submitButton"
                onChange={handleChange}
              />
            </Button>
            <p>{formErr.email}</p>
            {/* postal code */}
            <FormLabel htmlFor="contents" className="profLabel">
              Contents
            </FormLabel>
            {/* TODO */}
            <Textarea
              placeholder="Write your blog post here"
              id="contents"
              name="contents"
              onChange={handleChange}
              maxHeight="20%"
            />
            <p>{formErr.email}</p>

            <Center>
              <Button
                type="submit"
                onClick={handleSubmit}
                bg={colors.purple.medium}
                color="white"
                opacity="0.9"
                size="lg"
                _hover={{ opacity: "1" }}
              >
                Create Restaurant
              </Button>
            </Center>
          </Box>
        </Flex>
      </FormControl>
    </Box>
  );
};

export default BlogCreate;
