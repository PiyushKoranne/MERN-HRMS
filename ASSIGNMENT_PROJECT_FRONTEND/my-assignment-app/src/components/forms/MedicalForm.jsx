import {Button, Flex, FormControl, FormLabel, Heading, Input, Select} from '@chakra-ui/react'
import {useState} from 'react';

export default function MedicalForm({handleSubmit, logger}) {
    
    const [thisForm, setForm] = useState({ request_type:"MEDICAL LEAVE"});
    console.log(thisForm);
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
        <Heading size='md' mt='20px'>Medical Leave</Heading>
        <FormControl>
            <FormLabel>Request Type</FormLabel>
            <Select name='request_type'  isDisabled value='MEDICAL LEAVE' placeholder="MEDICAL LEAVE" colorScheme='purple'>
                
            </Select>
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Rasied On</FormLabel>
            <Input type='datetime-local' onChange={(e)=>{setForm(prev=>({...prev, raised_on:e.target.value}))}} name='raised_on' placeholder='Rasied On' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>From</FormLabel>
            <Input type='datetime-local' name='start_date' onChange={(e)=>{setForm(prev=>({...prev, start_date:e.target.value}))}} placeholder='From' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>To</FormLabel>
            <Input type='datetime-local' onChange={(e)=>{setForm(prev=>({...prev, end_date:e.target.value}))}} name='end_date' placeholder='To' />
        </FormControl>
        <FormControl>
            <FormLabel>Documents </FormLabel>
            <Input name='image' type='file' placeholder='First name' onChange={(e)=>{setForm(prev=>({...prev, doc1:e.target.files[0]}))}} />
            <Input name='image' type='file' placeholder='First name' onChange={(e)=>{setForm(prev=>({...prev, doc2:e.target.files[0]}))}} />
        </FormControl>

        <Button onClick={handleClick} colorScheme='purple'>Raise</Button>
    </Flex>
  )
}
