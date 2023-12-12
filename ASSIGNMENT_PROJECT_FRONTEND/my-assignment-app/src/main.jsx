import React,{useState, createContext} from 'react'
import ReactDOM from 'react-dom/client'
import {App} from './App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './styles/style';
import "@fontsource/poppins";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>  
    <ChakraProvider theme={theme}>
    <App/>
    </ChakraProvider>
  </React.StrictMode>,
)
