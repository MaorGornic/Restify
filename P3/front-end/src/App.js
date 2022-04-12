import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Restaurants from "./modules/Restaurants";
import { ChakraProvider, theme } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        <NavBar />
        <Restaurants />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
