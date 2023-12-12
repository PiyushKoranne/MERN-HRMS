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
} from "@chakra-ui/react";
import {IoMdAirplane} from 'react-icons/io';
import { BsFillCalendarCheckFill, BsFillEnvelopeAtFill, BsFillTelephoneFill, BsListTask } from "react-icons/bs";
import { BiPlusMedical, BiTimeFive } from "react-icons/bi";
import { LoginContext } from "../App";
import userService from "../services/userService";
import { useState, useContext, useEffect } from "react";
import TaskForm from "./forms/TaskForm";
import MedicalForm from "./forms/MedicalForm";
import PlannedForm from "./forms/PlannedLeave";
import OvertimeForm from "./forms/OverTimeForm";
import TravelForm from "./forms/TravelForm";


export default function RequestsPage() {
  const toast = useToast();
  const {loggerData, setLoggerData} = useContext(LoginContext)
  const [requests, setRequests] = useState({total:0});
  const [formType, setFormType] = useState('');

  console.log(requests);
  const fetchRequests = async () =>{
    const data = await userService.getRequests({raised_by: loggerData?.loggerData?.user_id});
    setRequests(data?.data?.data);
  }

  const handleSubmit = async (data) => {
    try {
      const response = await userService.makeRequest(data);
      response?.data?.success === true && toast({
        title: 'Task created.',
        description: "We've rasied your request.",
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setRequests(prev=>({...prev, total:prev.total+1}));
    } catch (error) {
      console.log('My Error',error);
      error?.response?.data?.limitExceed === true ? 
      toast({
        title: 'Forbidden',
        description: "Cannot make more than 5 requests at once.",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })  
      :
      toast({
        title: 'Failed',
        description: "We failed to create your request.",
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
    }
  }

  const {
    isOpen: menuIsOpen,
    onOpen: menuOnOpen,
    onClose: menuOnClose,
  } = useDisclosure();

  useEffect(()=>{
    fetchRequests();
  },[requests.total])

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
          {loggerData?.loggerData?.role === "Admin" && (
            <Button colorScheme="blue">Assign Tasks</Button>
          )}
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
      <Flex
      mt='20px'
      alignItems='center'
      justifyContent='start'
      w='100%'
      >
          <StatGroup gap='20px' w='50%'>
          <Stat bg='gray.50' textAlign='center'>
            <StatLabel>Total Requests</StatLabel>
            <StatNumber color='#2f58cd'>{requests?.request_data?.length || '-'}</StatNumber>
            <StatHelpText>
              As of Today
            </StatHelpText>
          </Stat>

          <Stat bg='gray.50' textAlign='center'>
            <StatLabel>Approved</StatLabel>
            <StatNumber color='#2f58cd'>{requests?.request_data?.filter(item=>(item.approved === true)).length }</StatNumber>
            <StatHelpText>
              As of Today
            </StatHelpText>
          </Stat>

          <Stat bg='gray.50' textAlign='center'>
            <StatLabel>PENDING</StatLabel>
            <StatNumber color='#2f58cd'>{requests?.request_data?.filter(item=>(item.approved === false)).length }</StatNumber>
            <StatHelpText>
              As of Today
            </StatHelpText>
          </Stat>
          </StatGroup>
      </Flex>
      <Flex
      alignItems='start'
      justifyContent='start'
      flexDir='column'
      bg='gray.50'
      rounded='lg'
      padding='10px'
      w='full'
      mt='20px'
      >
        <Text fontSize='xl' fontWeight='bold'>Requests</Text>
        <Flex alignItems='center' justifyContent={{base:'space-evenly',sm:'space-evenly',md:'start'}} gap='10px' wrap='wrap' > 
            <Button onClick={()=>{setFormType('TASK')}} variant='outline' leftIcon={<BsListTask/>} rounded='none' colorScheme="whatsapp">Task Request</Button>
            <Button onClick={()=>{setFormType('MEDICAL')}} variant='outline' leftIcon={<BiPlusMedical/>} rounded='none' colorScheme="purple">Medical Leave</Button>
            <Button onClick={()=>{setFormType('PLANNED')}} variant='outline' leftIcon={<BsFillCalendarCheckFill />} rounded='none' colorScheme="orange">Planned Leave</Button>
            <Button onClick={()=>{setFormType('OVERTIME')}} variant='outline' leftIcon={<BiTimeFive />} rounded='none' colorScheme="linkedin">Apply overtime</Button>
            <Button onClick={()=>{setFormType('TRAVEL')}} variant='outline' leftIcon={<IoMdAirplane />} rounded='none' colorScheme="teal">Apply for travel</Button>
      </Flex>
      <Flex p='10px' w='full'>
        {formType === ""? 
          <></>:
        formType === "TASK"? 
          <TaskForm handleSubmit={handleSubmit} logger={loggerData?.loggerData?.user_id} />: 
        formType === "MEDICAL"? 
          <MedicalForm handleSubmit={handleSubmit} logger={loggerData?.loggerData?.user_id} />:
        formType==="PLANNED"? 
          <PlannedForm handleSubmit={handleSubmit} logger={loggerData?.loggerData?.user_id} />:
        formType==="OVERTIME"?
          <OvertimeForm handleSubmit={handleSubmit} logger={loggerData?.loggerData?.user_id} />:
          <TravelForm handleSubmit={handleSubmit} logger={loggerData?.loggerData?.user_id} />}
      </Flex>
      </Flex>
      {requests?.request_data?.length > 0 ? 
        <Flex w='full' mt='20px' bg='gray.50' flexDir='column' alignItems='center'>
          <Text color='gray.900' m='10px 0px' fontSize="lg" fontWeight="bold">
              Your Requests 
          </Text>
          <TableContainer w='full' >
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>Request Type</Th>
                <Th>Request Title</Th>
                <Th>Raised On</Th>
                <Th>Documents</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {requests?.request_data?.map(item=>(
                <Tr>
                  <Td fontWeight='bold' fontSize='sm' 
                  color={item.request_type === "MEDICAL LEAVE"? 'purple.400':
                    item.request_type ==="TRAVEL" ? 'teal.400': item.request_type === "SCRUM TASK"?
                    'green.400':item.request_type === "OVERTIME"? '#2f58cd':'orange.400'
                  }
                  >
                    {item.request_type}
                  </Td>
                  <Td>{item.request_type}</Td>
                  <Td>{item.raised_on}</Td>
                  <Td>
                  <Popover>
                    <PopoverTrigger>
                      <Button>View Documents</Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverHeader>{item.request_type}</PopoverHeader>
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
                        <PopoverFooter>{`Date: ${item.raised_on}`}</PopoverFooter>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                  </Td>
                  <Td color={item.approved ? "green.400":"#2f58cd"} fontWeight='bold' fontSize='sm'>
                    {item?.approved ? "APPROVED" : "PENDING"}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        </Flex>
        :
        (<Flex bg='gray.50' p='20px' rounded='lg' w='full' mt='50px' alignItems='center' justifyContent='center' flexDir='column'>
          <Heading color='gray.300'>No Requests Found</Heading>
          <Button mt='20px' variant='outline' colorScheme='blackAlpha'>Raise a Request</Button>
        </Flex>
        )
        }
    </Flex>
  );
}
