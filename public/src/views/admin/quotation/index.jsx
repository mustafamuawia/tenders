import {
  Box,
  Button,
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
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import { addMonths, format } from 'date-fns';

function Quotation() {
  const history = useHistory();
  const { id } = useParams();

  const [quotationRecords, setQuotationRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [expireDate, setExpireDate] = useState('');
  const [issueDate, setIssueDate] = useState('');  
  const [note, setNote] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));
    fetchData();
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      const [rfqResponse, itemsResponse, unitsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/RFQ/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/items`),
        axios.get(`${process.env.REACT_APP_API_URL}/units`)
      ]);

      setItems(itemsResponse.data || []);
      setUnits(unitsResponse.data || []);

      let rfqArray = rfqResponse.data;
      rfqArray = rfqArray.filter(item => item !== null && item !== undefined && Object.keys(item).length !== 0);

      if (rfqArray.length > 0) {
        const rfq = rfqArray[0];

        const fetchedIssueDate = rfq.issue_date || '';
        setIssueDate(fetchedIssueDate);

        if (fetchedIssueDate) {
          const expireDate = addMonths(new Date(fetchedIssueDate), 1);
          setExpireDate(format(expireDate, 'yyyy-MM-dd'));
        }

        const mappedDetails = (rfq.details || []).map(detail => ({
          item: detail.item_id || '', // item_id is included here but will be excluded later in the update request
          qty: detail.qty || 0,
          unit: detail.unit_id || '',
          adminQty: detail.admin_qty || 0,
          price: detail.unit_price || 0,
        }));

        setQuotationRecords(mappedDetails);
      } else {
        console.error('No valid RFQ data found');
      }
    } catch (error) {
      console.error('Error fetching RFQ data:', error);
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const filteredRecords = quotationRecords.map(record => ({
        admin_qty: record.adminQty,
        unit_price: record.price,
      }));

      await axios.put(`${process.env.REACT_APP_API_URL}/quotations/${id}`, {
        title: `Quotation-${randomNumber}`,
        expire_date: expireDate,
        note: note,
        address: address,
        details: filteredRecords,
      });
      history.push('/admin/rfq-management');
    } catch (error) {
      console.error('Error saving quotation:', error);
    }
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Box as="h2" fontSize="3xl" fontWeight="bold" mb={6}>
        Quotation
      </Box>

      <FormControl>
        <FormLabel fontWeight="bold">Title</FormLabel>
        <Input value={`Quotation-${randomNumber}`} isReadOnly size="md" />
      </FormControl>

      <Grid templateColumns="1fr" gap={4} mt={6}>
        <FormControl>
          <FormLabel fontWeight="bold">Address</FormLabel>
          <Textarea
            placeholder="Enter address"
            size="md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="bold">Expire Date</FormLabel>
          <Input
            type="date"
            size="md"
            value={expireDate}
            onChange={(e) => setExpireDate(e.target.value)}
          />
        </FormControl>

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

      {quotationRecords.length > 0 && (
        <Box mt={6} mb={4}>
          <Box as="h3" fontSize="xl" fontWeight="bold">
            Quotation Details
          </Box>
        </Box>
      )}

      {quotationRecords.map((record, index) => (
        <Box key={index} mt={4} p={4} border="1px solid" borderColor="gray.200" borderRadius="md">
          <Grid templateColumns={{ base: '1fr', md: 'repeat(6, 1fr)' }} gap={4} alignItems="center">
            <FormControl>
              <FormLabel fontWeight="bold">Item</FormLabel>
              <Select
                placeholder="Select item"
                size="md"
                value={record.item}
                isDisabled
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
                isDisabled
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
                onChange={(value) => {
                  const updatedRecords = [...quotationRecords];
                  updatedRecords[index].adminQty = Number(value);
                  setQuotationRecords(updatedRecords);
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
                value={record.unit}
                isDisabled
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel fontWeight="bold">Price</FormLabel>
              <NumberInput
                min={0}
                precision={2}
                step={0.01}
                size="md"
                value={record.price}
                onChange={(value) => {
                  const updatedRecords = [...quotationRecords];
                  updatedRecords[index].price = Number(value);
                  setQuotationRecords(updatedRecords);
                }}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Grid>
        </Box>
      ))}

      <Button colorScheme="blue" mt={6} onClick={handleSave}>
        Save Quotation
      </Button>
    </Box>
  );
}

export default Quotation;
