import { Box, Flex, Heading, Spinner, Center, Text } from "@chakra-ui/react";
import RestaurantCard from "../components/RestaurantCard";
import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantsNavBar from "../components/RestaurantsNavBar";

let PageSize = 10;

function Restaurants() {
  // const [searchUrl, setearchUrl] = useState([]);
  const search = useLocation().search;
  const [restaurantsReq, setRestaurantsReq] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRestaurants = (searchUrl) => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setRestaurantsReq(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const filterType = new URLSearchParams(search).get("type");
    let searchUrl;

    if (filterType) {
      searchUrl = `http://localhost:8000/restaurants/search/?${filterType}=${new URLSearchParams(
        search
      ).get(filterType)}`;
      if (currentPage > 1) {
        searchUrl = searchUrl.concat(`&?page=${currentPage}`);
      }
    } else {
      searchUrl = "http://localhost:8000/restaurants/search/";
      if (currentPage > 1) {
        searchUrl = searchUrl.concat(`?page=${currentPage}`);
      }
    }

    getRestaurants(searchUrl);
  }, [currentPage, search]);

  return (
    <Box>
      <RestaurantsNavBar />
      {!loading ? (
        <Box
          style={{
            marginLeft: "2rem",
            width: "97%",
            margin: "auto",
            marginTop: "1.5rem",
          }}
        >
          {restaurantsReq.count > 0 ? (
            <Flex justify="space-between" wrap="wrap" gap="1rem">
              <Heading
                as="h3"
                size="lg"
                style={{ color: colors.purple.medium }}
              >
                Restaurants
                {/* TODO: Add no restaurants if there is none in the db */}
              </Heading>
            </Flex>
          ) : (
            <Center>
              <Text
                color={colors.purple.medium}
                fontSize="5xl"
                marginTop="35vh"
              >
                Nothing to show
              </Text>
            </Center>
          )}

          <Box
            id="restaurants"
            style={{
              marginTop: "1rem",
              height: "70vh",
            }}
          >
            <Flex
              style={{
                flexWrap: "wrap",
              }}
              gap="0.5rem"
            >
              {restaurantsReq.count > 0 &&
                restaurantsReq.results.map((restraurant, index) => (
                  <RestaurantCard
                    key={index}
                    id={restraurant.id}
                    title={restraurant.name}
                    likes={restraurant.likes.length}
                    restaurantImg={restraurant.logo}
                  />
                ))}
            </Flex>
            <Center marginBottom="25px">
              {restaurantsReq.count > 0 && (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={restaurantsReq.count}
                  pageSize={PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </Center>
          </Box>
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

export default Restaurants;
