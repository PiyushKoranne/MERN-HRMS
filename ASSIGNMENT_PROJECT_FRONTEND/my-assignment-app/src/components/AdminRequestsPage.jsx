import {
  Flex,
  Box,
  Text,
  Button,
  useDisclosure,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Badge,
  DrawerFooter,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  Th,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  Image,
  useToast,
  Select,
  MenuButton,
  FormControl,
  FormLabel,
  Menu,
  MenuList,
  MenuItem,
  IconButton,
} from "@chakra-ui/react";

import {MdClose} from 'react-icons/md'
import userService from "../services/userService";
import {
    BsCheck,
  BsFillCalendarCheckFill,
  BsFillEnvelopeAtFill,
  BsFillTelephoneFill,
  BsListTask,
  BsTrashFill,
} from "react-icons/bs";
import { BiChevronDown, BiPlusMedical, BiTimeFive } from "react-icons/bi";

import { LoginContext } from "../App";
import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {useState} from 'react';

export default function AdminRequestsPage() {
  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure();

  const { loggerData, setLoggerData } = useContext(LoginContext);
  const [allRequests, setAllRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserData, setSelectedUserData] = useState({});
  const [total, setTotal] = useState(0);
  const [approved, setApproved] = useState(0);
  

  const fetchUsers = async () => {
    const data = await userService.getUser();
    console.log('USER API CALLED.');
    setAllUsers(data?.data?.safeData);
    }
  const fetchRequests = async () => {
    console.log('REQUEST API CALLED.');
    const data = await userService.getAllRequests(loggerData?.loggerData?.access_token)
    setAllRequests(data?.data?.data);
  }

  const handleRequestDelete = async  (data) =>{
    await userService.deleteRequest(loggerData?.loggerData?.access_token, data);
    setTotal(prev=>prev-1);
  }

  const handleRequestApprove = async  (data) =>{
    await userService.approveRequest(loggerData?.loggerData?.access_token, data);
    setApproved(prev=>prev+1);
  }
  
  const getTotal = () => {
    setTimeout(()=>{
      setTotal(allRequests.map(item=>item.request_data.length).reduce((partial, val)=>partial+val,0));
    }, 300)
  }
  
  const getApproved = () => {
    setTimeout(()=>{
      let sum = 0;
      allRequests?.forEach(item => {
        sum += item?.request_data?.filter(data=> data.approved === true).length;
      });
      setApproved(sum);
    }, 300)
  }

  useEffect(()=>{
    fetchRequests();
    fetchUsers();
    getTotal();
    getApproved();
    
    if (selectedUser !== "" && allRequests !== []){
      setSelectedUserData(allRequests?.filter(item=>item.raised_by === selectedUser)[0]);
      // console.log('I am Here.');
      // console.log(allRequests?.filter(item=>item.raised_by === selectedUser)); 
    }
  },[allRequests.length, total, approved, selectedUser]);

  console.log('SELECTED USER DATA',selectedUserData);
  if (loggerData?.loggerData?.role !== "Admin") {
    // navigate back to request page.
    <Navigate to="/requests" />; 
  } else {
    return (
      <Flex
        width="100%"
        minH="100%"
        flexDir="column"
        alignItems="start"
        justifyContent="start"
      >
        <Flex w="100%" alignItems="center" justifyContent="space-between">
          {loggerData?.loggerData?.role === "Admin" ? (
            <Flex alignItems="center" gap="10px">
              <Text fontSize="xl">Admin Requests Page,</Text>{" "}
              <Text fontSize="xl" fontWeight="bold" color="#2f58cd">
                {loggerData?.loggerData?.name.split(" ")[0]}
              </Text>
            </Flex>
          ) : (
            <Flex alignItems="center" gap="10px">
              <Text fontSize="xl">Requests By</Text>
              <Text fontSize="xl" fontWeight="bold" color="#2f58cd">
                {loggerData?.loggerData?.name.split(" ")[0]}
              </Text>
            </Flex>
          )}
          <Flex gap="10px" alignItems="center" justifyContent="center">
            <Avatar
              onClick={menuOnOpen}
              showBorder
              border="2px solid #2F58CD"
              p="2px"
              name={loggerData?.loggerData.name}
              src={`http://localhost:3002${loggerData?.loggerData.image}`}
            />
            <Drawer isOpen={menuIsOpen} placement="right" onClose={menuOnClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                  Hello {loggerData?.loggerData?.name.split(" ")[0]}!{" "}
                </DrawerHeader>

                <DrawerBody>
                  <Flex
                    alignItems="center"
                    justifyContent="start"
                    gap="10px"
                    flexDir="column"
                  >
                    <Avatar
                      size="2xl"
                      showBorder
                      border="2px solid #2F58CD"
                      p="2px"
                      name={loggerData?.loggerData.name}
                      src={`http://localhost:3002${loggerData?.loggerData.image}`}
                    />
                    <Box>
                      <Text fontSize="xl" fontWeight="bold">
                        {loggerData?.loggerData?.name}
                      </Text>
                    </Box>
                    <Badge
                      colorScheme={
                        loggerData?.loggerData?.role === "Admin"
                          ? "green"
                          : "gray"
                      }
                    >
                      {loggerData?.loggerData?.role}
                    </Badge>
                    <Flex alignItems="center" justifyContent="start" gap="10px">
                      <BsFillTelephoneFill />
                      <Text>{loggerData?.loggerData?.mob}</Text>
                    </Flex>
                    <Flex alignItems="center" justifyContent="start" gap="10px">
                      <BsFillEnvelopeAtFill />
                      <Text>{loggerData?.loggerData?.email}</Text>
                    </Flex>
                  </Flex>
                </DrawerBody>

                <DrawerFooter>
                  <Button variant="outline" mr={3}>
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => {
                      setLoggerData({ success: false, loginData: {} });
                    }}
                    colorScheme="red"
                  >
                    Logout
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </Flex>
        </Flex>
        <Flex mt="20px" alignItems="center" justifyContent="start" w="100%">
          <StatGroup gap="20px" w={{lg:'50%',md:'75%', base:'100%', sm:'100%'}}>
            <Stat bg="gray.50" textAlign="center">
              <StatLabel>Total Requests</StatLabel>
              <StatNumber color="#2f58cd">{total}</StatNumber>
              <StatHelpText>As of Today</StatHelpText>
            </Stat>

            <Stat bg="gray.50" textAlign="center">
              <StatLabel>Approved</StatLabel>
              <StatNumber color="#2f58cd">{approved}</StatNumber>
              <StatHelpText>As of Today</StatHelpText>
            </Stat>

            <Stat bg="gray.50" textAlign="center">
              <StatLabel>PENDING</StatLabel>
              <StatNumber color="#2f58cd">{total - approved}</StatNumber>
              <StatHelpText>As of Today</StatHelpText>
            </Stat>
          </StatGroup>
        </Flex>
        <Flex w='full' mt='20px' bg='gray.50' flexDir='column' alignItems='center'>
          <Flex position='relative' w='full' alignItems='center' justifyContent='center' p='10px'>
          <Text color='gray.900' m='10px 0px' fontSize="lg" fontWeight="bold">
            Requests 
          </Text>
          <Box position='absolute' right='20px'>
            <Menu w="full">
            <MenuButton
              as={Button}
              rightIcon={<BiChevronDown />}
              variant="outline"
            >
              <Text fontWeight="medium">Select User</Text>
            </MenuButton>
            <MenuList>
              {allUsers?.map((item, idx) => (
                <MenuItem
                onClick={()=>{
                    setSelectedUser(item.user_id);
                }}
                key={idx}
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
          </Box>
          </Flex>
          <TableContainer w='full'  >
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>Request Type</Th>
                <Th>Raised On</Th>
                <Th>Total Days</Th>
                <Th>Documents</Th>
                <Th>Approve / Reject</Th>
              </Tr>
            </Thead>
            <Tbody>
              {selectedUserData?.request_data?.map((item,idx)=>( item.approved === false &&
                <Tr key={idx}>
                  <Td fontWeight='bold' fontSize='sm'
                  color={item.request_type === "MEDICAL LEAVE"? 'purple.400':
                  item.request_type ==="TRAVEL" ? 'teal.400': item.request_type === "SCRUM TASK"?
                  'green.400':item.request_type === "OVERTIME"? '#2f58cd':'orange.400'
                } 
                  >
                    {item.request_type}
                  </Td>
                  <Td>{item.raised_on}</Td>
                  <Td>{item.date_data? item.date_data?.total_days:0 }</Td>
                  <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button size='xs' colorScheme="blue">View Documents</Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader></PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          {item?.documents?.length > 0 ? 
                            <Flex alignItems='center' gap='10px' >
                              {item?.documents?.map(image =>(
                                <Image boxSize='100px' src={`http://localhost:3002${image}`} alt='document-img' />
                              ))}
                            </Flex>
                            :
                            <Text fontWeight='bold' color='gray.400'>This Request has no documents.</Text>
                          }
                        </PopoverBody>
                        <PopoverFooter></PopoverFooter>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                  </Td>
                  <Td fontWeight='bold' fontSize='sm'>
                    <Flex alignItems='center' gap='10px'>
                        <IconButton onClick={()=>{handleRequestApprove({request_id: item._id, raised_by:selectedUserData?.raised_by})}} icon={<BsCheck/>} size='xs' colorScheme="green"></IconButton>
                        <IconButton onClick={()=>{handleRequestDelete({request_id: item._id, raised_by:selectedUserData?.raised_by})}} icon={<MdClose/>} size='xs' colorScheme="red"></IconButton>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        </Flex>
        <Flex w='full' mt='20px' bg='gray.50' flexDir='column' alignItems='center'>
        <Text color='gray.900' m='10px 0px' fontSize="lg" fontWeight="bold">
            Approved Requests 
          </Text>
        <TableContainer w='full'  >
          <Table variant='striped'>
            <Thead>
              <Tr>
                <Th>Request Type</Th>
                <Th>Raised On</Th>
                <Th>Total Days</Th>
                <Th>Documents</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
               selectedUserData?.request_data?.map(item=>( item.approved === true &&
                <Tr>
                  <Td fontWeight='bold' fontSize='sm'
                  color={item.request_type === "MEDICAL LEAVE"? 'purple.400':
                  item.request_type ==="TRAVEL" ? 'teal.400': item.request_type === "SCRUM TASK"?
                  'green.400':item.request_type === "OVERTIME"? '#2f58cd':'orange.400'
                } 
                  >
                    {item.request_type}
                  </Td>
                  <Td>{item.raised_on}</Td>
                  <Td>{item.date_data? item.date_data?.total_days:0 }</Td>
                  <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button size='xs' colorScheme="blue">View Documents</Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader></PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          {item?.documents?.length > 0 ? 
                            <Flex alignItems='center' gap='10px' >
                              {item?.documents?.map(image =>(
                                <Image boxSize='100px' src={`http://localhost:3002${image}`} alt='document-img' />
                              ))}
                            </Flex>
                            :
                            <Text fontWeight='bold' color='gray.400'>This Request has no documents.</Text>
                          }
                        </PopoverBody>
                        <PopoverFooter></PopoverFooter>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                  </Td>
                  <Td fontWeight='bold' fontSize='sm'>
                    <Flex alignItems='center' gap='10px'>
                        <IconButton onClick={()=>{handleRequestDelete({request_id: item._id, raised_by:selectedUserData?.raised_by})}} icon={<BsTrashFill/>} size='xs' colorScheme="red"></IconButton>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        </Flex>
      </Flex>
    );
  }
}
