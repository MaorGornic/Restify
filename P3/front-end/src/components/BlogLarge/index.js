import {
    Box,
    Stack,
    Text,
    Flex,
    Image,
    HStack,
    Button,
    IconButton,
    Center,
    VStack,
    Grid,
    StackDivider,
} from "@chakra-ui/react";
import * as colors from "../../utils/colors";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

function BlogLarge(props) {
    const navigate = useNavigate();

    const blog = props.thisBlog;
    const title = blog.title;
    const contents = blog.contents;
    const banner = blog.banner;
    const id = blog.id;
    const rest_id = blog.restaurant_id;
    const likes = blog.likes.length;
    var timestamp = blog.publish_timestamp.substring(0, 10);

    const [loading, setLoading] = useState(true);
    const [restName, setRestName] = useState({});
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLikes] = useState(likes);

    const config = {
        headers: {
            Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        },
    };

    // Source: https://jasonwatmore.com/post/2020/01/27/react-fetch-http-get-request-examples
    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        function fetchRest() {
            fetch(`http://127.0.0.1:8000/restaurants/info/${rest_id}/`, {
                method: "GET",
            })
                .then(response => response.json())
                .then(json => {
                    setRestName(json.name);
                    setLoading(false);
                })
                .finally(axios
                    .get(`http://127.0.0.1:8000/restaurants/blog/doeslike/${id}/`, config)
                    .then((res) => {
                        setIsLiked(res.data.is_liked);
                    })
                    .catch((err) => {
                        if (err.response.status == 401) navigate("/login");
                    }));
        };
        fetchRest();
    }, []);

    // Set Likes in real time
    const getLikes = async () => {
        axios
            .get(`http://127.0.0.1:8000/restaurants/blog/${id}/`, null)
            .then((res) => {
                setLikes(res.data.likes.length);
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
                getLikes();
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
                getLikes();
            })
            .catch((err) => {
                if (err.response.status == 401) navigate("/login");
            });
    };

    return (
        <Box>
            {!loading ? (
                <Box
                    boxShadow="dark-lg"
                    p="3"
                    background={colors.purple.medium}
                    borderRadius="lg"
                >
                    <Flex justifyContent="space-between">
                        <Stack w="70%">
                            <Text isTruncated as='kbd' maxWidth="130vh" color="white" fontSize="xl" fontWeight="normal">
                                {title}
                            </Text>

                            <Stack w="30%">
                                <Flex style={{ marginLeft: "2rem" }}>
                                    <Box w='40%' >
                                        <Button colorScheme='blue' size='sm' width='100px' height='22px'>Restaurant: </Button>
                                    </Box >
                                    <Box w='60%' >
                                        <Text color="white">{restName} </Text>
                                    </Box >
                                </Flex>


                                <Flex style={{ marginLeft: "2rem" }}>
                                    <Box w='40%' >
                                        <Button colorScheme='blue' size='sm' width='100px' height='22px'>Date: </Button>
                                    </Box >
                                    <Box w='60%' >
                                        <Text color="white">{timestamp} </Text>
                                    </Box >
                                </Flex>

                                <Flex style={{ marginLeft: "2rem" }}>
                                    <Box w='40%' >
                                        <Button colorScheme='blue' size='sm' width='100px' height='22px'>Like: </Button>
                                    </Box >
                                    <Box w='60%' >
                                        <Text color="white">{liked} </Text>
                                    </Box >
                                </Flex>
                            </Stack>

                            <Flex >
                                <Text
                                    isTruncated
                                    color="white"
                                    fontSize="lg"
                                    maxWidth="130vh"
                                    style={{ marginLeft: "2rem" }}
                                >
                                    {contents}
                                </Text>
                            </Flex>

                            <HStack style={{ marginTop: "1.5rem" }}>
                                <Button
                                    background={colors.black.dark}
                                    color="white"
                                    opacity="0.7"
                                    variant="solid"
                                    _hover={{ opacity: "1" }}
                                    onClick={() => navigate(`/blogs/${id}`)}
                                >
                                    READ MORE
                                </Button>
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
                            </HStack>
                        </Stack>

                        <Flex w='25%' maxWidth="25%" class='blogPic'>
                            <Image
                                borderRadius="1rem"
                                src={banner}
                            />
                        </Flex>
                    </Flex>
                </Box>
            ) : (<></>)}
        </Box>
    );
}

export default BlogLarge;
