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
import { useState, useEffect } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';

function AddRFQ() {
  const [rfqRecords, setRfqRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');

  useEffect(() => {
    // Generate a random number between 1000 and 9999
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));
  }, []);

  const handleAddRecord = () => {
    setRfqRecords([...rfqRecords, { item: '', qty: 0, adminQty: 0, price: 0, unit: '', rfq: '' }]);
  };

  const handleDeleteRecord = (indexToDelete) => {
    setRfqRecords(rfqRecords.filter((_, index) => index !== indexToDelete));
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        Add RFQ
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        <FormControl>
          <FormLabel fontWeight="bold">Title</FormLabel>
          <Input value={`RFQ-${randomNumber}`} isReadOnly size="md" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Client</FormLabel>
          <Select placeholder="Select client" size="md">
            <option value="client1">Client 1</option>
            <option value="client2">Client 2</option>
            <option value="client3">Client 3</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Project</FormLabel>
          <Select placeholder="Select project" size="md">
            <option value="project1">Project 1</option>
            <option value="project2">Project 2</option>
            <option value="project3">Project 3</option>
          </Select>
        </FormControl>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Issue Date</FormLabel>
          <Input type="date" size="md" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Expire Date</FormLabel>
          <Input type="date" size="md" />
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Note</FormLabel>
          <Textarea placeholder="Enter your notes here" size="md" />
        </FormControl>
      </Grid>

      <Box mt={6} mb={4}>
        <Box as="h3" fontSize="xl" fontWeight="bold">
          RFQ Details
        </Box>
      </Box>

      {rfqRecords.map((record, index) => (
        <Box key={index} mt={4} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(6, 1fr) auto' }} gap={4} alignItems="center">
            <FormControl>
              <FormLabel fontWeight="bold">Item</FormLabel>
              <Select placeholder="Select item" size="md">
                <option value="item1">Item 1</option>
                <option value="item2">Item 2</option>
                <option value="item3">Item 3</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Qty</FormLabel>
              <NumberInput min={0} size="md" defaultValue={0}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Admin Qty</FormLabel>
              <NumberInput min={0} size="md" defaultValue={0}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Price</FormLabel>
              <NumberInput min={0} size="md" defaultValue={0} step={1}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Unit</FormLabel>
              <Select placeholder="Select unit" size="md">
                <option value="unit1">Unit 1</option>
                <option value="unit2">Unit 2</option>
                <option value="unit3">Unit 3</option>
              </Select>
            </FormControl>
            <IconButton
              aria-label="Delete record"
              icon={<DeleteIcon />}
              colorScheme="red"
              size="sm"
              mt={2}
              alignSelf="end"
              onClick={() => handleDeleteRecord(index)}
            />
          </Grid>
        </Box>
      ))}

      <HStack spacing={4} mt={4}>
        <Button colorScheme="teal" size="sm" onClick={handleAddRecord}>
          Add
        </Button>
      </HStack>

      <Button colorScheme="teal" mt={6} size="lg">
        Save
      </Button>
    </Box>
  );
}

export default AddRFQ;
