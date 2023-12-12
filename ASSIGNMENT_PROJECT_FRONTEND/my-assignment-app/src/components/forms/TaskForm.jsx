import {Button, Flex, FormControl, FormLabel, Heading, Input, Select} from '@chakra-ui/react'
import {useState} from 'react';

export default function TaskForm({handleSubmit, logger}) {
  const [thisForm, setForm] = useState({request_type:'SCRUM TASK'});
  const myForm = new FormData();
    myForm.append('request_type', thisForm.request_type);
    myForm.append('raised_by', logger);
    myForm.append('raised_on', thisForm.raised_on);
    myForm.append('image', thisForm.doc1);
    myForm.append('image', thisForm.doc2);

    const handleClick = () => {
        handleSubmit(myForm);
    }

  return (
    <Flex alignItems='center' justifyContent='start' flexDir='column' flexWrap='wrap' w='full' gap='20px'>
        <Heading size='md' mt='20px'>Task Form</Heading>
        <FormControl>
            <FormLabel>Request Type</FormLabel>
            <Select name='request_type' isDisabled value='SCRUM TASK' placeholder="SCRUM TASK" colorScheme='green'>
            </Select>
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Rasied On</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, raised_on:e.target.value}))}} type='datetime-local' name='raised_on' placeholder='Rasied On' />
        </FormControl>
        <FormControl>
            <FormLabel>Documents </FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs1:e.target.files[0]}))}} name='image' type='file' placeholder='First name' />
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs2:e.target.files[0]}))}} name='image' type='file' placeholder='First name' />
        </FormControl>

        <Button onClick={handleClick} colorScheme='green'>Raise</Button>
    </Flex>
  )
}
