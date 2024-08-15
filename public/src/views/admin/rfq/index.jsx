import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Select,
    Textarea,
    HStack,
    IconButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { DeleteIcon } from '@chakra-ui/icons';
  
  function AddRFQ() {
    const [rfqRecords, setRfqRecords] = useState([]);
  
    const handleAddRecord = () => {
      setRfqRecords([...rfqRecords, { item: '', qty: 0, adminQty: 0, price: 0, unit: '', rfq: '' }]);
    };
  
    const handleDeleteRecord = (indexToDelete) => {
      setRfqRecords(rfqRecords.filter((_, index) => index !== indexToDelete));
    };
  
    return (
      <Box p={10} maxWidth="1400px" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
        <Box as="h2" fontSize="3xl" fontWeight="bold" mb={10}>
          Add RFQ
        </Box>
  
        <Grid templateColumns="repeat(3, 1fr)" gap={8}>
          <FormControl>
            <FormLabel fontWeight="bold">Client</FormLabel>
            <Select placeholder="Select client" size="lg">
              <option value="client1">Client 1</option>
              <option value="client2">Client 2</option>
              <option value="client3">Client 3</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold">Project</FormLabel>
            <Select placeholder="Select project" size="lg">
              <option value="project1">Project 1</option>
              <option value="project2">Project 2</option>
              <option value="project3">Project 3</option>
            </Select>
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold">Issue Date</FormLabel>
            <Input type="date" size="lg" />
          </FormControl>
        </Grid>
  
        <Grid templateColumns="1fr 2fr" gap={8} mt={10}>
          <FormControl>
            <FormLabel fontWeight="bold">Expire Date</FormLabel>
            <Input type="date" size="lg" />
          </FormControl>
  
          <FormControl>
            <FormLabel fontWeight="bold">Note</FormLabel>
            <Textarea placeholder="Enter your notes here" size="lg" />
          </FormControl>
        </Grid>
  
        <Box mt={10} mb={6}>
          <Box as="h3" fontSize="xl" fontWeight="bold">
            RFQ Details
          </Box>
        </Box>
  
        {rfqRecords.map((record, index) => (
          <Box key={index} mt={6}>
            <Grid templateColumns="repeat(6, 1fr)" gap={6} alignItems="center">
              <FormControl>
                <FormLabel fontWeight="bold">Item</FormLabel>
                <Select placeholder="Select item" size="lg">
                  <option value="item1">Item 1</option>
                  <option value="item2">Item 2</option>
                  <option value="item3">Item 3</option>
                </Select>
              </FormControl>
  
              <FormControl>
                <FormLabel fontWeight="bold">Qty</FormLabel>
                <NumberInput min={0} size="lg" defaultValue={0}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
  
              <FormControl>
                <FormLabel fontWeight="bold">Admin Qty</FormLabel>
                <NumberInput min={0} size="lg" defaultValue={0}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
  
              <FormControl>
                <FormLabel fontWeight="bold">Price</FormLabel>
                <NumberInput min={0} size="lg" defaultValue={0} step={1}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
  
              <FormControl>
                <FormLabel fontWeight="bold">Unit</FormLabel>
                <Select placeholder="Select unit" size="lg">
                  <option value="unit1">Unit 1</option>
                  <option value="unit2">Unit 2</option>
                  <option value="unit3">Unit 3</option>
                </Select>
              </FormControl>
  
              <FormControl>
                <FormLabel fontWeight="bold">RFQ</FormLabel>
                <Select placeholder="Select RFQ" size="lg">
                  <option value="rfq1">RFQ 1</option>
                  <option value="rfq2">RFQ 2</option>
                  <option value="rfq3">RFQ 3</option>
                </Select>
              </FormControl>
            </Grid>
  
            <IconButton
              aria-label="Delete record"
              icon={<DeleteIcon />}
              colorScheme="red"
              size="sm" // Reduced size of the delete button
              onClick={() => handleDeleteRecord(index)}
              mt={2} // Adding margin top to place the button below the fields
              alignSelf="end" // Align the delete button to the end
            />
          </Box>
        ))}
  
        <HStack spacing={4} mt={6}>
          <Button colorScheme="teal" size="lg" onClick={handleAddRecord}>
            Add
          </Button>
        </HStack>
  
        <Button colorScheme="teal" mt={10} size="lg">
          Save
        </Button>
      </Box>
    );
  }
  
  export default AddRFQ;
  