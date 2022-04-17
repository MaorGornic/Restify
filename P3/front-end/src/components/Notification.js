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
    let message = "";
    if (notif.type === "LIKEDRES") {
      message = `${notif.actor_user.username} liked your restaurant`;
    } else if (notif.type === "FOLLOWED") {
      message = `${notif.actor_user.username} followed your restaurant`;
    } else if (notif.type === "COMMENTED") {
      message = `${notif.actor_user.username} commented on your restaurant`;
    } else if (notif.type === "LIKEDBLOG") {
      message = `${notif.actor_user.username} liked your blog`;
    } else if (notif.type === "MENUUPDATE") {
      message = `${notif.restaurant.name} updated their menu`;
    } else if (notif.type === "NEWBLOG") {
      message = `${notif.restaurant.name} posted a new blog post`;
    }
    else {   // should never be reached unless there is a bug
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
                // If notif.view is set to true then the notification has been viewed, 
                // so we should set the background color to white. Otherwise, use blue 
                // background color.
                <Alert
                  key={notif.id}
                  status={notif.viewed ? "success" : "info"}
                  mb={2}
                  cursor="pointer"
                  onClick={() => {
                    if (!notif.viewed) {
                      // If the notification has been viewed, we should set the view to false
                      // and then update the notification.
                      notif.viewed = true;
                      axios
                        .patch(
                          `http://127.0.0.1:8000/accounts/notifications/viewed/${notif.id}/`,
                          notif,
                          {
                            headers: {
                              Authorization: `Bearer ${window.sessionStorage.getItem(
                                "token"
                              )}`,
                            },
                          }
                        )
                        .then((res) => {
                          // TODO
                        })
                        .catch((err) => {
                          // TODO
                        });
                    }
                    navigate(`/restaurants/${notif.restaurant.id}`);
                  }}
                >
                  <AlertIcon />
                  <AlertTitle>{constructNotificationMessage(notif)}</AlertTitle>
                </Alert>
              ))}
            {notifReq.count === 0 && (
              <Alert status="info">
                <AlertIcon />
                <AlertTitle>No notifications</AlertTitle>
                <AlertDescription>
                  You have no notifications at this time.
                </AlertDescription>
              </Alert>
            )}
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
