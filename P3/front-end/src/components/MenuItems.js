import { Box, Flex, Heading, Spinner, Center } from "@chakra-ui/react";
// import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import MenuItem from "../components/MenuItem";
import Pagination from "../components/Pagination";

let PageSize = 10;

function MenuItems({ id }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [menusReq, setMenusReq] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMenuItems = (searchUrl) => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setMenusReq(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    if (currentPage) {
      getMenuItems(
        `http://127.0.0.1:8000/restaurants/${id}/menu/items/?page=${currentPage}`
      );
    } else {
      getMenuItems(`http://127.0.0.1:8000/restaurants/${id}/menu/items/`);
    }
  }, [currentPage]);

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
          <Center marginBottom="0.5rem" marginTop="0.5rem" marginRight="30%">
            {menusReq.count > 0 && (
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={menusReq.count}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </Center>
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
