import { Flex, Box } from '@chakra-ui/react'
import React, { useContext } from 'react'
import Navbar from './Navbar'
import { Navigate, Outlet } from 'react-router-dom'
import { LoginContext } from '../App'
import LoginPage from './LoginPage'
import NavMobile from './NavMobile'

export default function Layout() {
  const {loggerData} = useContext(LoginContext);
  console.log(loggerData);
    if(loggerData?.success === false){
        return(
      <LoginPage />
    )
    }else {
      return (
      <Flex
      flexDir="row"
      alignItems="center"
      justifyContent="start"
      bg="gray.100"
      width="100vw"
      height="100vh"
      overflow='auto'
      // position='relative'
    >
      <Navbar />
      <Flex
        w={{md:"75%", base:'100%', sm:"100%"}}
        h="100%"
        flexDir="column"
        alignItems="start"
        justifyContent="start"
        p='10px'
        overflow='auto'
      >
        <Outlet/>
      </Flex>
    </Flex>
  
    )
  }
  
}
