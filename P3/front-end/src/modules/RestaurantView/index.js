import {
  Box,
  Tab,
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
  GridItem,
  Stack,
} from "@chakra-ui/react";
import { FaHeart, FaUserFriends } from "react-icons/fa";
import * as colors from "../../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MainNavBar from "../../components/MainNavBar";
import MenuItems from "../../components/MenuItems";
import Comments from "../../components/Comments";
import Carousel from "../../components/Carousel";
import BlogsSmall from "../../components/BlogsSmall";

function RestaurantView() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRestaurant = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/info/${id}/`)
      .then((res) => {
        setRestaurant(res.data);
        console.log(res.data);
        // console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    getRestaurant();
  }, []);

  return (
    <Box>
      <MainNavBar />
      {!loading ? (
        <Box
          style={{
            marginLeft: "2rem",
            height: "88vh",
            margin: "auto",
            marginTop: "1rem",
            background: colors.purple.medium,
            height: "100%",
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
                  <Center>
                    <Image
                      borderRadius="2rem"
                      width="250px"
                      height="150px"
                      marginTop="1.4rem"
                      src={restaurant.logo}
                    />
                  </Center>
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
                >
                  Follow
                </Button>
                <Button
                  leftIcon={<FaHeart />}
                  background={colors.purple.dark}
                  color="white"
                  opacity="0.7"
                  variant="solid"
                  _hover={{ opacity: "1" }}
                >
                  Like
                </Button>
                <Center>
                  <Stack marginTop="2rem" marginBottom="1rem">
                    <Tag size="md" background={colors.grey.dark}>
                      <FaUserFriends color="white" />
                      <TagLabel marginLeft="0.5rem" color="white">
                        {restaurant.followers &&
                          `Followers: ${restaurant.followers.length}`}
                      </TagLabel>
                    </Tag>
                    <Tag size="md" background={colors.grey.dark}>
                      <FaHeart color="white" />
                      <TagLabel marginLeft="0.5rem" color="white">
                        {restaurant.likes &&
                          `Likes: ${restaurant.likes.length}`}
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
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="sm"
                            style={{
                              color: "white",
                              opacity: "0.6",
                              marginLeft: "1.5rem",
                            }}
                          >
                            {restaurant.name && restaurant.name}
                          </Heading>
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
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="sm"
                            style={{
                              color: "white",
                              opacity: "0.6",
                              marginLeft: "1.5rem",
                            }}
                          >
                            {restaurant.address && restaurant.address}
                          </Heading>
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
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="sm"
                            style={{
                              color: "white",
                              opacity: "0.6",
                              marginLeft: "1.5rem",
                            }}
                          >
                            {restaurant.phone_num && restaurant.phone_num}
                          </Heading>
                        </Box>
                        <Box>
                          <Heading
                            marginTop="0.5rem"
                            as="h3"
                            size="md"
                            style={{ color: "white" }}
                          >
                            Menu
                          </Heading>
                          <MenuItems id={id} />
                        </Box>
                      </Stack>
                    </TabPanel>
                    {/* Comments */}
                    <TabPanel>
                      <Comments id={id} />
                    </TabPanel>
                    {/* Pictures */}
                    <TabPanel>
                      <Carousel id={id} />
                    </TabPanel>
                    {/* Blog posts */}
                    <TabPanel>
                      <BlogsSmall id={id} />
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
