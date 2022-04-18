import {
  Box,
  Stack,
  Text,
  Flex,
  Image,
  HStack,
  Button,
  IconButton,
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import axios from "axios";

function BlogSmall({ title, contents, banner, id, setBlog, isOwner }) {
  const navigate = useNavigate();

  const deleteBlog = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    };

    axios
      .delete(`http://127.0.0.1:8000/restaurants/blog/${id}/delete/`, config)
      .then((res) => {
        // need to trigger reload in menu items
        setBlog(res.data);
      })
      .catch((err) => {
        setBlog(err.response);
      });
  };

  return (
    <Stack>
      <Box
        boxShadow="dark-lg"
        p="2"
        background={colors.purple.medium}
        borderRadius="lg"
      >
        <Flex justifyContent="space-between">
          <Stack>
            <Text color="white" fontSize="lg" fontWeight="bold">
              {title}
            </Text>
            <Text
              isTruncated
              color="white"
              fontSize="md"
              maxWidth="110vh"
              style={{ marginLeft: "2rem" }}
            >
              {contents}
            </Text>
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
              {!isOwner ? (
                <Button
                  leftIcon={<FaHeart />}
                  background={colors.black.dark}
                  color="white"
                  opacity="0.7"
                  variant="solid"
                  _hover={{ opacity: "1" }}
                >
                  LIKE
                </Button>
              ) : (
                <IconButton
                  background={colors.black.dark}
                  colorScheme="blue"
                  opacity="0.7"
                  icon={<FaTrashAlt />}
                  _hover={{ opacity: "1" }}
                  onClick={() => {
                    deleteBlog();
                  }}
                />
              )}
            </HStack>
          </Stack>
          <Box>
            <Image
              borderRadius="1rem"
              width="250px"
              height="150px"
              src={banner}
            />
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
}

export default BlogSmall;
