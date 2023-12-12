import {Link, useDisclosure,useToast, Flex, Box, Text, Button, Avatar, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Badge, DrawerFooter, TableContainer, Table, TableCaption, Thead, Tr, Th, Tbody, Td, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter, IconButton, Menu, MenuButton, MenuList, MenuItem, Icon, Alert, AlertIcon, CloseButton, AlertTitle } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../App";
import { BsCheck,BsFilter, BsFillEnvelopeAtFill, BsFillTelephoneFill, BsBroadcast } from "react-icons/bs";
import userService from "../services/userService";
import AdminTaskPage from "./AdminTaskPage";
import { Link as RouterLink } from "react-router-dom";

export default function TasksPage() {
  const toast = useToast();
  const { loggerData, setLoggerData } = useContext(LoginContext);
  const {isOpen:menuIsOpen, onOpen:menuOnOpen, onClose:menuOnClose} = useDisclosure();
  const [tasks, setTasks] = useState({total:0});
  const {isOpen:addTaskIsOpen, onOpen:addTaskOnOpen, onClose:addTaskOnClose} = useDisclosure();
  const [newTaskData, setNewTaskData] = useState({});
  const [allBroadcasts, setAllBroadcasts] = useState([]);

  const {isOpen:alertIsOpen, onOpen:alertOnOpen, onClose:alertOnClose} = useDisclosure({defaultIsOpen:true});
  
  const selfTaskCompleted = async (task_id) => {
    const match = await userService.finishSelfTask(loggerData?.loggerData?.access_token, {user_id:loggerData?.loggerData?.user_id, task_id});

    if(match){
        setTasks(prev=>({...prev, total:prev.total-1}))  
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const myForm = {user_id:loggerData?.loggerData.user_id, description:newTaskData.description,due_date:newTaskData.due_date, priority:newTaskData.priority};
    const response = await userService.addSelfTask(loggerData?.loggerData.access_token, myForm);
    if(response.status === 201){
      addTaskOnClose();
      toast({
        title: 'Task created.',
        description: "We've created your task for you.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      setTasks(prev=>({...prev, total:prev.total+1}));
      
    } else {
      addTaskOnClose();
      toast({
        title: 'Task Creation Failed.',
        description: "We've failed to create your task.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    } 
  }

  const fetchTasks = async () =>{
    const taskData = await userService.getTasks({user_id:loggerData?.loggerData?.user_id});
    console.log('taskData',taskData);
    setTasks({...taskData?.data?.match, total:taskData?.data?.match?.assigned_tasks.length+taskData?.data?.match?.self_tasks.length});
  }
  const fetchBroadcasts = async () => {
    const response = await userService.getBroadcasts(loggerData?.loggerData?.access_token);
    setAllBroadcasts(response?.data?.data);
  }
 
  useEffect(()=>{
    fetchTasks();
    fetchBroadcasts();
  },[tasks.total])

  return (
    <Flex
      width={{base:'100%', sm:'100%' ,md:"100%"}}
      minH="auto"
      flexDir="column"
      alignItems="start"
      justifyContent="start"
    >
      <Flex  w="full" alignItems="center" justifyContent="space-between">
        {loggerData?.loggerData?.role === "Admin"? 
        (
          <Flex alignItems="center" gap="10px">
          <Text fontSize="xl">Admin Task Page,</Text>{" "}
          <Text fontSize="xl" fontWeight="bold" color="#2f58cd">
            {loggerData?.loggerData?.name.split(" ")[0]}
          </Text>
          </Flex>
        ):
        (
          <Flex alignItems="center" gap="10px">
          <Text fontSize="xl">Tasks for</Text>{" "}
          <Text fontSize="xl" fontWeight="bold" color="#2f58cd">
            {loggerData?.loggerData?.name.split(" ")[0]}
          </Text>
          </Flex>
        )
        }
        <Flex  gap='10px' alignItems="center" justifyContent="center">
          
          <Avatar
            onClick={menuOnOpen}
            showBorder
            border="2px solid #2F58CD"
            p="2px"
            name={loggerData?.loggerData.name}
            src={`http://localhost:3002${loggerData?.loggerData.image}`}
          />
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
      </Flex>
      { loggerData?.loggerData.role === "Admin" ? <AdminTaskPage access_token={loggerData.loggerData.access_token} user_id={loggerData?.loggerData?.user_id} /> :
        <Flex  alignItems="start" justifyContent="start" gap='20px' flexDir='column' w="full">
        {alertIsOpen && tasks?.assigned_tasks?.filter(item=>(item.is_broadcast === true)).length > 0 && (
          
            <Alert mt='20px' color='blue.500' variant='left-accent' status='info'>
            <AlertIcon />
            <AlertTitle w='full'>
            <Flex alignItems='center' w='full' justifyContent='space-between'>
            {`${tasks?.assigned_tasks?.filter(item=>(item.is_broadcast === true)).length} Broadcasting.`}
            <CloseButton
              onClick={alertOnClose}
            />
            </Flex>
            </AlertTitle>
            </Alert>
          
        )}
        <Flex
          mt="20px"
          w='full'
          bg="gray.50"
          flexDir="column"
          alignItems="start"
          justifyContent="start"
          rounded="xl"
          p="20px"
        >
          <Flex  position='relative' alignItems='center' justifyContent='center' mb='10px' w='full'>
            <Text fontSize="lg" fontWeight="bold">
              Assigned Tasks
            </Text>
            <Box position='absolute' right='0px'>
            <Menu>
              <MenuButton as={Button}>
                <BsFilter/>
              </MenuButton>
              <MenuList>
                <MenuItem><Text fontSize='sm' fontWeight='semibold'>By Date</Text></MenuItem></MenuList>
            </Menu>
            </Box>
          </Flex>
          <TableContainer w='full' >
          <Table variant='simple' >
            <TableCaption >Assigned Tasks as of today.</TableCaption>
            <Thead>
              <Tr>
                <Th>Assigned By</Th>
                <Th>Description</Th>
                <Th>Due Date</Th>
                <Th>Priority</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allBroadcasts?.map(broadcast=>(
                <Tr bg='yellow.100'>
                  <Td>
                  <Flex alignItems='center' gap='10px'> <Avatar size='sm' src={`http://localhost:3002${broadcast.assigned_by.image}`} /> <Text color="#2F58CD" fontSize='sm' fontWeight='bold'>{broadcast.assigned_by.name}</Text> <Icon color='red.400' boxSize='6' as={BsBroadcast} /> </Flex>
                  </Td>
                  <Td>{broadcast.description}</Td>
                  <Td>{broadcast.due_date}</Td>
                  <Td><Badge colorScheme='purple'>HIGH</Badge></Td>
                </Tr>
              ))}
              {tasks?.assigned_tasks?.map((task,idx)=>(
                <Tr bg="gray.50">
                <Td><Flex alignItems='center' gap='10px'> <Avatar size='sm' src={`http://localhost:3002${task.assigned_by.image}`} /> <Text color="#2F58CD" fontSize='sm' fontWeight='bold'>{task.assigned_by.name}</Text></Flex></Td>
                <Td>{task.description}</Td>
                <Td>{task.due_date}</Td>
                <Td>{task.priority === 1 ? <Badge colorScheme='purple'>HIGH</Badge>:task.priority === 2? <Badge colorScheme="orange">MODERATE</Badge>:<Badge colorScheme="cyan">LOW</Badge>}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
          <Box mt='20px'>
            <Link _hover={{textDecor:'none'}} as={RouterLink} to='/requests'>
            <Button>Make Task Request</Button>
            </Link>
          </Box>
        </Flex>

        <Flex
          
          mt="20px"
          w='full'
          bg="gray.50"
          flexDir="column"
          alignItems="start"
          justifyContent="start"
          rounded="xl"
          p="20px"
        >
          <Box w='full' textAlign='center' mb='10px'>
            <Text fontSize="lg" fontWeight="bold">
              Self Tasks
            </Text>
          </Box>
          <TableContainer w='full'>
          <Table variant='striped'>
            <TableCaption >Self Assigned Tasks as of today.</TableCaption>
            <Thead>
              <Tr>
                <Th>Status</Th>
                <Th>Assigned By</Th>
                <Th>Description</Th>
                <Th>Due Date</Th>
                <Th>Priority</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tasks?.self_tasks?.map(task=>(
                <Tr>
                <Td><IconButton taskId={task._id} onClick={()=>{selfTaskCompleted(task._id)}} variant='outline' icon={<BsCheck/>} colorScheme="blue" /></Td>
                <Td>SELF</Td>
                <Td>{task.description}</Td>
                <Td>{task.due_date}</Td>
                <Td>{task.priority === 1 ? <Badge colorScheme='purple'>HIGH</Badge>:task.priority === 2? <Badge colorScheme="orange">MODERATE</Badge>:<Badge colorScheme="cyan">LOW</Badge>}</Td>
              </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
          <Box mt='20px'>
            <Button onClick={addTaskOnOpen}>Add a Task</Button>
            <Modal
              isOpen={addTaskIsOpen}
              onClose={addTaskOnClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create a task</ModalHeader>
                <ModalCloseButton />
                <form onSubmit={handleSubmit}>
                <ModalBody pb={3}>
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e)=>{setNewTaskData(prev=>({...prev, description:e.target.value}))}} name='description' placeholder='Describe' required type='text'/>
                  </FormControl>
      
                  <FormControl mt={2} isRequired>
                    <FormLabel>Due Date</FormLabel>
                    <Input
                      placeholder="Select Date and Time"
                      size="md"
                      name="due_date"
                      type="datetime-local"
                      required
                      onChange={(e)=>{setNewTaskData(prev=>({...prev, due_date:e.target.value}))}}
                    />
                  </FormControl>

                  <FormControl mt={2} isRequired>
                    <FormLabel>Priority</FormLabel>
                    <Input onChange={(e)=>{setNewTaskData(prev=>({...prev, priority:e.target.value}))}} name='priority' type='number' placeholder='Priority' required />
                  </FormControl>
                </ModalBody>
      
                <ModalFooter>
                  <Button type='submit' colorScheme='blue' mr={3}>
                    Create
                  </Button>
                  <Button onClick={addTaskOnClose}>Cancel</Button>
                </ModalFooter>
                </form>
              </ModalContent>
            </Modal>
          </Box>
        </Flex>

        <Flex
          mt="20px"
          w='full'
          bg="gray.50"
          flexDir="column"
          alignItems="center"
          justifyContent="start"
          rounded="xl"
          p="20px"
        >
          <Box>
            <Text fontSize="lg" fontWeight="bold">
              Completed Tasks
            </Text>
          </Box>
          <Box>
            <Text>No completed Tasks</Text>
          </Box>
        </Flex>
      </Flex>}
    </Flex>
  );
}
