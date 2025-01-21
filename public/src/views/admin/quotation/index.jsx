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
  const {id:RFQ_id} = useParams();
  const [quotationRecords, setQuotationRecords] = useState([]);
  const [randomNumber, setRandomNumber] = useState('');
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const [expireDate, setExpireDate] = useState('');
  const [issueDate, setIssueDate] = useState('');  
  const [note, setNote] = useState('');
  const [selectedRFQ, setSelectedRFQ] = useState('');
  const [rfqs, setRfqs] = useState([]);

  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const selectedFiles = [...e.target.files];
  setFiles(selectedFiles); // Update the state
 
    }
  };
  useEffect(() => {
    // console.log(parms)
    setSelectedRFQ(RFQ_id)
    setRandomNumber(Math.floor(1000 + Math.random() * 9000));
    fetchData();
    const fetchRFQs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/RFQ`);
        if (response.data && Array.isArray(response.data.data.requests)) {
          setRfqs(response.data.data.requests);
        } else {
          console.error('Unexpected data format:', response.data);
          setRfqs([]);
        }
      } catch (error) {
        setRfqs([]);
      }
    };
    fetchRFQs();
  }, [RFQ_id]);

  const fetchData = useCallback(async () => {
    // try {
    //   const [rfqResponse, itemsResponse, unitsResponse] = await Promise.all([
    //     axios.get(`${process.env.REACT_APP_API_URL}/RFQ/${id}`)
    //     // axios.get(`${process.env.REACT_APP_API_URL}/items`),
    //     // axios.get(`${process.env.REACT_APP_API_URL}/units`)
    //   ]);

      // setItems(itemsResponse.data || []);
      // setUnits(unitsResponse.data || []);

      // let rfqArray = rfqResponse.data;
      // rfqArray = rfqArray.filter(item => item !== null && item !== undefined && Object.keys(item).length !== 0);

      // if (rfqArray.length > 0) {
      //   const rfq = rfqArray[0];

      //   const fetchedIssueDate = rfq.issue_date || '';
      //   setIssueDate(fetchedIssueDate);

      //   if (fetchedIssueDate) {
      //     const expireDate = addMonths(new Date(fetchedIssueDate), 1);
      //     setExpireDate(format(expireDate, 'yyyy-MM-dd'));
      //   }

        // const mappedDetails = (rfq.details || []).map(detail => ({
        //   item: detail.item_id || '', // item_id is included here but will be excluded later in the update request
        //   qty: detail.qty || 0,
        //   unit: detail.unit_id || '',
        //   availableQty: detail.available_qty || 0, // changed from admin_qty to available_qty
        //   price: detail.unit_price || 0,
        // }));

        // setQuotationRecords(mappedDetails);
    //   } else {
    //     console.error('No valid RFQ data found');
    //   }
    // } catch (error) {
    //   console.error('Error fetching RFQ data:', error);
    // }
  }, [RFQ_id]);

  const handleSave = async () => {
    try {
      // const filteredRecords = quotationRecords.map(record => ({
      //   available_qty: record.availableQty, // changed from admin_qty to available_qty
      //   unit_price: record.price,
      // }));

      await axios.post(`${process.env.REACT_APP_API_URL}/Quotations`, {
        title: `Quotation-${randomNumber}`,
        expire_date: expireDate,
        note: note,
        rfq_id:selectedRFQ,
        files:files
      },
      {
        headers: { 'Content-Type': 'multipart/form-data' }
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
        {/* <FormControl>
          <FormLabel fontWeight="bold">Address</FormLabel>
          <Textarea
            placeholder="Enter address"
            size="md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </FormControl> */}
<FormControl>
          <FormLabel fontWeight="bold">RFQ</FormLabel>
          <Select
            placeholder="Select RFQ"
            size="md"
            value={selectedRFQ}
            onChange={(e) => setSelectedRFQ(e.target.value)}
          >
            {rfqs.map((RFQ) => (
              <option key={RFQ.id} value={RFQ.id}>
                {RFQ.title}
              </option>
            ))}
          </Select>
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
      
      <Button colorScheme="blue" mt={6} onClick={handleSave}>
        Save Quotation
      </Button>
    </Box>
  );
}

export default Quotation;
