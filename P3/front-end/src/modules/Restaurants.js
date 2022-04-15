import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import RestaurantCard from "../components/RestaurantCard";
import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";

let PageSize = 10;

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [query, setQuery] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRestaurants = () => {
    setLoading(true);
    axios
      .get("http://localhost:8000/restaurants/search/")
      .then((res) => {
        // setGroups(res.data);
        setRestaurants(res.data.results);
        console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          // dispatch(logout());
          // navigate('/login');
        }
      });
  };

  useEffect(() => {
    getRestaurants();
  }, [query]);

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

  return !loading ? (
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

          {/* // FOR NOW FIX RESULTS */}
          {/* <RestaurantCard
            title="Wendy's"
            isLiked={true} // need to check if the currently logged in user likes this restaurant
            restaurantImg="https://sportshub.cbsistatic.com/i/2021/03/18/e88fe780-c0b0-4604-8ca6-bc1f0e9aea31/wendys-logo-1243805.jpg"
          />
          <RestaurantCard
            title="Wendy's"
            restaurantImg="https://sportshub.cbsistatic.com/i/2021/03/18/e88fe780-c0b0-4604-8ca6-bc1f0e9aea31/wendys-logo-1243805.jpg"
          />
          <RestaurantCard
            title="Wendy's"
            restaurantImg="https://sportshub.cbsistatic.com/i/2021/03/18/e88fe780-c0b0-4604-8ca6-bc1f0e9aea31/wendys-logo-1243805.jpg"
          />
          <RestaurantCard
            title="Five Guys"
            isLiked={true}
            restaurantImg="https://wl3-cdn.landsec.com/sites/default/files/images/shops/logos/five_guys.jpg"
          />
          <RestaurantCard
            title="Wendy's"
            restaurantImg="https://sportshub.cbsistatic.com/i/2021/03/18/e88fe780-c0b0-4604-8ca6-bc1f0e9aea31/wendys-logo-1243805.jpg"
          />
          <RestaurantCard
            title="McDonald's"
            restaurantImg="https://cdn.mos.cms.futurecdn.net/xDGQ9dbLmMpeEqhiWayMRB.jpg"
          />
          <RestaurantCard
            title="Five Guys"
            restaurantImg="https://wl3-cdn.landsec.com/sites/default/files/images/shops/logos/five_guys.jpg"
          />
          <RestaurantCard
            title="McDonald's"
            restaurantImg="https://cdn.mos.cms.futurecdn.net/xDGQ9dbLmMpeEqhiWayMRB.jpg"
          />
          <RestaurantCard
            title="McDonald's"
            restaurantImg="https://cdn.mos.cms.futurecdn.net/xDGQ9dbLmMpeEqhiWayMRB.jpg"
          />
          <RestaurantCard
            title="Five Guys"
            restaurantImg="https://wl3-cdn.landsec.com/sites/default/files/images/shops/logos/five_guys.jpg"
          />
          <RestaurantCard
            title="Five Guys"
            restaurantImg="https://wl3-cdn.landsec.com/sites/default/files/images/shops/logos/five_guys.jpg"
          />
          <RestaurantCard
            title="Five Guys"
            restaurantImg="https://wl3-cdn.landsec.com/sites/default/files/images/shops/logos/five_guys.jpg"
          /> */}
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
    /* Used https://chakra-ui.com/docs/components/feedback/spinner as a reference */
    <Box textAlign="center" marginTop="50vh">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color={colors.purple.medium}
        size="xl"
      />
    </Box>
  );
}

export default Restaurants;
