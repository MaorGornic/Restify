import { Box, Image, Stack, Text, Badge, Flex, HStack } from "@chakra-ui/react";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCommentDots, FaQuestionCircle } from "react-icons/fa";
import React, { useState } from "react";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function MenuItem({ menutImg, name, description, price, id }) {
  const navigate = useNavigate();

  return (
    <Stack>
      <Box
        background={colors.purple.medium}
        maxW="450px"
        maxHeight="200px"
        // minHeight="260px"
        // borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        // style={{ cursor: "pointer" }}
        _hover={{ transform: "scale(1.01)" }}
        // onClick={() => navigate(`/restaurants/${id}`)}
      >
        <Flex>
          <Image
            style={{ marginTop: "auto" }}
            borderRadius="2rem"
            width="270px"
            // objectFit="cover"
            // height="200px"
            marginTop="1.4rem"
            src={menutImg}
            ml="3"
            mb="3"
          />
          <Box ml="3">
            <Badge
              mt="4"
              bg={colors.blue.medium}
              color="white"
              borderRadius="5px"
            >
              Dish Name
            </Badge>
            <Text isTruncated fontWeight="bold" color="white" fontSize="sm">
              {name}
            </Text>
            <Badge bg={colors.blue.medium} color="white" borderRadius="5px">
              Description
            </Badge>
            <Text maxW="240px" color="white" fontSize="sm">
              {description}
            </Text>
            <Badge bg={colors.blue.medium} color="white" borderRadius="5px">
              Price
            </Badge>
            <Text maxW="240px" color="white" fontSize="sm">
              {`\$${price}`}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Stack>
  );
}

export default MenuItem;
