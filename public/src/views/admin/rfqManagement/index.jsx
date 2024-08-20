import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom'; // or useNavigate if using react-router v6

function RFQManagement() {
  const [rfqs, setRfqs] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedRfq, setSelectedRfq] = useState(null);
  const history = useHistory(); // or useNavigate if using react-router v6

  useEffect(() => {
    // Fetch all RFQs
    const fetchRfqs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/rfqs`);
        console.log('API Response:', response.data); // Log the response data for debugging

        // Check if the data is an array
        if (Array.isArray(response.data)) {
          setRfqs(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setRfqs([]); // Set to an empty array if data is not an array
        }
      } catch (error) {
        console.error('Error fetching RFQs:', error);
        setRfqs([]); // Set to an empty array on error
      }
    };

    fetchRfqs();
  }, []);

  const handleEdit = (rfq) => {
    history.push(`/rfq/edit/${rfq.id}`); // Navigate to the edit page with the RFQ id
  };

  const handleDelete = (rfq) => {
    setSelectedRfq(rfq);
    onOpen(); // Open the delete confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/rfqs/${selectedRfq.id}`);
      setRfqs(rfqs.filter(rfq => rfq.id !== selectedRfq.id));
      onClose();
    } catch (error) {
      console.error('Error deleting RFQ:', error);
    }
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Heading as="h1" size="xl" mb={6}>
        RFQ Management
      </Heading>

      <Stack spacing={4}>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Client</Th>
              <Th>Project</Th>
              <Th>Issue Date</Th>
              <Th>Expire Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rfqs.length > 0 ? (
              rfqs.map(rfq => (
                <Tr key={rfq.id}>
                  <Td>{rfq.title}</Td>
                  <Td>{rfq.client_name}</Td>
                  <Td>{rfq.project_name}</Td>
                  <Td>{rfq.issue_date}</Td>
                  <Td>{rfq.expire_date}</Td>
                  <Td>
                    <IconButton
                      aria-label="Edit RFQ"
                      icon={<EditIcon />}
                      onClick={() => handleEdit(rfq)}
                      mr={2}
                    />
                    <IconButton
                      aria-label="Delete RFQ"
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleDelete(rfq)}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="6">No RFQs available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete RFQ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete the RFQ titled "{selectedRfq?.title}"?
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDelete}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Box>
  );
}

export default RFQManagement;
