import { Route, Routes, BrowserRouter } from "react-router-dom";
import RestaurantsNavBar from "./components/RestaurantsNavBar";
import Restaurants from "./modules/Restaurants";
import { ChakraProvider, theme } from "@chakra-ui/react";
import RestaurantView from "./modules/RestaurantView";
import RestaurantEditView from "./modules/RestaurantEditView";
import LandingNavBar from "./components/LandingNavBar";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import LandingLayout from "./components/LandingLayout";
import Profile from "./components/Profile";
import ProfileEdit from "./components/ProfileEdit";
import RestaurantCreate from "./components/RestaurantCreate";


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
          <Route path="/restaurants/search" element={<Restaurants />}></Route>
          <Route path="/restaurants/:id" element={<RestaurantView />}></Route>
          <Route
            path="/restaurants/:id/edit"
            element={<RestaurantEditView />}
          ></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/profile/edit" element={<ProfileEdit />}></Route>
          <Route path="/restaurant/create" element={<RestaurantCreate />}></Route>
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
