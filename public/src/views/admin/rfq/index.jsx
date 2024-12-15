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
  Spinner,
  Text
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useHistory } from 'react-router-dom';
import loader from 'views/admin/loader'
import axios from 'axios';

function AddRFQ() {
  const history = useHistory();

  const [rfqRecords, setRfqRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));
    fetchClients();
    fetchProjects();
    fetchItems();
    fetchUnits();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = [...e.target.files];
  setFiles(selectedFiles); // Update the state
 
    }
  };
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
    setRfqRecords([...rfqRecords, { item: '', qty: 0, unit: '' }]);
  };

  const handleDeleteRecord = (indexToDelete) => {
    setRfqRecords(rfqRecords.filter((_, index) => index !== indexToDelete));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/RFQ`, {
        title: `RFQ-${randomNumber}`,
        client_id: selectedClientId,
        project_id: selectedProjectId,
        issue_date: issueDate,
        expire_date: expireDate,
        note: note,
        files: files
        // details: rfqRecords.map(record => ({
        //   item_id: record.item,
        //   qty: record.qty,
        //   unit_id: record.unit,
        // })),
      },
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      history.push('/admin/rfq-management');
    } catch (error) {
      console.error('Error saving RFQ:', error);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        Add RFQ
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Title</FormLabel>
          <Input value={`RFQ-${randomNumber}`} isReadOnly={true} size="md" />
        </FormControl>

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
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={6}>
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

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">File(s)</FormLabel>
          <Input
           type="file"
           multiple 
           accept=".pdf, .doc, .docx, .jpg, .jpeg, .png, .tiff, .gif, .xls, .xlsx, .csv"
           onChange={handleFileChange}
            size="md" />

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
          {/* <Button onClick={handleAddRecord} colorScheme="teal">
            Add Record
          </Button> */}
          <Button onClick={handleSave} colorScheme="blue">
            Save
          </Button>
        </HStack>
      </Box>
       {/* Floated Loader */}
       {loading && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="rgba(0, 0, 0, 0.5)" // Semi-transparent background
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="10"
        >
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            color="white"
            emptyColor="gray.300"
          />
          <Text mt={4} fontSize="lg" color="white" ml={4}>
            Loading...
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default AddRFQ;
