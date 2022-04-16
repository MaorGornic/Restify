import { Route, Routes, BrowserRouter } from "react-router-dom";
import RestaurantsNavBar from "./components/RestaurantsNavBar";
import Restaurants from "./modules/Restaurants";
import { ChakraProvider, theme } from "@chakra-ui/react";
import RestaurantView from "./modules/RestaurantView";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        <Routes>
          <Route path="/restaurants" element={<Restaurants />}></Route>
          <Route path="/restaurants/:id" element={<RestaurantView />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
