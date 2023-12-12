import {Button, Flex, FormControl, FormLabel, Heading, Input, Select} from '@chakra-ui/react'
import {useState} from 'react';

export default function TravelForm({handleSubmit, logger}) {
    const [thisForm, setForm] = useState({ request_type:"TRAVEL"});
    
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
        <Heading size='md' mt='20px'>Apply For Travel</Heading>
        <FormControl>
            <FormLabel>Request Type</FormLabel>
            <Select name='request_type' isDisabled value='TRAVEL' placeholder="TRAVEL" colorScheme='purple'>
                
            </Select>
        </FormControl>
        <FormControl isRequired>
            <FormLabel>Rasied On</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, raised_on:e.target.value}))}} type='datetime-local' name='raised_on' placeholder='Rasied On' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>From</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, start_date:e.target.value}))}} type='datetime-local' name='start_date' placeholder='Rasied On' />
        </FormControl>
        <FormControl isRequired>
            <FormLabel>To</FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, end_date:e.target.value}))}} type='datetime-local' name='end_date' placeholder='Rasied On' />
        </FormControl>
        <FormControl>
            <FormLabel>Documents </FormLabel>
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs1:e.target.files[0]}))}} type='file' placeholder='First name' name='image' />
            <Input onChange={(e)=>{setForm(prev=>({...prev, docs2:e.target.files[0]}))}} type='file' placeholder='First name' name='image' />
        </FormControl>

        <Button onClick={handleClick} colorScheme='teal'>Raise</Button>
    </Flex>
  )
}
