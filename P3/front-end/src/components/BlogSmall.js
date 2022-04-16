import {
  Box,
  Stack,
  Text,
  Flex,
  Image,
  HStack,
  Button,
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function BlogSmall({ title, contents, banner, id }) {
  const navigate = useNavigate();
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
