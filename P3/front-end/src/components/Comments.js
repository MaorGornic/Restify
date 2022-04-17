import {
  Box,
  Flex,
  Heading,
  Spinner,
  Center,
  Textarea,
  Stack,
  Button,
  HStack,
} from "@chakra-ui/react";
// import Pagination from "../components/Pagination";
import * as colors from "../utils/colors";
import axios from "axios";
import React, { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import Comment from "../components/Comment";

let PageSize = 10;

function Comments({ id, isOwner }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [commentsReq, setCommentsReq] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [comment, setComment] = useState("");
  const [commentState, setCommentSate] = useState(false);

  const submitComment = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    };
    axios
      .post(
        `http://127.0.0.1:8000/restaurants/${id}/comments/new/`,
        { contents: comment },
        config
      )
      .then((res) => {
        setCommentsReq(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        // TODO
      });
  };

  const getComments = (searchUrl) => {
    setLoading(true);
    axios
      .get(searchUrl)
      .then((res) => {
        setCommentsReq(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    if (currentPage) {
      getComments(
        `http://127.0.0.1:8000/restaurants/${id}/comments/all/?page=${currentPage}`
      );
    } else {
      getComments(`http://127.0.0.1:8000/restaurants/${id}/comments/all/`);
    }
  }, [currentPage, changed, commentState]);

  return (
    <Box>
      {!loading ? (
        <Box>
          {!isOwner && (
            <Stack>
              <HStack>
                <Textarea
                  resize="horizontal"
                  variant="filled"
                  width="80vh"
                  maxWidth="100vh"
                  minWidth="60vh"
                  placeholder="Add comment"
                  size="md"
                  color="white"
                  onChange={(event) => setComment(event.target.value)}
                />
                <Button
                  disabled={!window.sessionStorage.getItem("token")}
                  bg={colors.blue.medium}
                  color="white"
                  _hover={{ transform: "scale(1.05)" }}
                  onClick={async () => {
                    await submitComment();
                    setLoading(true);
                    await new Promise((r) => {
                      setTimeout(r, 1000);
                    });
                    setLoading(false);

                    // wait for a bit
                    setChanged(!changed);
                  }}
                >
                  Comment
                </Button>
              </HStack>
            </Stack>
          )}
          <Box
            overflowY={commentsReq.count > 5 ? "scroll" : "none"}
            h="50vh"
            mt="1"
          >
            <Stack mt="1.2rem">
              {commentsReq.count > 0 &&
                commentsReq.results.map((comment) => (
                  <Comment
                    authorName={`${comment.user.first_name} ${comment.user.last_name}`}
                    timestamp={comment.timestamp}
                    contents={comment.contents}
                    res_id={id}
                    id={comment.id}
                    setComment={setCommentSate}
                    isOwner={isOwner}
                  />
                ))}
            </Stack>
            <Center marginBottom="0.5rem" marginTop="0.5rem" marginRight="30%">
              {commentsReq.count > 0 && (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={commentsReq.count}
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

export default Comments;
