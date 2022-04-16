import { Route, Routes, BrowserRouter } from "react-router-dom";
import RestaurantsNavBar from "./components/RestaurantsNavBar";
import Restaurants from "./modules/Restaurants";
import { ChakraProvider, theme } from "@chakra-ui/react";
import RestaurantView from "./modules/RestaurantView";
import LandingNavBar from "./components/LandingNavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingLayout from "./components/LandingLayout";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
          <Route path="/restaurants" element={<Restaurants />}></Route>
          <Route path="/restaurants/:id" element={<RestaurantView />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
