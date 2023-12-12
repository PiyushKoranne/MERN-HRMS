import {Flex, Box, Text, VStack, StackDivider, Link} from '@chakra-ui/react'
import {AiOutlineCheckSquare, AiOutlineShoppingCart, AiOutlineUser} from "react-icons/ai";
import { BsFillCursorFill, BsListTask } from 'react-icons/bs';
import {Link as RouterLink} from 'react-router-dom'
import { LoginContext } from '../App';
import {useContext} from 'react';

export default function NavbarItem() {
  const {loggerData} = useContext(LoginContext);

  return (
    <VStack
      divider={<StackDivider borderColor='gray.600' />}
      width='100%'
      align='stretch'
      spacing={0}
    >
    <Link as={RouterLink} to='/users' _hover={{textDecor:'none'}}>
    <Flex _hover={{bg:'gray.800'}} w='100%' h='80px' alignItems='center' justifyContent='start' p='10px 20px'>
        <Box><AiOutlineUser/></Box>
        <Box ml='20px'><Text>Users</Text></Box>
    </Flex>
    </Link>
    <Link as={RouterLink} to='/tasks' _hover={{textDecor:'none'}}>
    <Flex _hover={{bg:'gray.800'}} w='100%' h='80px' alignItems='center' justifyContent='start' p='10px 20px'>
        <Box><BsListTask/></Box>
        <Box ml='20px'><Text>Tasks</Text></Box>
    </Flex>
    </Link>
    <Link as={RouterLink} to={loggerData?.loggerData.role === "Admin"? '/requests-admin':'/requests'} _hover={{textDecor:'none'}}>
    <Flex _hover={{bg:'gray.800'}} w='100%' h='80px' alignItems='center' justifyContent='start' p='10px 20px'>
        <Box><BsFillCursorFill/></Box>
        <Box ml='20px'><Text>Requests</Text></Box>
    </Flex>
    </Link>
    </VStack>
  )
}
