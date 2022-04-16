import {
  Box,
  Image,
  Stack,
  Text,
  Badge,
  Flex,
  HStack,
  Textarea,
  Button,
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function Comment({ authorName, timestamp, contents }) {
  return (
    <Stack>
      <Box
        background={colors.purple.medium}
        // maxW="450px"
        // maxHeight="200px"
        // minHeight="260px"
        // borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
      >
        <HStack>
          <Badge
            bg={colors.blue.medium}
            color="white"
            borderRadius="5px"
            fontSize="md"
          >
            {authorName}
          </Badge>
          <Text color="white" size="xs">
            Posted 2 weeks ago
          </Text>
        </HStack>
        <Text color="white" mt="1">
          {contents}
        </Text>
      </Box>
    </Stack>
  );
}

export default Comment;
