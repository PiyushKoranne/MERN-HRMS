import {Box, Flex, Text} from '@chakra-ui/react'
import NavbarItem from './NavbarItem'

export default function Navbar() {
  return (
    <Flex
        display={{md:'flex', base:'none', sm:'none'}}
        width={{md:"25%", base:'100%', sm:'100%'}}
        height={{md:"100%", base:'10%', sm:'10%'}}
        bg="gray.900"
        flexDir={{md:"column", base:'row', sm:'row'}}
        alignItems="start"
        justifyContent={{md:"start", base:'space-evenly', sm:'space-evenly'}}
        color="gray.50"
        bottom={{base:'0px', sm:'0px', md:''}}
        zIndex={2}
        position={{base:'absolute', sm:'absolute', md:'relative'}}
      >
        <Box display={{base:'none', sm:'none', md:'block'}} w="100%" bg="#2F58CD" padding="10px">
          <Text fontSize="xl" fontWeight="bold">
            Dashboard
          </Text>
        </Box>
        <NavbarItem/>
      </Flex>
  )
}
