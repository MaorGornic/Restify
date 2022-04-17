import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Box ui component?
import { Box } from "@chakra-ui/react";
// add AlertDescription, AlertTitle, AlertIcon
// add Divider
import { AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Divider,
  IconButton,
  Button,
  Alert,
  Center,
  Text,
  Image,
  VStack,
} from "@chakra-ui/react";
import { FaBell } from "react-icons/fa";

function Notification({ style }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [notifReq, setNotifReq] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function constructNotificationMessage(notif) {
    const username = notif.actor_user.username;
    let message = "";
    if (notif.type === "LIKEDRES") {
      message = `${username} liked your restaurant`;
    } else if (notif.type === "FOLLOWED") {
      message = `${username} followed your restaurant`;
    } else if (notif.type === "COMMENTED") {
      message = `${username} commented on your restaurant`;
    } else if (notif.type === "LIKEDBLOG") {
      message = `${username} liked your blog`;
    } else {
      message = `TODO add message for ${notif.type}`;
    }
    return message;
  }

  const getNotifications = (searchUrl) => {
    const config = {
      headers: {
        Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
      },
    };

    setLoading(true);
    axios
      .get(searchUrl, config)
      .then((res) => {
        setNotifReq(res.data);
        setLoading(false);
      })
      .catch((err) => {
        // TODO
      });
  };

  useEffect(() => {
    if (currentPage) {
      getNotifications(
        `http://127.0.0.1:8000/accounts/notifications/?page=${currentPage}`
      );
    } else {
      getNotifications(`http://127.0.0.1:8000/accounts/notifications/`);
    }
  }, [currentPage]);

  // Return the results returned by the notification request inside a popover table
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          variant="link"
          aria-label="notifications"
          style={style}
          icon={
            <FaBell style={{ color: "white", width: "20px", height: "20px" }} />
          }
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />

        {loading ? (
          <Center></Center>
        ) : (
          <Box>
            {notifReq.count > 0 &&
              notifReq.results.map((notif) => (
                // create element with notification details
                // clicking on this element should redirect to http://localhost:3000/restaurants/1
                // change the url to the restaurant id
                <Box
                  cursor="pointer"
                  onClick={() => {
                    navigate(`/restaurants/1`);
                  }}
                >
                  <Alert status="info" variant="left-accent">
                    <AlertIcon />
                    <AlertTitle mr={2}>
                      {constructNotificationMessage(notif)}
                    </AlertTitle>
                  </Alert>
                  <Divider />
                </Box>
              ))}
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
