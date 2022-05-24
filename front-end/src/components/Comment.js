import { Box, Stack, Text, Badge, HStack, IconButton } from "@chakra-ui/react";
import * as colors from "../utils/colors";
import React, { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import axios from "axios";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function Comment({
  authorName,
  timestamp,
  contents,
  isOwner,
  setComment,
  res_id,
  id,
}) {
  const deleteComment = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    };

    axios
      .delete(
        `http://127.0.0.1:8000/restaurants/${res_id}/comments/${id}/remove/`,
        config
      )
      .then((res) => {
        // need to trigger reload in menu items
        setComment(res.data);
      })
      .catch((err) => {
        setComment(err.data);
      });
  };

  return (
    <Stack>
      <Box
        background={colors.purple.medium}
        borderRadius="lg"
        overflow="hidden"
      >
        <HStack>
          <Badge
            marginTop="1rem"
            bg={colors.blue.medium}
            color="white"
            borderRadius="5px"
            fontSize="md"
          >
            {authorName}
          </Badge>
          <Text color="white" size="xs">
            {new Date(timestamp).toUTCString()}
          </Text>

          {isOwner && (
            <IconButton
              style={{ marginTop: ".5rem" }}
              height="3vh"
              colorScheme="blue"
              icon={<FaTrashAlt />}
              onClick={() => {
                deleteComment();
              }}
            />
          )}
        </HStack>
        <Text color="white" marginTop="-0.5rem">
          {contents}
        </Text>
      </Box>
    </Stack>
  );
}

export default Comment;
