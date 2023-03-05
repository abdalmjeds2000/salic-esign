import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useStateContext } from "./context/ContextProvider";
import AppRoutes from './Routes/Routes';
import { ColorModeScript } from '@chakra-ui/react';
import theme from './chakraTheme';

function App() {
  const { currentMode } = useStateContext();

  useEffect(() => {
    document.addEventListener("contextmenu", e => e.preventDefault());
  }, []);
  return (
    <BrowserRouter>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <div className={currentMode}>
        <ChakraProvider>
          <AppRoutes />
        </ChakraProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
