import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import { ChakraProvider, theme } from "@chakra-ui/react";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <BrowserRouter style={{ height: "100vh" }}>
        <NavBar />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
