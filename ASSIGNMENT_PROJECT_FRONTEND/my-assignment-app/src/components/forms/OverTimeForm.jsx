import {Button, Flex, FormControl, FormLabel, Heading, Input, Select} from '@chakra-ui/react'
import { useState } from 'react';

export default function OvertimeForm({handleSubmit, logger}) {
    const [thisForm, setForm] = useState({ request_type:"OVERTIME"});
    
    const myForm = new FormData();
    myForm.append('request_type', thisForm.request_type);
    myForm.append('raised_by', logger);
    myForm.append('raised_on', thisForm.raised_on);
    myForm.append('start_date', thisForm.start_date);
    myForm.append('end_date', thisForm.end_date);
    myForm.append('image', thisForm.doc1);
    myForm.append('image', thisForm.doc2);

    const handleClick = () => {
        handleSubmit(myForm);
    }
  return (
    <Flex alignItems='center' justifyContent='start' flexDir='column' flexWrap='wrap' w='full' gap='20px'>
        <Heading size='md' mt='20px'>Apply Overtime</Heading>
        <FormControl>
            <FormLabel>Request Type</FormLabel>
            <Select name='request_type' isDisabled value='OVERTIME' placeholder="OVERTIME" colorScheme='purple'>
                
            </Select>
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Rasied On</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, raised_on:e.target.value}))}} name='raised_on' type='datetime-local' placeholder='Rasied On' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>From</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, start_date:e.target.value}))}} name='start_date' type='datetime-local' placeholder='Rasied On' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>To</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, end_date:e.target.value}))}} name='end_date' type='datetime-local' placeholder='Rasied On' />
        </FormControl>
        <FormControl>
            <FormLabel>Documents </FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs1:e.target.files[0]}))}} type='file' name='image' placeholder='First name' />
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs2:e.target.files[0]}))}} type='file' name='image' placeholder='First name' />
        </FormControl>

        <Button onClick={handleClick} colorScheme='blue'>Raise</Button>
    </Flex>
  )
}
