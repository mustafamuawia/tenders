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
import axios from 'axios';

function AddRFQ() {
  const [rfqRecords, setRfqRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);


  useEffect(() => {
    // Generate a random number between 1000 and 9999
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));

    // Fetch clients' data
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const fetchUnits = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/units`);
        setUnits(response.data);
      } catch (error) {
        console.error('Error fetching units:', error);
      }
    };

    fetchClients();
    fetchProjects();
    fetchItems();
    fetchUnits();
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
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Project</FormLabel>
          <Select placeholder="Select project" size="md">
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
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
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name}
                  </option>
                ))}
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
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
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
