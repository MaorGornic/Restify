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
import React, { useState } from "react";
import {
  FaHome,
  FaNewspaper,
  FaUtensils,
  FaCaretDown,
  FaUserCircle,
} from "react-icons/fa";
import Notification from "./Notification";

function NavBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name");

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
          <Input
            placeholder="Search"
            _placeholder={{ color: "black" }}
            size="md"
            onChange={(event) => {
              setSearchQuery(event.target.value);
            }}
            style={{
              width: "250px",
              fill: "white",
              marginLeft: "1rem",
              marginTop: "0.5rem",
              background: "white",
              color: "black",
            }}
          />
          <Select
            border="none"
            color="white"
            placeholder=""
            width="25px"
            onChange={(event) => {
              setSearchType(event.target.value);
            }}
            textColor={colors.purple.medium}
            _focus={{ outline: "none" }}
          >
            <option value="name">Filter by name</option>
            <option value="food">Filter by food</option>
            <option value="address">Filter by postal code</option>
          </Select>
          <Button
            style={{
              marginLeft: "-0.2rem",
              marginTop: "0.5rem",
              background: colors.grey.light,
              color: "white",
              fontWeight: "normal",
            }}
            onClick={() => {
              if (!searchQuery) {
                navigate("/restaurants");
              } else {
                navigate(
                  `/restaurants/search?type=${searchType}&${searchType}=${searchQuery}`
                );
              }
            }}
          >
            SEARCH
          </Button>
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
              Todd
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Edit Profile</MenuItem>
              <MenuItem onClick={() => navigate("/login")}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
}

export default NavBar;
