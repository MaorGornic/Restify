import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Box ui component?
import { Box, useDisclosure } from "@chakra-ui/react";
// add AlertDescription, AlertTitle, AlertIcon
// add Divider
import { AlertIcon, AlertTitle, AlertDescription } from "@chakra-ui/react";

// A notificiation component with pagination and a popover

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

  // Return notificiations paginated component with a popover
  // When scrolling through notifications, the current page is updated 
  // with more API requests
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
      <PopoverContent className="popoverClass">
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />

        {loading ? (
          <Center></Center>
        ) : (
          <Box>
            {notifReq.count > 0 &&
              notifReq.results.map((notif) => (
                <Alert
                  key={notif.id}
                  status={notif.viewed ? "success" : "info"}
                  mb={2}
                  cursor="pointer"
                  onClick={() => {
                    if (!notif.viewed) {
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
                          navigate(`/restaurants/${notif.restaurant.id}/`);
                        })
                        .catch((err) => {
                          // TODO
                        });
                    }
                    navigate(`/restaurants/${notif.restaurant.id}/`);
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
            {/* Pagination button to increase current page */}
            {notifReq.next && (
              <Button
                variant="link"
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  document.getElementsByClassName("popoverClass")[0].focus();

                }}
              >
                Next
              </Button>
            )}
            {/* Pagination button to go back to the previous page */}
            {notifReq.previous && (
              <Button
                variant="link"
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  document.getElementsByClassName("popoverClass")[0].focus();
                  // focus on the notificiation popup element

                }}
              >
                Previous
              </Button>
            )}
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
