import {
  Box,
  Image,
  Stack,
  ButtonGroup,
  IconButton,
  Flex,
  HStack,
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCommentDots, FaQuestionCircle } from "react-icons/fa";
import React, { useState } from "react";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function RestaurantCard({ restaurantImg, title, isLiked, views }) {
  const navigate = useNavigate();
  const [isLikedState, setIsLikedState] = useState(isLiked);

  const property = {
    imageUrl: restaurantImg,
    title: title,
  };

  return (
    <Stack marginBottom="1rem">
      <Box
        background={colors.purple.medium}
        maxW="285px"
        maxHeight="300px"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        style={{ cursor: "pointer" }}
        _hover={{ transform: "scale(1.02)" }}
      >
        <Image src={property.imageUrl} height="165px" width="285px" />
        <Box p="6">
          <Box display="flex" alignItems="baseline"></Box>
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
            color="white"
            align="center"
          >
            {property.title}
          </Box>
          <Box display="flex" mt="2" alignItems="center">
            <Box as="span" ml="2" color="gray.500" fontSize="sm">
              {views} views
            </Box>
          </Box>
        </Box>
      </Box>
      <Box boxShadow="dark-lg" p="2" rounded="md" bg="white">
        <HStack>
          <IconButton
            marginRight="9rem"
            variant="link"
            aria-label="like"
            opacity={isLikedState ? "100%" : "50%"}
            onClick={() => setIsLikedState(!isLikedState)}
            _hover={{ transform: "scale(1.25)" }}
            _focus={{ outline: "none" }}
            icon={
              <FaHeart
                style={{
                  color: colors.purple.medium,
                  width: "25px",
                  height: "25px",
                }}
              />
            }
          />

          <Flex>
            <IconButton
              variant="link"
              aria-label="like"
              _hover={{ transform: "scale(1.25)" }}
              _focus={{ outline: "none" }}
              icon={
                <FaCommentDots
                  style={{
                    color: colors.purple.medium,
                    width: "25px",
                    height: "25px",
                  }}
                />
              }
            />
            <IconButton
              variant="link"
              aria-label="like"
              _hover={{ transform: "scale(1.25)" }}
              _focus={{ outline: "none" }}
              icon={
                <FaQuestionCircle
                  style={{
                    color: colors.purple.medium,
                    width: "25px",
                    height: "25px",
                  }}
                />
              }
            />
          </Flex>
        </HStack>
      </Box>
    </Stack>
  );
}

export default RestaurantCard;