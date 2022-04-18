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
  Stack,
  Spinner,
} from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";
import BlogLarge from "../BlogLarge";
import * as colors from "../../utils/colors";

const Feed = () => {
  const [blog, setBlog] = useState({});
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/restaurants/blog/feed/`, config)
      .then((respond) => {
        setBlog(respond.data.results);
        setTotalBlogs(respond.data.count);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          navigate("/login");
          alert("User Validation Failed. Please Login.");
        }
      });
  }, []);

  return (
    <Box>
      <MainNavBar />

      {totalBlogs > 0 ? (
        !loading ? (
          <Box>
            <Stack mt="2%" ml="1.5%" mr="1.5%">
              {blog.map((thisBlog) => (
                <BlogLarge thisBlog={thisBlog} />
              ))}
            </Stack>
          </Box>
        ) : (
          <Box textAlign="center" marginTop="50vh">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={colors.purple.medium}
              size="xl"
            />
          </Box>
        )
      ) : (
        <Box textAlign="center" marginTop="40vh">
          <Text color={colors.purple.medium} fontSize="5xl">
            Nothing to show
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Feed;
