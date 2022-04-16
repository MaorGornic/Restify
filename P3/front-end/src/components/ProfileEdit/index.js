import React from "react";
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios";
import { useMemo, useState, useEffect, useLocation } from "react";
import { Box, Flex, Heading, Spacer, Text, Center, Square } from "@chakra-ui/react";
import MainNavBar from "../MainNavBar";

const ProfileEdit = () => {
    console.log("edit");
    return (
        <Box>
            <MainNavBar>
                <h3>Hello</h3>
            </MainNavBar>
        </Box>
    );
}

export default ProfileEdit;
