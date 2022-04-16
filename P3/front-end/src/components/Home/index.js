import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Heading, Spacer, Text, Center, Square, Stack, Button } from "@chakra-ui/react";

const Home = () => {
    document.body.style = 'background: rgb(71, 64, 210); background: linear-gradient(to top,rgba(137, 247, 254, 1),rgba(102, 166, 255, 1));';
    return <div className="Landing">
        <Link to="/">
            <Flex>
                <Center w='100px'>
                    <img className="imageLogo" src={require('../../assets/images/logo.png')}
                        width="124" height="120" alt="logo"></img>
                </Center>
                <Square size='150px' >
                    <Text fontSize='4xl' color='white'><h1><b>Resti</b>fy</h1></Text>
                </Square>
            </Flex>
        </Link>

        <Stack spacing={0} className="stacker">
            <Text fontSize='4xl' color='white'>Never stop exploring.</Text>
            <Text fontSize='4xl' color='white'>Trust in <b>Resti</b>fy.</Text>
            <Text fontSize='3xl' color='white'>Hurry up and join our community now!</Text>
        </Stack>
        <Link to="/signup" id="join" className="btn btn-primary"> <Button colorScheme='blue' size='lg'>Join now!</Button> </Link> </div>
}

export default Home;