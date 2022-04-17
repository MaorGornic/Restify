import {
  Image,
  Text,
  Center,
  IconButton,
  Box,
  Modal,
  HStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  Heading,
  Button,
  Stack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import * as constants from "../utils/constants";
import { FaPlusCircle } from "react-icons/fa";

function CustomCarousel({ id, isOwner }) {
  let lastSlide = 1;
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesReq, setImagesReq] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [picture, setPicture] = useState(null);
  const [newImageId, setNewImageId] = useState(0);

  const addPicture = () => {
    const configModified = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        "content-type": "multipart/form-data",
      },
    };

    let formData = new FormData();
    formData.append("ref_img", picture);

    axios
      .post(
        `http://127.0.0.1:8000/restaurants/${id}/images/upload/`,
        formData,
        configModified
      )
      .then((res) => {
        // need to trigger reload in menu items
        // setMenuItem(res.data);
        setNewImageId(res.data.id);
        onClose();
      })
      .catch((err) => {
        // TODO
      });
  };

  function deployModal() {
    return (
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add image </ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
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
                    setPicture(event.target.files[0]);
                  }}
                  type="file"
                  class="form-control"
                  id="customFile"
                  accept="image/*"
                ></input>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                CANCEL
              </Button>
              <Button colorScheme="blue" mr={3} onClick={addPicture}>
                ADD
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  const getPictures = (searchUrl) => {
    axios
      .get(searchUrl)
      .then((res) => {
        setImagesReq(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    getPictures(
      `http://127.0.0.1:8000/restaurants/${id}/images/?page=${currentPage}`
    );
  }, [currentPage, newImageId]);

  return (
    <Box>
      {imagesReq.count > 0 ? (
        <Carousel
          infiniteLoop
          showArrows={true}
          showThumbs={true}
          onChange={(index) => {
            // If clicked on the right arrow button when at the end
            if (lastSlide + 1 == constants.pageSize && index == 0) {
              lastSlide = 1;
              if (imagesReq.count > 0 && currentPage >= imagesReq.count) return;
              setCurrentPage(currentPage + 1);
              // If clicked on the left arrow button when at the start
            } else if (lastSlide == 0 && index > lastSlide + 1) {
              if (currentPage <= 1) return;
              setCurrentPage(currentPage - 1);
            }

            // Updating the last slide
            lastSlide = index;
          }}
        >
          {imagesReq.count > 0 &&
            imagesReq.results.map((slide, index) => {
              return (
                <Image
                  key={index}
                  src={slide.ref_img}
                  height="70vh"
                  maxWidth="100vh"
                />
              );
            })}
        </Carousel>
      ) : (
        <Center>
          <Stack>
            <Text color="white" fontSize="5xl" marginTop="30vh">
              Not Available
            </Text>
          </Stack>
        </Center>
      )}
      {isOwner && (
        <HStack>
          <IconButton
            style={{ marginTop: ".5rem" }}
            // height="3vh"
            colorScheme="blue"
            icon={<FaPlusCircle />}
            onClick={onOpen}
          />
          <Text color="white">Add Image</Text>
        </HStack>
      )}
      {deployModal()}
    </Box>
  );
}

export default CustomCarousel;
