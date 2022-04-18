// React blog post module view
import {
  Box,
  HStack,
  Center,
  Heading,
  Spinner,
  Tag,
  Badge,
  Image,
  Divider,
  Button,
} from "@chakra-ui/react";
import { Text } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";
import * as colors from "../../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import { useNavigate } from "react-router-dom";

function BlogView() {
  const { id } = useParams();
  const [blog, setBlog] = useState([]);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();

  const doesLike = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/blog/doeslike/${id}/`, config)
      .then((res) => {
        setIsLiked(res.data.is_liked);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const likeBlog = async () => {
    axios
      .patch(`http://127.0.0.1:8000/restaurants/blog/${id}/like/`, null, config)
      .then(() => {
        setIsLiked(true);
        setLikes(likes + 1);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const unLikeBlog = async () => {
    axios
      .patch(
        `http://127.0.0.1:8000/restaurants/blog/${id}/unlike/`,
        null,
        config
      )
      .then(() => {
        setIsLiked(false);
        setLikes(likes - 1);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  const getBlog = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/blog/${id}/`)
      .then((res) => {
        console.log("Got response of ", res);
        setBlog(res.data);
        setLikes(res.data.likes.length);
        //   setLikes(res.data.likes.length);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) navigate("/login");
      });
  };

  useEffect(() => {
    getBlog();
    if (!isOwner) {
      doesLike();
    }
  }, [window.location.pathname]);

  return (
    <Box>
      <MainNavBar />
      {!loading ? (
        <Box>
          {/* create a blog title in the center */}
          <Heading
            mt="1"
            as="h1"
            size="3xl"
            marginLeft="5%"
            fontWeight="bold"
            fontFamily="heading"
          >
            {blog.title}
          </Heading>
          <Text marginLeft="5%" color="grey" fontStyle="italic">
            Posted on {new Date(blog.publish_timestamp).toDateString()}
          </Text>
          <Badge marginLeft="5%" bg={colors.purple.medium} color="white">
            {likes} Likes
          </Badge>

          <Image
            marginLeft="5%"
            borderRadius="0.5rem"
            // width="500px"
            height="400px"
            marginTop="1.4rem"
            src={blog.banner}
          />

          {/* display contents of the blog. */}
          <Text color="black" fontSize="xl" maxWidth="90%" marginLeft="5%">
            {blog.contents}
          </Text>
          <Divider />
          <Button
            marginLeft="5%"
            mt="5"
            mb="2"
            leftIcon={<FaHeart />}
            background={colors.black.dark}
            color="white"
            opacity="0.7"
            variant="solid"
            _hover={{ opacity: "1" }}
            onClick={() => (isLiked ? unLikeBlog() : likeBlog())}
          >
            {isLiked ? "UNLIKE" : "LIKE"}
          </Button>
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
      )}
    </Box>
  );
}

export default BlogView;
