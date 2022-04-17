import { Box, Spinner, Center, Stack } from "@chakra-ui/react";
// import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Comment from "../components/Comment";
import * as constants from "../utils/constants";
import BlogSmall from "./BlogSmall";

function Comments({ id }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsReq, setBlogsReq] = useState([]);
  const [loading, setLoading] = useState(false);

  const getBlogs = (searchUrl) => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setBlogsReq(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    if (currentPage) {
      getBlogs(
        `http://127.0.0.1:8000/restaurants/${id}/blog/?page=${currentPage}`
      );
    } else {
      getBlogs(`http://127.0.0.1:8000/restaurants/${id}/blog/`);
    }
  }, [currentPage]);

  return (
    <Box>
      {!loading ? (
        <Box>
          <Box
            overflowY={blogsReq.count > 3 ? "scroll" : "none"}
            h="70vh"
            mt="1"
          >
            <Stack mt="1.2rem" ml="2" mr="2">
              {blogsReq.count > 0 &&
                blogsReq.results.map((blog) => (
                  <BlogSmall
                    title={blog.title}
                    contents={blog.contents}
                    banner={blog.banner}
                  />
                ))}
              <Center
                marginBottom="0.5rem"
                marginTop="0.5rem"
                marginRight="30%"
              >
                {blogsReq.count > 0 && (
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={blogsReq.count}
                    pageSize={constants.pageSize}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                )}
              </Center>
            </Stack>
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

export default Comments;
