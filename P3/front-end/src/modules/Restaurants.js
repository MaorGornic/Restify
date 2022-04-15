import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import RestaurantCard from "../components/RestaurantCard";
import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RestaurantsNavBar from "../components/RestaurantsNavBar";

let PageSize = 10;

function Restaurants() {
  const search = useLocation().search;
  // console.log(search);
  const filterType = new URLSearchParams(search).get("type");
  let searchUrl = `http://localhost:8000/restaurants/search/?${filterType}=${new URLSearchParams(
    search
  ).get(filterType)}`;

  const [restaurants, setRestaurants] = useState([]);
  // const [query, setQuery] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRestaurants = () => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setRestaurants(res.data.results);
        // console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    getRestaurants();
  }, [window.location.pathname]);

  // const getGroupData = (targetGroupId) => {
  //   if (!groups || !targetGroupId) return undefined;

  //   const foundGroup = groups.find(
  //     (group) =>
  //       group._id === targetGroupId &&
  //       group.location &&
  //       "lat" in group.location &&
  //       "lng" in group.location
  //   );

  //   if (!foundGroup) return undefined;

  //   return {
  //     ...foundGroup.location,
  //     metaData: { ...foundGroup },
  //     _id: foundGroup._id,
  //   };
  // };

  // const [currentPage, setCurrentPage] = useState(1);

  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * PageSize;
  //   const lastPageIndex = firstPageIndex + PageSize;
  //   return data.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage]);

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
          <Flex justify="space-between" wrap="wrap" gap="1rem">
            <Heading as="h3" size="lg" style={{ color: colors.purple.medium }}>
              Restaurants{" "}
              {/* TODO: Add no restaurants if there is none in the db */}
            </Heading>
          </Flex>

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
              {restaurants.length > 0 &&
                restaurants.map((restraurant) => (
                  <RestaurantCard
                    title={restraurant.name}
                    isLiked={true} // need to check if the currently logged in user likes this restaurant
                    views={restraurant.views}
                    restaurantImg={restraurant.logo}
                  />
                ))}

              {/* <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={data.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          /> */}
            </Flex>
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
