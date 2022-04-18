import {
  Box,
  Tab,
  Input,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Button,
  Heading,
  Spinner,
  Center,
  Tag,
  TagLabel,
  Image,
  Grid,
  Textarea,
  GridItem,
  Stack,
  HStack,
  IconButton,
  useDisclosure,
  Modal,
  Text,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import { FaHeart, FaUserFriends, FaPlusCircle } from "react-icons/fa";
import * as colors from "../../utils/colors";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import MenuItems from "../../components/MenuItems";
import Comments from "../../components/Comments";
import Carousel from "../../components/Carousel";
import BlogsSmall from "../../components/BlogsSmall";
import { useNavigate } from "react-router-dom";

function RestaurantView() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState([]);
  const [followers, setFollowers] = useState(0);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoveringLogo, setHoveringLogo] = useState(false);

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [menuItemPicture, setMenuItemPicture] = useState(null);

  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAddr, setRestaurantAddr] = useState("");
  const [restaurantPhoneNum, setRestaurantPhoneNum] = useState("");
  const [curRestaurantLogo, setCurNewRestaurantLogo] = useState(null);
  const [newRestaurantLogo, setNewRestaurantLogo] = useState(null);
  const logoChooser = useRef(null);

  const config = {
    headers: {
      Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
    },
  };
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const getOwnedRestaurant = () => {
    setLoading(true);
    axios
      .get("http://127.0.0.1:8000/restaurants/owned/", config)
      .then((res) => {
        if (res.data.id != id || !window.sessionStorage.getItem("token")) {
          navigate("/restaurants");
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 401) {
          navigate("/restaurants");
        }
        // TODO
      });
  };

  const createMenuItem = () => {
    if (!isNaN(price)) {
    }
    setLoading(true);
    const configModified = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
        "content-type": "multipart/form-data",
      },
    };

    let formData = new FormData();
    formData.append("name", dishName);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("picture", menuItemPicture);

    axios
      .post(
        `http://127.0.0.1:8000/restaurants/${id}/menu/new/`,
        formData,
        configModified
      )
      .then((res) => {
        // need to trigger reload in menu items
        onClose();
        setLoading(false);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          alert("Invalid input was entered. Please try again.");
        } else {
          alert("Something went wrong...");
        }

        setLoading(false);
      });
  };

  const getRestaurant = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/info/${id}/`)
      .then((res) => {
        setRestaurant(res.data);

        setRestaurantName(res.data.name);
        setRestaurantAddr(res.data.address);
        setRestaurantPhoneNum(res.data.phone_num);
        setCurNewRestaurantLogo(res.data.logo);

        setFollowers(res.data.followers.length);
        setLikes(res.data.likes.length);

        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  const handleEditConfirm = () => {
    if (
      restaurantName === "" ||
      restaurantAddr === "" ||
      restaurantPhoneNum === ""
    ) {
      alert("Please check that all fields are valid!");
      return;
    }

    setLoading(true);

    let formData = new FormData();
    formData.append("name", restaurantName);
    formData.append("address", restaurantAddr);
    formData.append("phone_num", restaurantPhoneNum);
    if (newRestaurantLogo) formData.append("logo", newRestaurantLogo);

    axios
      .patch(`http://127.0.0.1:8000/restaurants/${id}/edit/`, formData, config)
      .then((res) => {
        setLoading(false);
        navigate(`/restaurants/${id}`);
      })
      .catch((err) => {
        if (err.response.status == 400) {
          alert("Please check that all fields are valid!");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    getOwnedRestaurant();
    getRestaurant();
  }, []);

  return (
    <Box>
      <MainNavBar />
      {!loading ? (
        <Box
          style={{
            marginLeft: "2rem",
            // height: "88vh",
            margin: "auto",
            marginTop: "1rem",
            background: colors.purple.medium,
            height: "100vh",
          }}
        >
          <Grid templateColumns="repeat(5, 1fr)" gap={5}>
            <GridItem rowSpan={2} colSpan={1}>
              <Stack marginLeft="1rem">
                <Heading
                  marginTop="0.5rem"
                  as="h3"
                  size="md"
                  style={{ color: "white" }}
                >
                  Restaurant's Information
                  {/* TODO: Add no restaurants if there is none in the db */}
                </Heading>
                <Box
                  style={{
                    marginTop: "2rem",
                  }}
                  //   boxSize="sm"
                  background="white"
                  borderRadius="4rem"
                  height="200px"
                >
                  <Stack>
                    <input
                      ref={logoChooser}
                      onChange={(event) => {
                        setNewRestaurantLogo(event.target.files[0]);
                        setCurNewRestaurantLogo(
                          URL.createObjectURL(event.target.files[0])
                        );
                      }}
                      type="file"
                      class="form-control"
                      id="customFile"
                      accept="image/*"
                      hidden
                    ></input>
                    <Center>
                      <Image
                        onMouseEnter={() => setHoveringLogo(true)}
                        onMouseLeave={() => setHoveringLogo(false)}
                        borderRadius="2rem"
                        width="250px"
                        height="150px"
                        marginTop="1.4rem"
                        src={curRestaurantLogo}
                        cursor={"pointer"}
                        onClick={() => logoChooser.current.click()}
                      />
                    </Center>
                    {hoveringLogo && (
                      <Center>
                        <Box width="200px" background="grey" opacity="0.8">
                          <Text textAlign="center" color="white">
                            CHANGE
                          </Text>
                        </Box>
                      </Center>
                    )}
                  </Stack>
                </Box>
                <Center>
                  <Heading
                    marginTop="0.5rem"
                    as="h3"
                    size="xs"
                    style={{ color: "white", opacity: "0.75" }}
                  >
                    {restaurant.name}
                  </Heading>
                </Center>

                <Button
                  style={{ marginTop: "1.5rem" }}
                  background={colors.purple.dark}
                  color="white"
                  opacity="0.7"
                  variant="solid"
                  _hover={{ opacity: "1" }}
                  onClick={handleEditConfirm}
                >
                  Confirm
                </Button>

                <Center>
                  <Stack marginTop="2rem" marginBottom="1rem">
                    <Tag size="md" background={colors.grey.dark}>
                      <FaUserFriends color="white" />
                      <TagLabel marginLeft="0.5rem" color="white">
                        {restaurant.followers && `Followers: ${followers}`}
                      </TagLabel>
                    </Tag>
                    <Tag size="md" background={colors.grey.dark}>
                      <FaHeart color="white" />
                      <TagLabel marginLeft="0.5rem" color="white">
                        {restaurant.likes && `Likes: ${likes}`}
                      </TagLabel>
                    </Tag>
                  </Stack>
                </Center>
              </Stack>
            </GridItem>
            <GridItem rowSpan={8} colSpan={4}>
              <Box marginLeft="2rem">
                <Tabs variant="soft-rounded" marginTop="2rem">
                  <TabList color="white">
                    <Tab color="white">GENERAL</Tab>
                    <Tab color="white">COMMENTS</Tab>
                    <Tab color="white">PICTURES</Tab>
                    <Tab color="white">BLOG POSTS</Tab>
                  </TabList>
                  <TabPanels>
                    {/* General */}
                    <TabPanel>
                      <Stack>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="md"
                            style={{ color: "white" }}
                          >
                            Restaurant Name
                          </Heading>
                          <Input
                            size="md"
                            defaultValue={restaurantName && restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            style={{
                              width: "30%",
                              fill: "white",
                              marginTop: "0.5rem",
                              background: "white",
                              color: "black",
                            }}
                          />
                        </Box>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="md"
                            style={{ color: "white" }}
                          >
                            Restaurant Address
                          </Heading>
                          <Input
                            size="md"
                            defaultValue={restaurantAddr && restaurantAddr}
                            onChange={(e) => setRestaurantAddr(e.target.value)}
                            style={{
                              width: "30%",
                              fill: "white",
                              marginTop: "0.5rem",
                              background: "white",
                              color: "black",
                            }}
                          />
                        </Box>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="md"
                            style={{ color: "white" }}
                          >
                            Restaurant Phone Number
                          </Heading>
                          <Input
                            size="md"
                            onChange={(e) =>
                              setRestaurantPhoneNum(e.target.value)
                            }
                            defaultValue={
                              restaurantPhoneNum && restaurantPhoneNum
                            }
                            style={{
                              width: "30%",
                              fill: "white",
                              marginTop: "0.5rem",
                              background: "white",
                              color: "black",
                            }}
                          />
                        </Box>
                        <Box>
                          <HStack>
                            <Heading
                              marginTop="0.5rem"
                              as="h3"
                              size="md"
                              style={{ color: "white" }}
                            >
                              Menu
                            </Heading>
                            <IconButton
                              style={{ marginTop: ".5rem" }}
                              height="3vh"
                              colorScheme="blue"
                              icon={<FaPlusCircle />}
                              onClick={onOpen}
                            />
                          </HStack>
                          <MenuItems res_id={id} isOwner />
                        </Box>
                      </Stack>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Add new menu item </ModalHeader>
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
                              placeholder="Pizza"
                              onChange={(event) =>
                                setDishName(event.target.value)
                              }
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
                              onChange={(event) =>
                                setDescription(event.target.value)
                              }
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
                              onChange={(event) => setPrice(event.target.value)}
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
                            <Button mr={3} onClick={onClose}>
                              CANCEL
                            </Button>
                            <Button
                              colorScheme="blue"
                              mr={3}
                              onClick={() => {
                                createMenuItem();
                              }}
                            >
                              CONFIRM CHANGES
                            </Button>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>
                    </TabPanel>
                    {/* Comments */}
                    <TabPanel>
                      <Comments id={id} isOwner />
                    </TabPanel>
                    {/* Pictures */}
                    <TabPanel>
                      <Carousel res_id={id} isOwner />
                    </TabPanel>
                    {/* Blog posts */}
                    <TabPanel>
                      <BlogsSmall id={id} isOwner />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </GridItem>
          </Grid>
        </Box>
      ) : (
        <Box textAlign="center" marginTop="50vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color={colors.purple.medium}
            size="xl"
          />
        </Box>
      )}
    </Box>
  );
}

export default RestaurantView;
