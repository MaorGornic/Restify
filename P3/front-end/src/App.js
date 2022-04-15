import { BrowserRouter } from "react-router-dom";
import RestaurantsNavBar from "./components/RestaurantsNavBar";
import Restaurants from "./modules/Restaurants";
import { ChakraProvider, theme } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        {/* <RestaurantsNavBar /> */}
        <Restaurants />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
