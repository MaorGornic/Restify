import {
  Box,
  Image,
  Stack,
  Text,
  Badge,
  Flex,
  Input,
  Button,
  Heading,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaCommentDots, FaQuestionCircle } from "react-icons/fa";
import axios from "axios";
import React, { useState } from "react";

/* Used https://chakra-ui.com/docs/components/layout/box as a reference*/
function MenuItem({
  menutImg,
  name,
  description,
  price,
  id,
  isOwner,
  res_id,
  setMenuItem,
}) {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const [isUpdated, setIsUpdated] = useState(false);

  const [dishName, setDishName] = useState(name);
  const [descriptionState, setDescriptionState] = useState(description);
  const [priceState, setPriceState] = useState(price);
  const [menuItemPicture, setMenuItemPicture] = useState(null);

  const editMenuItem = () => {
    const configModified = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        "content-type": "multipart/form-data",
      },
    };

    let formData = new FormData();
    if (dishName) formData.append("name", dishName);

    if (priceState) formData.append("price", priceState);

    if (descriptionState) formData.append("description", descriptionState);

    if (menuItemPicture) formData.append("picture", menuItemPicture);

    axios
      .patch(
        `http://127.0.0.1:8000/restaurants/${res_id}/menu/${id}/edit/`,
        formData,
        configModified
      )
      .then((res) => {
        // need to trigger reload in menu items
        setMenuItem(res.data);
        onClose();
      })
      .catch((err) => {
        if (err.response.status === 400) {
          alert(
            "Invalid input was provided. Please provide valid input and try again!"
          );
        }
      });
  };

  const deleteMenuItem = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    };

    axios
      .delete(
        `http://127.0.0.1:8000/restaurants/${res_id}/menu/${id}/remove/`,
        config
      )
      .then((res) => {
        // need to trigger reload in menu items
        setMenuItem(res.data);
        onClose();
      })
      .catch((err) => {
        setMenuItem(err.data);
        onClose();
      });
  };

  function deployModal() {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit menu item </ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
              <Heading
                marginTop="0.5rem"
                as="h3"
                size="sm"
                style={{ color: "black", opacity: "0.6" }}
              >
                Dish Name
              </Heading>
              <Input
                size="md"
                defaultValue={dishName}
                placeholder="Pizza"
                onChange={(event) => setDishName(event.target.value)}
                style={{
                  fill: "white",
                  marginTop: "0.5rem",
                  background: "white",
                  color: "black",
                }}
              />
              <Heading
                marginTop="0.5rem"
                as="h3"
                size="sm"
                style={{ color: "black", opacity: "0.6" }}
              >
                Description
              </Heading>
              <Textarea
                defaultValue={description}
                onChange={(event) => setDescriptionState(event.target.value)}
                placeholder="For only $12, you can get a large pizza with fresh cheese"
                maxHeight="30vh"
                size="sm"
              />
              <Heading
                marginTop="0.5rem"
                as="h3"
                size="sm"
                style={{ color: "black", opacity: "0.6" }}
              >
                Price
              </Heading>
              <Input
                defaultValue={price}
                onChange={(event) => setPriceState(event.target.value)}
                size="md"
                placeholder="12"
                style={{
                  fill: "white",
                  marginTop: "0.5rem",
                  background: "white",
                  color: "black",
                }}
              />
              <Stack>
                <Heading
                  marginTop="0.5rem"
                  as="h3"
                  size="sm"
                  style={{ color: "black", opacity: "0.6" }}
                >
                  Select an image
                </Heading>
                <input
                  onChange={(event) => {
                    setMenuItemPicture(event.target.files[0]);
                  }}
                  type="file"
                  class="form-control"
                  id="customFile"
                  accept="image/*"
                ></input>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Box marginRight="3rem">
                <Button
                  mr={3}
                  onClick={deleteMenuItem}
                  bg="red"
                  color="white"
                  _hover={{ transform: "scale(1.05)" }}
                >
                  DELETE
                </Button>
              </Box>
              <HStack>
                <Button mr={3} onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    editMenuItem();
                  }}
                >
                  SAVE CHANGES
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

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
        _hover={{ transform: "scale(1.01)" }}
        cursor={isOwner ? "pointer" : "default"}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => {
          if (isOwner) {
            // alert("gi");
            onOpen();
            // setIsClicked(true);
          }
        }}
      >
        <Flex>
          <Image
            style={{ marginTop: "auto" }}
            borderRadius="2rem"
            width="270px"
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
      {isOwner && isHovering && (
        <Box bg="grey" opacity="0.6">
          <Text color="white" marginLeft="40%">
            EDIT
          </Text>
        </Box>
      )}
      ){deployModal()}
    </Stack>
  );
}

export default MenuItem;
