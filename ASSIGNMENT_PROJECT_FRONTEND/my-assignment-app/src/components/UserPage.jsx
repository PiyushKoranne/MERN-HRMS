import {useContext, useEffect, useState} from 'react';
import {Flex, useToast, Box, Text, useDisclosure, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Tfoot, Avatar, useConst, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter, Badge, IconButton, HStack, StackDivider} from '@chakra-ui/react'
import UserService from '../services/userService';
import { LoginContext } from '../App';
import {BsFillTelephoneFill,BsFillEnvelopeAtFill} from 'react-icons/bs';


export default function UserPage() {

  const {isOpen:menuIsOpen, onOpen:menuOnOpen, onClose:menuOnClose} = useDisclosure();
  const {isOpen, onOpen, onClose} = useDisclosure();
  const [formData, setFormData] = useState({
    name:"",
    email:"",
    mob:0,
    file:""
  });

  const toast = useToast();
  const handleSubmit = async (e) =>{
    e.preventDefault();
    const myForm = new FormData();
    myForm.append('name',formData.name);
    myForm.append('email', formData.email);
    myForm.append('mob', formData.mob);
    myForm.append('image', formData.file);

    const response = await UserService.create(myForm);
    if(response?.data?.message === 'User Created.'){
      toast({
        title: 'User Created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Some Error Occured',
        description: "We could not create your account.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const [users, setUsers] = useState({});
  const fetchUsers = async () => {
    setUsers(await UserService.getUser())
    console.log(users)
  }
  useEffect(()=>{
    fetchUsers();
  },[users.status])

  const {loggerData, setLoggerData} = useContext(LoginContext)
  console.log("I am in UserPage", loggerData);
  return (
    <Flex
    width='100%'
    minH='100%'
    flexDir='column'
    alignItems='start'
    justifyContent='start'
    >
        <Flex w='100%' alignItems='center' justifyContent='space-between' mb='20px'>
          <Text fontSize='2xl'>Users</Text>
          <Flex alignItems='center' justifyContent='start' gap='10px'>
          {loggerData?.loggerData.role === "Admin" && <Button color='gray.50' bg='#2f58cd' _hover={{bg:"#4f58cd"}} onClick={onOpen}>Create New User</Button>}
          <Avatar onClick={menuOnOpen} showBorder border='2px solid #2F58CD' p='2px' name={loggerData?.loggerData.name} src={`http://localhost:3002${loggerData?.loggerData.image}`}/>
          <Drawer
          isOpen={menuIsOpen}
          placement='right'
          onClose={menuOnClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Hello {loggerData?.loggerData?.name.split(" ")[0]}! </DrawerHeader>
  
            <DrawerBody>
            <Flex
            alignItems='center'
            justifyContent='start'
            gap='10px'
            flexDir='column'
            >
              <Avatar size='2xl' showBorder border='2px solid #2F58CD' p='2px' name={loggerData?.loggerData.name} src={`http://localhost:3002${loggerData?.loggerData.image}`}/>
              <Box><Text fontSize='xl' fontWeight='bold'>{loggerData?.loggerData?.name}</Text></Box>
              <Badge colorScheme={loggerData?.loggerData?.role === "Admin"?'green':'gray'} >{loggerData?.loggerData?.role}</Badge>
              <Flex alignItems='center' justifyContent='start' gap='10px'>
                <BsFillTelephoneFill/>  
                <Text>{loggerData?.loggerData?.mob}</Text>
              </Flex>
              <Flex alignItems='center' justifyContent='start' gap='10px'>
                <BsFillEnvelopeAtFill/>
                <Text>{loggerData?.loggerData?.email}</Text>
              </Flex>
            </Flex>
            </DrawerBody>
  
            <DrawerFooter>
              <Button variant='outline' mr={3} >
                Edit Profile
              </Button>
              <Button onClick={()=>{setLoggerData({success:false, loginData:{}})}} colorScheme='red'>Logout</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
          </Flex>
          <Modal
          isOpen={isOpen}
          onClose={onClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create an account</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
            <ModalBody pb={3}>
              <FormControl isRequired>
                <FormLabel>UserName</FormLabel>
                <Input name='name' onChange={(e)=>{setFormData(prev=>({...prev, name:e.target.value}))}} placeholder='username' required type='text'/>
              </FormControl>
  
              <FormControl mt={2} isRequired>
                <FormLabel>Email</FormLabel>
                <Input name='email' type='email' onChange={(e)=>{setFormData(prev=>({...prev, email:e.target.value}))}} placeholder='Email' required />
              </FormControl>

              <FormControl mt={2} isRequired>
                <FormLabel>Mobile</FormLabel>
                <Input name='mob' type='number' onChange={(e)=>{setFormData(prev=>({...prev, mob:e.target.value}))}} placeholder='Mob.' required />
              </FormControl>

              <FormControl mt={2}>
                <FormLabel>Profile Pic</FormLabel>
                <Input name='image' type='file' onChange={(e)=>{setFormData(prev=>({...prev, file:e.target.files[0]}))}} placeholder='Choose Image' />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <Button type='submit' colorScheme='blue' mr={3}>
                Create
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
            </form>
          </ModalContent>
        </Modal>  
        </Flex>
        <HStack border='1px solid yellow' bg='gray.50' mb='20px' gap={{base:0, sm:0, md:3}} w='full' divider={<StackDivider/>}>
            <Flex  rounded='lg' bg='gray.50' flexDir='column' w='25%' alignItems='center' justifyContent='start' p='10px'>
              <Text fontSize={{base:'xs',sm:'xs',md:'xl'}} fontWeight='bold'>Users</Text>
              <Text fontSize='2xl' color='#2F58CD' fontWeight='bold'>{users?.data?.safeData.length}</Text>
            </Flex>
            
            <Flex  rounded='lg' bg='gray.50' flexDir='column' w='25%' alignItems='center' justifyContent='start' p='10px'>
              <Text fontSize={{base:'xs',sm:'xs',md:'xl'}} fontWeight='bold'>Viewers</Text>
              <Text fontSize='2xl' color='#2F58CD' fontWeight='bold'>{users?.data?.safeData.filter(item=>(item.role === 'Viewer')).length}</Text>
            </Flex>
            
            <Flex  rounded='lg' bg='gray.50' flexDir='column' w='25%' alignItems='center' justifyContent='start' p='10px'>
              <Text fontSize={{base:'xs',sm:'xs',md:'xl'}} fontWeight='bold'>Editors</Text>
              <Text fontSize='2xl' color='#2F58CD' fontWeight='bold'>{users?.data?.safeData.filter(item=>(item.role === 'Editor')).length}</Text>
            </Flex>
            
            <Flex rounded='lg' bg='gray.50' flexDir='column' w='25%' alignItems='center' justifyContent='start' p='10px'>
              <Text fontSize={{base:'xs',sm:'xs',md:'xl'}} fontWeight='bold'>Admins</Text>
              <Text fontSize='2xl' color='#2F58CD' fontWeight='bold'>{users?.data?.safeData.filter(item=>(item.role === "Admin")).length}</Text>
            </Flex>
          </HStack>
        <Flex alignItems='center' flexDir='column' w='100%' bg='gray.50' p='20px'>
            <TableContainer w='full'>
            <Table variant='striped'>
              <TableCaption>Table of the users.</TableCaption>
              <Thead>
                <Tr>
                  <Th>Profile</Th>
                  <Th>UserName</Th>
                  <Th>Role</Th>
                  <Th>Contact</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.data?.safeData?.map(item=>(
                  <Tr>
                  <Td><Avatar name={item.name} src={`http://127.0.0.1:3002/${item.image}`} /></Td>
                  <Td>{item.name}</Td>
                  <Td>{item.role}</Td>
                  <Td>{item.mob}</Td>
                  <Td><Button colorScheme='blue' variant='outline'>View</Button></Td>
                </Tr>
                ))}
              </Tbody>
            </Table>
        </TableContainer>
        </Flex>        
    </Flex>
  )
}
