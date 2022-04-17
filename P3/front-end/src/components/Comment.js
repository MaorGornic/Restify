import { Box, Stack, Text, Badge, HStack } from "@chakra-ui/react";
import * as colors from "../utils/colors";
import React, { useState } from "react";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function Comment({ authorName, timestamp, contents }) {
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
            Posted 2 weeks ago
          </Text>
        </HStack>
        <Text color="white" marginTop="-0.5rem">
          {contents}
        </Text>
      </Box>
    </Stack>
  );
}

export default Comment;
