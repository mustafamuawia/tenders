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
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [expireDate, setExpireDate] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
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
          item: detail.item_id || '',
          qty: detail.qty || 0,
          unit: detail.unit_id || '',
          availableQty: detail.available_qty || 0,
          price: detail.unit_price || 0,
          total: detail.available_qty * detail.unit_price || 0, // Initialize total
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
        available_qty: record.availableQty,
        unit_price: record.price,
        total: record.total, // Include total in the save data if needed
      }));

      await axios.post(`${process.env.REACT_APP_API_URL}/Quotation`, {
        title: 'Quotation',
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
        <Input placeholder="Quotation"  size="md" />
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
                  <FormLabel fontWeight="bold">Available Qty</FormLabel>
                  <NumberInput
                    min={0}
                    size="md"
                    value={record.availableQty}
                    onChange={(value) => {
                      const updatedRecords = [...quotationRecords];
                      updatedRecords[index].availableQty = Number(value);
                      updatedRecords[index].total = Number(value) * record.price; // Update total on qty change
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
                      updatedRecords[index].total = record.availableQty * Number(value); // Update total on price change
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
                  <FormLabel fontWeight="bold">Total</FormLabel>
                  <Input
                    size="md"
                    value={record.total.toFixed(2)}
                    isReadOnly
                  />
                </FormControl>
              </Grid>
            </Box>
          ))}
        </Box>
      )}

      <Button colorScheme="blue" mt={6} onClick={handleSave}>
        Save Quotation
      </Button>
    </Box>
  );
}

export default Quotation;
