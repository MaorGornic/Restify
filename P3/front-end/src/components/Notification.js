import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import Box ui component?
import { Box} from "@chakra-ui/react";

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
      getNotifications(`http://127.0.0.1:8000/accounts/notifications/?page=${currentPage}`);
    } else {
      getNotifications(`http://127.0.0.1:8000/accounts/notifications/`);
  }}, [currentPage]);

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
          <Center>
          </Center>
        ) : (
          <Box>
            {notifReq.count > 0 &&
              notifReq.results.map((notif) => (
                // create PopoverBody element with notification details
                <PopoverBody>
                  <VStack>
                    <Text fontSize="sm">{notif.type}</Text>
                    <Text fontSize="sm">{notif.created_at}</Text>
                  </VStack>
                </PopoverBody>
              ))}
          </Box>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
