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
import { useState, useEffect, useCallback } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

function EditRFQ() {
  const { id } = useParams(); 
  const history = useHistory();

  const [rfqRecords, setRfqRecords] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [note, setNote] = useState('');

  // Memoized fetchRFQData function using useCallback
  const fetchRFQData = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/RFQ/${id}`);
      let rfqArray = response.data;
  
      // Filter out empty entries
      rfqArray = rfqArray.filter(item => item !== null && item !== undefined && Object.keys(item).length !== 0);
  
      if (rfqArray.length > 0) {
        const rfq = rfqArray[0]; // Assuming you want the first valid entry
    
        setSelectedClientId(rfq.client_id || '');
        setSelectedProjectId(rfq.project_id || '');
        setIssueDate(rfq.issue_date || '');
        setNote(rfq.note || '');
    
        const mappedDetails = (rfq.details || []).map(detail => ({
          item: detail.item_id || '',
          qty: detail.qty || 0,
          unit: detail.unit_id || ''
        }));
    
        setRfqRecords(mappedDetails);
      } else {
        console.error('No valid RFQ data found');
      }
    } catch (error) {
      console.error('Error fetching RFQ data:', error);
    }
  }, [id]);
  
  
  
  useEffect(() => {
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
    fetchRFQData(); 
  }, [fetchRFQData]);

  const handleAddRecord = () => {
    setRfqRecords([...rfqRecords, { item: '', qty: 0, unit: '' }]);
  };

  const handleDeleteRecord = (indexToDelete) => {
    setRfqRecords(rfqRecords.filter((_, index) => index !== indexToDelete));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/RFQ/${id}`, {
        client_id: selectedClientId,
        project_id: selectedProjectId,
        issue_date: issueDate,
        note: note,
        details: rfqRecords.map((record) => ({
          item_id: record.item,
          qty: record.qty,
          unit_id: record.unit,
        })),
      });
      history.push('/admin/rfq-management');
    } catch (error) {
      console.error('Error saving RFQ:', error);
    }
  };

  console.log(selectedClientId)

  console.log(issueDate)



  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        Edit RFQ
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Client</FormLabel>
          <Select
            placeholder="Select client"
            size="md"
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

        <FormControl>
          <FormLabel fontWeight="bold">Issue Date</FormLabel>
          <Input
            type="date"
            size="md"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Note</FormLabel>
          <Textarea
            placeholder="Enter your notes here"
            size="md"
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
          <Grid templateColumns={{ base: '1fr', md: 'repeat(4, 1fr) auto' }} gap={4} alignItems="center">
            <FormControl>
              {index === 0 && <FormLabel fontWeight="bold">Item</FormLabel>}
              <Select
                placeholder="Select item"
                size="md"
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
              {index === 0 && <FormLabel fontWeight="bold">Qty</FormLabel>}
              <NumberInput
                min={0}
                size="md"
                value={record.qty}
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
              {index === 0 && <FormLabel fontWeight="bold">Unit</FormLabel>}
              <Select
                placeholder="Select unit"
                size="md"
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

            <IconButton
              aria-label="Delete record"
              icon={<DeleteIcon />}
              colorScheme="red"
              onClick={() => handleDeleteRecord(index)}
            />
          </Grid>
        </Box>
      ))}

      <Box mt={8}>
        <HStack spacing={4} justifyContent="flex-start">
          <Button onClick={handleAddRecord} colorScheme="teal">
            Add Record
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            Save Changes
          </Button>
        </HStack>
      </Box>
    </Box>
  );
}

export default EditRFQ;
