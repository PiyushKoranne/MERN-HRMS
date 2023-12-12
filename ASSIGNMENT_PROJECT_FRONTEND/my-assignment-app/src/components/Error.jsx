import {Flex, Box, Text, Heading, Button, Link} from '@chakra-ui/react'

export default function ErrorPage() {
  return (
    <Flex
    w='100vw'
    h='100vh'
    flexDir='column'
    alignItems='center'
    justifyContent='center'
    >
        <Box><Heading>Error. Page Not Found</Heading></Box>
        <Box mt='20px'><Text>We cant seem to find the page that you are looking for.</Text></Box>
        <Box mt='20px'><Link href="/"><Button variant='solid' colorScheme='blue'>Back Home</Button></Link></Box>
    </Flex>
  )
}
