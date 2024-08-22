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
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function AddRFQ() {
  const location = useLocation();
  const { mode, rfq } = location.state || {};
  const isViewMode = mode === 'view';
  
  const history = useHistory(); 

  const [rfqRecords, setRfqRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);

  // Define missing state variables
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));
    fetchClients();
    fetchProjects();
    fetchItems();
    fetchUnits();

    if (rfq) {
      setRfqRecords(rfq.details || []);
      setSelectedClientId(rfq.client_id);
      setSelectedProjectId(rfq.project_id);
      setIssueDate(rfq.issue_date);
      setExpireDate(rfq.expire_date);
      setNote(rfq.note);
    }
  }, [rfq]);

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

  const handleAddRecord = () => {
    setRfqRecords([...rfqRecords, { item: '', qty: 0, adminQty: 0, price: 0, unit: '', rfq: '' }]);
  };

  const handleDeleteRecord = (indexToDelete) => {
    setRfqRecords(rfqRecords.filter((_, index) => index !== indexToDelete));
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/RFQ`, {
        title: `RFQ-${randomNumber}`,
        client_id: selectedClientId,
        project_id: selectedProjectId,
        issue_date: issueDate,
        expire_date: expireDate,
        note: note,
        details: rfqRecords.map(record => ({
          item_id: record.item,
          qty: record.qty,
          admin_qty: record.adminQty,
          unit_id: record.unit,
          unit_price: record.price,
        })),
      });
      // Handle success
      history.push('/admin/rfq-management');  // Redirect or show a success message
    } catch (error) {
      console.error('Error saving RFQ:', error);
      // Handle error
    }
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        {isViewMode ? 'View RFQ' : 'Add/Edit RFQ'}
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
        <FormControl>
          <FormLabel fontWeight="bold">Title</FormLabel>
          <Input value={`RFQ-${randomNumber}`} isReadOnly={true} size="md" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Client</FormLabel>
          <Select
            placeholder="Select client"
            size="md"
            isDisabled={isViewMode}
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.client_name}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Project</FormLabel>
          <Select
            placeholder="Select project"
            size="md"
            isDisabled={isViewMode}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
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
          <Input
            type="date"
            size="md"
            isDisabled={isViewMode}
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Expire Date</FormLabel>
          <Input
            type="date"
            size="md"
            isDisabled={isViewMode}
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Note</FormLabel>
          <Textarea
            placeholder="Enter your notes here"
            size="md"
            isDisabled={isViewMode}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </FormControl>
      </Grid>

      {rfqRecords.length > 0 && (
        <Box mt={6} mb={4}>
          <Box as="h3" fontSize="xl" fontWeight="bold">
            RFQ Details
          </Box>
        </Box>
      )}

      {rfqRecords.map((record, index) => (
        <Box key={index} mt={4} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(6, 1fr) auto' }} gap={4} alignItems="center">
            <FormControl>
              <FormLabel fontWeight="bold">Item</FormLabel>
              <Select
                placeholder="Select item"
                size="md"
                isDisabled={isViewMode}
                value={record.item}
                onChange={(e) => {
                  const updatedRecords = [...rfqRecords];
                  updatedRecords[index].item = e.target.value;
                  setRfqRecords(updatedRecords);
                }}
              >
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Qty</FormLabel>
              <NumberInput
                min={0}
                size="md"
                value={record.qty}
                isDisabled={isViewMode}
                onChange={(value) => {
                  const updatedRecords = [...rfqRecords];
                  updatedRecords[index].qty = Number(value);
                  setRfqRecords(updatedRecords);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Admin Qty</FormLabel>
              <NumberInput
                min={0}
                size="md"
                value={record.adminQty}
                isDisabled={isViewMode}
                onChange={(value) => {
                  const updatedRecords = [...rfqRecords];
                  updatedRecords[index].adminQty = Number(value);
                  setRfqRecords(updatedRecords);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Price</FormLabel>
              <NumberInput
                min={0}
                size="md"
                value={record.price}
                isDisabled={isViewMode}
                onChange={(value) => {
                  const updatedRecords = [...rfqRecords];
                  updatedRecords[index].price = Number(value);
                  setRfqRecords(updatedRecords);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Unit</FormLabel>
              <Select
                placeholder="Select unit"
                size="md"
                isDisabled={isViewMode}
                value={record.unit}
                onChange={(e) => {
                  const updatedRecords = [...rfqRecords];
                  updatedRecords[index].unit = e.target.value;
                  setRfqRecords(updatedRecords);
                }}
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {!isViewMode && (
              <IconButton
                aria-label="Delete record"
                icon={<DeleteIcon />}
                colorScheme="red"
                size="sm"
                mt={2}
                alignSelf="end"
                onClick={() => handleDeleteRecord(index)}
              />
            )}
          </Grid>
        </Box>
      ))}

      {!isViewMode && (
        <HStack spacing={4} mt={4}>
          <Button colorScheme="teal" size="md" onClick={handleAddRecord}>
            Add RFQ Record
          </Button>
        </HStack>
      )}

      {!isViewMode && (
        <HStack spacing={4} mt={6}>
          <Button colorScheme="teal" size="md" onClick={handleSave}>
            Save
          </Button>
        </HStack>
      )}
    </Box>
  );
}

export default AddRFQ;
