import {
  Box,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function ViewRFQ() {
  const { id } = useParams(); 
  const location = useLocation();
  const { rfq } = location.state || {};

  const [rfqRecords, setRfqRecords] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [note, setNote] = useState('');

  const fetchRFQData = useCallback(async () => {
    try {
      console.log("Fetching RFQ data for ID:", id);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/RFQ/${id}`);
      console.log("API Response:", response.data);

      let rfqArray = response.data;

      rfqArray = rfqArray.filter(item => item !== null && item !== undefined && Object.keys(item).length !== 0);

      if (rfqArray.length > 0) {
        const rfq = rfqArray[0]; 

        console.log("Valid RFQ data found:", rfq);

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
    console.log("Location RFQ state:", rfq);
    if (rfq) {
      const validDetails = (rfq.details || []).filter(detail => detail && Object.keys(detail).length > 0);
      setRfqRecords(validDetails);

      setSelectedClientId(rfq.client_id);
      setSelectedProjectId(rfq.project_id);
      setIssueDate(rfq.issue_date);
      setNote(rfq.note);
    } else {
      fetchRFQData();
    }
  }, [rfq, fetchRFQData]);

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        View RFQ
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Title</FormLabel>
          <Input value={`RFQ-${rfq ? rfq.id : ''}`} isReadOnly={true} size="md" />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Client</FormLabel>
          <Select
            placeholder="Select client"
            size="md"
            isDisabled={true}
            value={selectedClientId}
          >
            {rfq?.clients?.filter(client => client && Object.keys(client).length > 0).map((client) => (
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
            isDisabled={true}
            value={selectedProjectId}
          >
            {rfq?.projects?.filter(project => project && Object.keys(project).length > 0).map((project) => (
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
            isDisabled={true}
            value={issueDate}
          />
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Note</FormLabel>
          <Textarea
            placeholder="Enter your notes here"
            size="md"
            isDisabled={true}
            value={note}
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
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4} alignItems="center">
            <FormControl>
              {index === 0 && <FormLabel fontWeight="bold">Item</FormLabel>}
              <Select
                placeholder="Select item"
                size="md"
                isDisabled={true}
                value={record.item}
              >
                {rfq?.items?.filter(item => item && Object.keys(item).length > 0).map((item) => (
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
                isDisabled={true}
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
                isDisabled={true}
                value={record.unit}
              >
                {rfq?.units?.filter(unit => unit && Object.keys(unit).length > 0).map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Box>
      ))}
    </Box>
  );
}

export default ViewRFQ;
