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

function EditQuotation() {
  const history = useHistory();
  const { id } = useParams(); // Quotation ID
  
  const [quotationRecords, setQuotationRecords] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [expireDate, setExpireDate] = useState('');
  const [note, setNote] = useState('');
  const [address, setAddress] = useState('');
  
  // State to hold RFQ data
  const [rfqData, setRfqData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = useCallback(async () => {
    try {
      // Fetch RFQ data using RFQ ID
      const rfqResponse = await axios.get(`${process.env.REACT_APP_API_URL}/RFQ/${id}`);
      setRfqData(rfqResponse.data);

      const [quotationResponse, itemsResponse, unitsResponse] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/quotations/${id}`),
        axios.get(`${process.env.REACT_APP_API_URL}/items`),
        axios.get(`${process.env.REACT_APP_API_URL}/units`)
      ]);

      setItems(itemsResponse.data || []);
      setUnits(unitsResponse.data || []);

      const quotation = quotationResponse.data;

      if (quotation) {
        setExpireDate(quotation.expire_date || '');
        setNote(quotation.note || '');
        setAddress(quotation.address || '');

        const mappedDetails = (quotation.details || []).map(detail => ({
          item: detail.item_id || '', // item_id should not be included in the update request
          qty: detail.qty || 0,
          unit: detail.unit_id || '',
          adminQty: detail.admin_qty || 0,
          price: detail.unit_price || 0,
        }));

        setQuotationRecords(mappedDetails);
      } else {
        console.error('No valid Quotation data found');
      }
    } catch (error) {
      console.error('Error fetching Quotation data:', error);
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const filteredRecords = quotationRecords.map(record => ({
        admin_qty: record.adminQty,
        unit_price: record.price,
      }));

      await axios.put(`${process.env.REACT_APP_API_URL}/quotations/${id}`, {
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
        Edit Quotation
      </Box>

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
        Save Changes
      </Button>
    </Box>
  );
}

export default EditQuotation;
