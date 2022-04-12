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
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import logo from "../assets/images/logo.png";
import * as colors from "../utils/colors";
import { useNavigate } from "react-router-dom";
import React from "react";
import { FaHome, FaNewspaper, FaUtensils } from "react-icons/fa";
import Notification from "./Notification";

function NavBar() {
  const navigate = useNavigate();

  return (
    <Box bg={colors.purple.medium} h="70px">
      <Flex justify="space-between">
        <HStack>
          <Image
            onClick={() => navigate("/")}
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
            style={{
              width: "250px",
              fill: "white",
              marginLeft: "1rem",
              marginTop: "0.5rem",
              background: "white",
              color: "black",
            }}
          />
          <Button
            style={{
              marginTop: "0.5rem",
              background: colors.grey.light,
              color: "white",
              fontWeight: "normal",
            }}
          >
            SEARCH
          </Button>
          <ButtonGroup
            style={{ marginTop: "0.5rem", marginLeft: "2rem" }}
            spacing={6}
          >
            <Button
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
        <Box style={{ marginTop: "1.5rem", marginRight: "5rem" }}>
          <Notification />
          <Menu>
            <MenuButton
              style={{ marginLeft: "2rem" }}
              as={Button}
              rightIcon={<FaHome />}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Box>
  );
}

export default NavBar;
