import { useState, useContext, createContext } from "react";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import UserPage from './components/UserPage';
import ErrorPage from './components/Error';
import Layout from "./components/Layout";
import TasksPage from "./components/TasksPage";
import RequestsPage from "./components/RequestsPage";
import AdminRequestsPage from "./components/AdminRequestsPage";


export const LoginContext = createContext(null);

export const App = () => {
  const router = createBrowserRouter([
    {
      path:'/',
      element:<Layout/>,
      children:[
        {
          path:'users',
          element:<UserPage/>
        },
        {
          path:'tasks',
          element:<TasksPage/>
        },
        {
          path:'requests',
          element:<RequestsPage/>
        },
        {
          path:'requests-admin',
          element:<AdminRequestsPage/>
        }
      ]
    }
  ])
  
  const [loggerData, setLoggerData] = useState({
    success:false,
    loginData:{}
  });
  return(
    <Flex>
      <LoginContext.Provider value={{loggerData, setLoggerData}}>
      <RouterProvider router={router} />
      </LoginContext.Provider>
    </Flex>
  )
}
  
