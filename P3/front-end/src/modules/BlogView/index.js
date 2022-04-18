// React blog post module view
import {
    Box,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Button,
    Heading,
    Spinner,
    Center,
    Tag,
    TagLabel,
    Image,
    Grid,
    GridItem,
    Stack,
  } from "@chakra-ui/react";
  import { FaHeart, FaUserFriends } from "react-icons/fa";
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
          // TODO
        });
    };
  
  
    const getBlog = () => {
      setLoading(true);
      axios
        .get(`http://127.0.0.1:8000/restaurants/blog/${id}/`)
        .then((res) => {
          console.log("Got response of ", res);
          setBlog(res.data);
          //   setLikes(res.data.likes.length);
          setLoading(false);
        })
        .catch((err) => {
          // TODO
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
                as="h1"
                size="xl"
                textAlign="center"
                fontWeight="bold"
                fontFamily="heading"
                mb={4}
            >
              {blog.title}        
                </Heading>
              
                  <Box
                    background="white"
                  >
                    <Center>
                      <Image
                        borderRadius="2rem"
                        width="250px"
                        height="150px"
                        marginTop="1.4rem"
                        src={blog.banner}
                      />
                    </Center>
                  </Box>
                  <Center>
                    
                    {/* display contents of the blog */}
                    <Box
                        style={{
                            marginTop: "1rem",
                            marginBottom: "1rem",
                            background: "white",
                            borderRadius: "4rem",
                            height: "200px",
                            padding: "1rem",
                            overflow: "scroll",
                        }}
                    >
                    {blog.contents}
                    </Box>
                  </Center>
  
                  <Center>
                    <Stack marginTop="2rem" marginBottom="1rem">
                      <Tag size="md" background={colors.grey.dark}>
                        <FaUserFriends color="white" />
                      </Tag>
                      <Tag size="md" background={colors.grey.dark}>
                        <FaHeart color="white" />

                      </Tag>
                    </Stack>
                  </Center>
                <Box marginLeft="2rem">
                </Box>

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
  