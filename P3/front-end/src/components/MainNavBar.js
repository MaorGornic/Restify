import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Input,
  Button,
  ButtonGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Select,
} from "@chakra-ui/react";
import logo from "../assets/images/logo.png";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import React from "react";
import {
  FaHome,
  FaNewspaper,
  FaUtensils,
  FaCaretDown,
  FaUserCircle,
} from "react-icons/fa";
import Notification from "./Notification";
import axios from "axios";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Box bg={colors.purple.medium} h="70px">
      <Flex justify="space-between">
        <HStack>
          <Image
            onClick={() => navigate("/restaurants")}
            style={{
              cursor: "pointer",
              height: "50px",
              marginLeft: "1rem",
              marginTop: ".5rem",
            }}
            src={logo}
            alt="Restify"
          ></Image>
          <Flex>
            <Text
              style={{
                color: "white",
                fontSize: "1.75rem",
                fontWeight: "bold",
              }}
            >
              Resti
            </Text>
            <Text style={{ color: "white", fontSize: "1.75rem" }}>fy</Text>
          </Flex>
          <ButtonGroup
            style={{ marginTop: "0.5rem", marginLeft: "2rem" }}
            spacing={6}
          >
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaHome
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
              onClick={() => navigate("/restaurants")}
            >
              Home
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaNewspaper
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
            >
              Feed
            </Button>
            <Button
              style={{ textDecoration: "none" }}
              leftIcon={
                <FaUtensils
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
              variantColor="teal"
              variant="link"
            >
              My Restaurant
            </Button>
          </ButtonGroup>
        </HStack>
        <Box style={{ marginTop: "1.5rem", marginRight: "4rem" }}>
          <Notification style={{ textDecoration: "none" }} />
          <Menu>
            <MenuButton
              style={{
                marginLeft: "1.5rem",
                color: "white",
                textDecoration: "none",
              }}
              variant="link"
              as={Button}
              rightIcon={<FaCaretDown />}
              leftIcon={
                <FaUserCircle
                  style={{ color: "white", width: "20px", height: "20px" }}
                />
              }
            >
              {window.sessionStorage.getItem("username")}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
              <MenuItem onClick={() => navigate("/profile/edit")}>Edit Profile</MenuItem>
              <MenuItem onClick={() => {
                const config = {
                  headers: {
                    Authorization: `Bearer ${window.sessionStorage.getItem("token")}`,
                  },
                };
                window.sessionStorage.setItem("token", '');
                navigate("/login");
              }}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
}

export default NavBar;
