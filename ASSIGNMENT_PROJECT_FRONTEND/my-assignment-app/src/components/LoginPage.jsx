import {Flex, Box, Button, Heading, Text, Input, FormControl, FormLabel} from '@chakra-ui/react'
import { useState, useContext } from 'react'
import LoginUser from '../services/userService';
import { LoginContext } from '../App';
import { Navigate } from 'react-router-dom';

export default function LoginPage() {
    const [loginData, setLoginData] = useState({
        username:"",
        password:""
    });
    const { loggerData, setLoggerData } = useContext(LoginContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loginForm = {name:loginData.username, password:loginData.password};
        const response = await LoginUser.loginUser(loginForm);
        console.log(response.data);
        if(response.status === 200){
            if(response?.data?.success === true){
                setLoggerData(response?.data);
            }
        }
    }
    if(loggerData.success === false){
        return (
            <Flex
            width={{base:screen.width,sm:screen.width,md:'100vw'}}
            minH={{base:screen.height,sm:screen.height,md:'100vh'}}
            bg='gray.800'
            flexDir='column'
            alignItems='center'
            justifyContent='center'
            position='relative'
            >
                <Flex background='#2F58CD' alignItems='center' justifyContent='center' backgroundClip='text' >
                <Heading size={{base:'lg',sm:'lg',md:'xl'}} top='10px' textColor='transparent' >SCRUM</Heading>
                <Heading size={{base:'lg',sm:'lg',md:'xl'}} color='white' top='10px'>&nbsp; DASHBOARD</Heading>
                </Flex>

                <form onSubmit={handleSubmit}>
                <Flex bg='gray.900' w={{base:'100%',sm:'100%',md:'400px'}} fontSize='sm' m='20px 0px'  borderColor='gray.600' flexDir='column' color='gray.200' alignItems='center' justifyContent='start'  gap='20px' p='20px'>
                        <Box><Heading color='white' size='lg'>Login</Heading></Box>
                        <FormControl isRequired w='full'>
                            <FormLabel fontSize='sm'>Username</FormLabel>
                            <Input outline='none' border='none' rounded='none' bg='gray.800' onChange={(e)=>{setLoginData(prev=>({...prev, username:e.target.value}))}} name='name' placeholder='username' required type='text'/>
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel fontSize='sm'>Password</FormLabel>
                            <Input outline='none' border='none' rounded='none' bg='gray.800' onChange={(e)=>{setLoginData(prev=>({...prev, password:e.target.value}))}} name='password' placeholder='password' required type='password'/>
                        </FormControl>
                        <Flex w='full' alignItems='center' flexDir='column' justifyContent='center' gap='20px'>
                            <Button rounded='none' w='full' type='submit' bg='#2F58CD' color='white' _hover={{bg:"blue.700"}}>Login</Button>
                            <Button rounded='none' w='full' bg='gray.700' _hover={{bg:'gray.800'}}>Create Account</Button>
                        </Flex>
                </Flex>
                </form>
            </Flex>
          )
    } else {
        
        return(
            <Navigate to='/api' replace={true}/>
        )
    }
}
