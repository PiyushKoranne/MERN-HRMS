import {
  Flex,
  Box,
  Text,
  Button,
  Select,
  Input,
  FormControl,
  FormLabel,
  Avatar,
  Textarea,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputRightElement,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Badge,
  Heading,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  VStack,
  StackDivider,
  Icon,
} from "@chakra-ui/react";
import { BsBroadcast, BsCheck, BsTrash } from "react-icons/bs";
import { BiChevronDown, BiSearch } from "react-icons/bi";
import {HiSpeakerphone} from 'react-icons/hi'
import UserService from "../services/userService";
import { useEffect, useState } from "react";

export default function AdminTaskPage({ access_token, user_id }) {
  const toast = useToast();
  const [task, setTask] = useState({ assigned_by: user_id });
  const [users, setUsers] = useState({});
  const [userTasks, setUserTasks] = useState({});
  const [broadcastData, setBroadcastData] = useState({broadcaster_id:user_id});
  const [allBroadcasts, setAllBroadcasts] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const {
    isOpen: addTaskIsOpen,
    onOpen: addTaskOnOpen,
    onClose: addTaskOnClose,
  } = useDisclosure();
  
  const {
    isOpen: broadcastIsOpen,
    onOpen: broadcastOnOpen,
    onClose: broadcastOnClose,
  } = useDisclosure();

  const handleBroadcast = async () => {
    const response = await UserService.createBroadcast(access_token, broadcastData);
    console.log(response);
    if(response?.data.success === true){
      broadcastOnClose();
      setRefresh(prev => !prev);
      toast({
        title: "Broadcast created.",
        description: response?.data?.message,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    }
  }
  
  const [newSelfTask, setNewSelfTask] = useState({ total: 0 });
  const [adminSelfTasks, setAdminSelfTasks] = useState({});
  const [searchText, setSearchText] = useState("");
  function debounce(cb) {
    let timer;
    return function (...args) {
      const context = this;
      console.log("args", args);
      clearTimeout(timer);
      timer = setTimeout(() => {
        cb.apply(context, args);
      }, 650);
    };
  }

  function searchUserSuggestion(name) {
    setSearchText(name);
  }

  const debouncedSearch = debounce(searchUserSuggestion);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const myForm = {
      user_id: user_id,
      description: newSelfTask.description,
      due_date: newSelfTask.due_date,
      priority: newSelfTask.priority,
    };
    console.log("myForm", myForm);
    const response = await UserService.addSelfTask(access_token, myForm);
    console.log("API REQUEST MADE");
    if (response.status === 201) {
      addTaskOnClose();
      toast({
        title: "Task created.",
        description: "We've created your task for you.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      console.log(response?.data?.data);
      setAdminSelfTasks(response?.data?.data);
    } else {
      addTaskOnClose();
      toast({
        title: "Task Creation Failed.",
        description: "We've failed to create your task.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const selfTaskCompleted = async (task_id) => {
    const match = await UserService.finishSelfTask(access_token, {
      user_id: user_id,
      task_id,
    });
    console.log("API REQUEST MADE");

    if (match) {
      setAdminSelfTasks(match?.data?.data);
    }
  };

  const getUserTasks = async (user_id) => {
    const data = await UserService.getTasks({ user_id: user_id });
    console.log("API REQUEST MADE");
    setUserTasks(data?.data?.data);
  };

  const fetchUsers = async () => {
    const response = await UserService.getTasks({ user_id: user_id });
    console.log("API REQUEST MADE");
    setAdminSelfTasks(response?.data?.data);
    setUsers(await UserService.getUser());
  };
  const fetchBroadcasts = async () => {
    const response = await UserService.getBroadcasts(access_token);
    console.log('ALL BROADCASTS',response?.data?.data);
    setAllBroadcasts(response?.data?.data);
  }

  useEffect(() => {
    fetchUsers();
    fetchBroadcasts();
  }, [users.status, refresh]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const data = await UserService.addAssignedTask(access_token, task);
    console.log("API REQUEST MADE");
    if (data?.data?.success) {
      toast({
        title: "Task created.",
        description: "We've created the task.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Failed to Create",
        description: "We've failed to create the task.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100%" w="full">
      <Flex
        rounded="lg"
        mt="20px"
        bg="gray.50"
        alignItems="center"
        justifyContent="start"
        flexDir="column"
        w="full"
      >
        <Flex
        w='full'
        alignItems='center'
        justifyContent='center'
        position='relative'
        mt='10px'
        p='10px'
        >
          
          <Text fontSize="lg" fontWeight="bold">
            Create An Assigned Task
          </Text>
          
          <Box position='absolute' right='20px'>
            <Button onClick={broadcastOnOpen} leftIcon={<HiSpeakerphone/>}>Create New Broadcast</Button>
            <Modal
              isOpen={broadcastIsOpen}
              onClose={broadcastOnClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Create A New Broadcast</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Input onChange={(e)=>{setBroadcastData(prev=>({...prev, description:e.target.value}))}} placeholder='Description' />
                  </FormControl>

                  <FormControl mt={4}>
                    <FormLabel>Due Date</FormLabel>
                    <Input onChange={(e)=>{setBroadcastData(prev=>({...prev, due_date:e.target.value}))}} placeholder='Due Date' type='datetime-local' />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button onClick={handleBroadcast} colorScheme='blue' mr={3} leftIcon={<HiSpeakerphone/>}>
                    Broadcast
                  </Button>
                  <Button onClick={broadcastOnClose}>Cancel</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        </Flex>
        <form onSubmit={handleAddTask}>
          <Flex
            w="100%"
            alignItems="center"
            justifyContent="space-evenly"
            gap="10px"
            flexWrap="wrap"
          >
            <FormControl w="100%" mt={2}>
              <FormLabel>Select User</FormLabel>
              <Select
                isRequired
                placeholder="Select User"
                onChange={(e) => {
                  setTask((prev) => ({ ...prev, user_id: e.target.value }));
                }}
              >
                {users.data?.safeData?.map((item) => (
                  <option value={item.user_id}>{item.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl mt={2}>
              <FormLabel>Select Priority</FormLabel>
              <Select
                isRequired
                placeholder="Priority"
                onChange={(e) => {
                  setTask((prev) => ({
                    ...prev,
                    priority: parseInt(e.target.value),
                  }));
                }}
              >
                <option value="1" color="purple" fontWeight="bold">
                  HIGH
                </option>
                <option value="2" color="purple" fontWeight="bold">
                  Moderate
                </option>
                <option value="3" color="purple" fontWeight="bold">
                  LOW
                </option>
              </Select>
            </FormControl>

            <FormControl mt={2}>
              <FormLabel>Due Date</FormLabel>
              <Input
                onChange={(e) => {
                  setTask((prev) => ({ ...prev, due_date: e.target.value }));
                }}
                placeholder="Select Date and Time"
                size="md"
                name="due_date"
                type="datetime-local"
                required
                // onchange
              />
            </FormControl>

            <FormControl mt={2}>
              <FormLabel>Description</FormLabel>
              <Textarea
                isRequired
                placeholder="Write the task description."
                onChange={(e) => {
                  setTask((prev) => ({ ...prev, description: e.target.value }));
                }}
              />
            </FormControl>
            <Flex
              alignItems="center"
              w="100%"
              justifyContent="center"
              padding="20px"
            >
              <Button type="submit" bg="#2f58cd" color="gray.50">
                Create Task
              </Button>
            </Flex>
          </Flex>
        </form>
      </Flex>
      <Flex
        mt="20px"
        alignItems="center"
        justifyContent="start"
        flexDir="column"
        rounded="lg"
        bg="gray.50"
        w="full"
      >
        <Text fontSize="lg" fontWeight="bold" mt="20px">
          View Tasks
        </Text>
        <Flex
          p="10px"
          w="full"
          alignItems="center"
          justifyContent={{ base: "start", sm: "start", md: "space-evenly" }}
        >
          <Menu w="full">
            <MenuButton
              as={Button}
              rightIcon={<BiChevronDown />}
              variant="outline"
            >
              <Text fontWeight="medium">Users</Text>
            </MenuButton>
            <MenuList>
              {users?.data?.safeData.map((item) => (
                <MenuItem
                  onClick={() => {
                    getUserTasks(item.user_id);
                  }}
                >
                  <Flex alignItems="center" gap="10px">
                    <Avatar
                      src={`http://localhost:3002${item.image}`}
                      size="sm"
                      name={item.name}
                    />
                    <Text>{item.name}</Text>
                  </Flex>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Flex
            position="relative"
            w={{ base: "60%", sm: "60%", md: "30%" }}
            alignItems="start"
            justifyContent="start"
            flexDir="column"
          >
            <InputGroup>
              <InputRightElement pointerEvents="none" children={<BiSearch />} />
              <Input
                onKeyUp={(e) => {
                  debouncedSearch(e.target.value);
                }}
                type="text"
                placeholder="Search for user"
              />
            </InputGroup>
            <VStack
              position="absolute"
              top="40px"
              w="100%"
              spacing={0}
              divider={<StackDivider />}
              bg="gray.50"
              shadow="md"
            >
              {searchText === "" ? (
                <></>
              ) : (
                users?.data?.safeData
                  .filter((item) =>
                    item.name.toLowerCase().includes(searchText.toLowerCase())
                  )
                  .map((user) => (
                    <Flex
                      p='5px'
                      alignItems="center"
                      w="full"
                      justifyContent="start"
                      gap="20px"
                      onClick={() => {
                        getUserTasks(user.user_id);
                      }}
                      _hover={{cursor:'pointer',  bg:'gray.100'}}
                    >
                      <Avatar
                        size="xs"
                        name={user.name}
                        src={`http://localhost:3002${user.image}`}
                      />
                      <Text
                        color="#2F58CD"
                        ml="10px"
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {user.name}
                      </Text>
                    </Flex>
                  ))
              )}
            </VStack>
          </Flex>
        </Flex>
        {!userTasks ? (
          <Flex alignItems="center" justifyContent="center">
            <Heading color="gray.200">No Tasks To Show</Heading>
          </Flex>
        ) : (
          <TableContainer mt="20px" w="full">
            <Table variant="striped">
              <TableCaption>Assigned Tasks as of today.</TableCaption>
              <Thead>
                <Tr>
                  <Th>Assigned By</Th>
                  <Th>Description</Th>
                  <Th>Due Date</Th>
                  <Th>Priority</Th>
                </Tr>
              </Thead>
              <Tbody>
                {userTasks?.assigned_tasks?.map((task) => (
                  <Tr>
                    <Td>
                      <Flex alignItems="center">
                        {" "}
                        <Avatar
                          size="sm"
                          src={`http://localhost:3002${task.assigned_by.image}`}
                        />{" "}
                        <Text
                          color="#2F58CD"
                          ml="10px"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          {task.assigned_by.name}
                        </Text>{" "}
                      </Flex>
                    </Td>
                    <Td>{task.description}</Td>
                    <Td>{task.due_date}</Td>
                    <Td>
                      {task.priority === 1 ? (
                        <Badge colorScheme="purple">HIGH</Badge>
                      ) : task.priority === 2 ? (
                        <Badge colorScheme="orange">MODERATE</Badge>
                      ) : (
                        <Badge colorScheme="cyan">LOW</Badge>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Flex>

      {/* START Self Task */}
      <Flex
        mt="20px"
        w="full"
        bg="gray.50"
        flexDir="column"
        alignItems="start"
        justifyContent="start"
        rounded="xl"
        p="20px"
      >
        <Box w="full" textAlign="center" mb="10px">
          <Text fontSize="lg" fontWeight="bold">
            Self Tasks
          </Text>
        </Box>
        <TableContainer w="full">
          <Table variant="striped">
            <TableCaption>Self Assigned Tasks as of today.</TableCaption>
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
              {adminSelfTasks?.self_tasks?.map((task) => (
                <Tr>
                  <Td>
                    <IconButton
                      taskId={task._id}
                      onClick={() => {
                        selfTaskCompleted(task._id);
                      }}
                      variant="outline"
                      icon={<BsCheck />}
                      colorScheme="blue"
                    />
                  </Td>
                  <Td>SELF</Td>
                  <Td>{task.description}</Td>
                  <Td>{task.due_date}</Td>
                  <Td>
                    {task.priority === 1 ? (
                      <Badge colorScheme="purple">HIGH</Badge>
                    ) : task.priority === 2 ? (
                      <Badge colorScheme="orange">MODERATE</Badge>
                    ) : (
                      <Badge colorScheme="cyan">LOW</Badge>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <Box mt="20px">
          <Button onClick={addTaskOnOpen}>Add a Task</Button>
          <Modal isOpen={addTaskIsOpen} onClose={addTaskOnClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create a task</ModalHeader>
              <ModalCloseButton />
              <form onSubmit={handleSubmit}>
                <ModalBody pb={3}>
                  <FormControl isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      onChange={(e) => {
                        setNewSelfTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }));
                      }}
                      name="description"
                      placeholder="Describe"
                      required
                      type="text"
                    />
                  </FormControl>

                  <FormControl mt={2} isRequired>
                    <FormLabel>Due Date</FormLabel>
                    <Input
                      placeholder="Select Date and Time"
                      size="md"
                      name="due_date"
                      type="datetime-local"
                      required
                      onChange={(e) => {
                        setNewSelfTask((prev) => ({
                          ...prev,
                          due_date: e.target.value,
                        }));
                      }}
                    />
                  </FormControl>

                  <FormControl mt={2} isRequired>
                    <FormLabel>Priority</FormLabel>
                    <Input
                      onChange={(e) => {
                        setNewSelfTask((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }));
                      }}
                      name="priority"
                      type="number"
                      placeholder="Priority"
                      required
                    />
                  </FormControl>
                </ModalBody>

                <ModalFooter>
                  <Button type="submit" colorScheme="blue" mr={3}>
                    Create
                  </Button>
                  <Button onClick={addTaskOnClose}>Cancel</Button>
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
        </Box>
      </Flex>
      {/* END   Self Task */}
      <Flex
        mt="20px"
        w="full"
        bg="gray.50"
        flexDir="column"
        alignItems="start"
        justifyContent="start"
        rounded="xl"
        p="20px"
      >
        <Box w="full" textAlign="center" mb="10px">
          <Text fontSize="lg" fontWeight="bold">
            Broadcasts
          </Text>
        </Box>        
        <TableContainer mt="20px" w="full">
            <Table variant="striped">
              <TableCaption>Broadcasts as of today.</TableCaption>
              <Thead>
                <Tr>
                  <Th>Assigned By</Th>
                  <Th>Description</Th>
                  <Th>Due Date</Th>
                  <Th>Priority</Th>
                  <Th>Action</Th>
                </Tr> 
              </Thead>
              <Tbody>
                {allBroadcasts?.map((task) => (
                  <Tr>
                    <Td>
                      <Flex alignItems="center">
                        {" "}
                        <Avatar
                          size="sm"
                          src={`http://localhost:3002${task.assigned_by.image}`}
                        />{" "}
                        <Text
                          color="#2F58CD"
                          ml="10px"
                          fontSize="sm"
                          fontWeight="bold"
                        >
                          {task.assigned_by.name}
                        </Text>{" "}
                        <Icon color='red.400' ml='10px' boxSize='6' as={BsBroadcast} />
                      </Flex>
                    </Td>
                    <Td fontSize='sm' fontWeight='bold'>{task.description}</Td>
                    <Td>{task.due_date}</Td>
                    <Td>
                      {task.priority === 1 ? (
                        <Badge colorScheme="purple">HIGH</Badge>
                      ) : task.priority === 2 ? (
                        <Badge colorScheme="orange">MODERATE</Badge>
                      ) : (
                        <Badge colorScheme="cyan">LOW</Badge>
                      )}
                    </Td>
                    <Td>
                      <Button
                      onClick={async ()=>{
                        await UserService.deleteBroadcast(access_token, {broadcast_id:task._id});
                        setRefresh(prev=>!prev);
                        }}
                      size='xs' 
                      colorScheme="red" 
                      variant='ghost' 
                      leftIcon={<BsTrash/>}>
                        Delete
                      </Button>
                    </Td> 
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>  
      </Flex>
    </Box>
  );
}
