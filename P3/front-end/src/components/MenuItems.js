import { Box, Flex, Heading, Spinner, Center } from "@chakra-ui/react";
// import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import MenuItem from "../components/MenuItem";

let PageSize = 10;

function MenuItems({ id }) {
  const search = useLocation().search;
  const [menusReq, setMenusReq] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMenuItems = () => {
    setLoading(true);
    axios
      .get(`http://127.0.0.1:8000/restaurants/${id}/menu/items/`)
      .then((res) => {
        setMenusReq(res.data);
        console.log(res.data);
        // console.log(res.data.results);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    getMenuItems();
  }, []);

  //   const getMenuItems = (searchUrl) => {
  //     setLoading(true);
  //     axios
  //       .get(searchUrl)
  //       .then((res) => {
  //         setRestaurantsReq(res.data);
  //         // console.log(res.data.results);
  //         setLoading(false);
  //       })
  //       .catch((err) => {
  //         // TODO
  //       });
  //   };

  //   const [currentPage, setCurrentPage] = useState(1);

  //   useEffect(() => {
  //     // console.log(search);
  //     const filterType = new URLSearchParams(search).get("type");
  //     let searchUrl;

  //     if (filterType) {
  //       searchUrl = `http://localhost:8000/restaurants/search/?${filterType}=${new URLSearchParams(
  //         search
  //       ).get(filterType)}`;
  //       if (currentPage > 1) {
  //         searchUrl = searchUrl.concat(`&?page=${currentPage}`);
  //       }
  //     } else {
  //       searchUrl = "http://localhost:8000/restaurants/search/";
  //       if (currentPage > 1) {
  //         searchUrl = searchUrl.concat(`?page=${currentPage}`);
  //       }
  //     }

  //     getMenuItems(searchUrl);
  //   }, [currentPage, search]);

  return (
    <Box>
      {!loading ? (
        <Box h="280px" overflowY="scroll">
          <Flex wrap="wrap" gap="1.5rem" mt="1.2rem">
            {menusReq.count > 0 &&
              menusReq.results.map((menuItem) => (
                <MenuItem
                  id={menuItem.id}
                  name={menuItem.name}
                  description={menuItem.description}
                  menutImg={menuItem.picture}
                  price={menuItem.price}
                />
              ))}
          </Flex>
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

export default MenuItems;
