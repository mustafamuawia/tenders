import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Grid,
    Input,
    Select,
    Textarea,
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
  
  function Quotation() {
    const location = useLocation();
    const { mode, quotation } = location.state || {};
    const isViewMode = mode === 'view';
  
    const history = useHistory();
  
    const [quotationRecords, setQuotationRecords] = useState([]);
    const [randomNumber, setRandomNumber] = useState('');
    const [items, setItems] = useState([]);
    const [units, setUnits] = useState([]);
    const [expireDate, setExpireDate] = useState('');
    const [note, setNote] = useState('');
    const [address, setAddress] = useState(''); // Address state
  
    useEffect(() => {
      setRandomNumber(Math.floor(1000 + Math.random() * 9000));
      fetchItems();
      fetchUnits();
  
      if (quotation) {
        setQuotationRecords(quotation.details || []);
        setExpireDate(quotation.expire_date);
        setNote(quotation.note);
        setAddress(quotation.address || ''); // Set address from quotation if available
      }
    }, [quotation]);
  
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
      setQuotationRecords([...quotationRecords, { item: '', qty: 0, adminQty: 0, price: 0, unit: '', quotation: '' }]);
    };
  
    const handleDeleteRecord = (indexToDelete) => {
      setQuotationRecords(quotationRecords.filter((_, index) => index !== indexToDelete));
    };
  
    const handleSave = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/quotations`, {
          title: `Quotation-${randomNumber}`,
          expire_date: expireDate,
          note: note,
          address: address, // Include address in the data
          details: quotationRecords.map(record => ({
            item_id: record.item,
            qty: record.qty,
            admin_qty: record.adminQty,
            unit_id: record.unit,
            unit_price: record.price,
          })),
        });
        history.push('/admin/quotation-management');  // Redirect or show a success message
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
          <Input value={`Quotation-${randomNumber}`} isReadOnly={true} size="md" />
        </FormControl>
  
        <Grid templateColumns="1fr" gap={4} mt={6}>
          <FormControl>
            <FormLabel fontWeight="bold">Address</FormLabel>
            <Textarea
              placeholder="Enter address"
              size="md"
              isDisabled={isViewMode}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
  
        {quotationRecords.length > 0 && (
          <Box mt={6} mb={4}>
            <Box as="h3" fontSize="xl" fontWeight="bold">
              Quotation Details
            </Box>
          </Box>
        )}
  
        {quotationRecords.map((record, index) => (
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
                    const updatedRecords = [...quotationRecords];
                    updatedRecords[index].item = e.target.value;
                    setQuotationRecords(updatedRecords);
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
                    const updatedRecords = [...quotationRecords];
                    updatedRecords[index].qty = Number(value);
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
                <FormLabel fontWeight="bold">Admin Qty</FormLabel>
                <NumberInput
                  min={0}
                  size="md"
                  value={record.adminQty}
                  isDisabled={isViewMode}
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
                  isDisabled={isViewMode}
                  value={record.unit}
                  onChange={(e) => {
                    const updatedRecords = [...quotationRecords];
                    updatedRecords[index].unit = e.target.value;
                    setQuotationRecords(updatedRecords);
                  }}
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
                  isDisabled={isViewMode}
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
  
              {!isViewMode && (
                <IconButton
                  aria-label="Delete record"
                  icon={<DeleteIcon />}
                  size="md"
                  colorScheme="red"
                  onClick={() => handleDeleteRecord(index)}
                />
              )}
            </Grid>
          </Box>
        ))}
  
        {!isViewMode && (
          <Button colorScheme="teal" mt={6} onClick={handleAddRecord}>
            Add Quotation Record
          </Button>
        )}
  
        {!isViewMode && (
          <Button colorScheme="blue" mt={6} ml={4} onClick={handleSave}>
            Save Quotation
          </Button>
        )}
      </Box>
    );
  }
  
  export default Quotation;
  