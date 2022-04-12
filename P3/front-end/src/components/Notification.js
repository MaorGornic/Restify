import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Notifications</PopoverHeader>
        <PopoverBody>Wendy's added a new item to their menu</PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

export default Notification;
