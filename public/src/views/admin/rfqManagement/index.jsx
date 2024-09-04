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
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function RFQManagement() {
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  useEffect(() => {
    const fetchRfqs = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/RFQ`);
        if (response.data && Array.isArray(response.data.data.requests)) {
          const rfqs = response.data.data.requests.map(rfq => {
            // Provide default objects for missing client or project data
            if (!rfq.client_id) {
              rfq.client = { client_name: 'No client info' };
            }
            if (!rfq.project_id) {
              rfq.project = { name: 'No project info' }; // Default project object
            }
            return rfq;
          });
          setRfqs(rfqs);
        } else {
          console.error('Unexpected data format:', response.data);
          setRfqs([]);
        }
      } catch (error) {
        console.error('Error loading RFQs:', error);
        setRfqs([]);
      }
    };
  
    fetchRfqs();
  }, []);
  
  // Function to calculate expire date as one month from issue date
  const calculateExpireDate = (issueDate) => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + 1); // Add one month to issue date
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const handleView = (rfq) => {
    history.push(`/admin/view-rfq/${rfq.id}/view`);
  };

  const handleEdit = (rfq) => {
    history.push(`/admin/edit-rfq/${rfq.id}/edit`);
  };

  const handleQuotation = (rfq) => {
    history.push(`/admin/quotation/${rfq.id}/Details`);
  };

  const handleEditQuotation = (rfq) => {
    history.push(`/admin/edit-quot/${rfq.id}/edit`);
  };

  const handleAdd = () => {
    history.push('/admin/add-rfq');
  };

  const handleDelete = async () => {
    if (selectedRfq) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/RFQ/${selectedRfq.id}`);
        setRfqs(rfqs.filter(existingRfq => existingRfq.id !== selectedRfq.id));
      } catch (error) {
        console.error('Error deleting RFQ:', error);
      } finally {
        onClose();
      }
    }
  };

  const openDeleteModal = (rfq) => {
    setSelectedRfq(rfq);
    onOpen();
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        RFQ Management
      </Heading>

      <Stack spacing={4}>
        {/* Add RFQ Button */}
        <Button
          colorScheme="teal"
          onClick={handleAdd}
          mb={4}
          borderRadius="full"
          height="56px"
          width={{ base: '100%', sm: '250px' }} // Responsive width
          fontWeight="bold"
          fontSize="md"
          boxShadow="md"
          textAlign="center"
          variant="solid"
          mx={{ base: 'auto', sm: '0' }} // Center button on small screens
        >
          + Add RFQ
        </Button>

        <Table variant="striped" colorScheme="teal" size={{ base: 'sm', md: 'md' }}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Client</Th>
              <Th>Project</Th>
              <Th>Issue Date</Th>
              <Th>Expire Date</Th>
              <Th>Quotation</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rfqs.length > 0 ? (
              rfqs.map((rfq) => (
                <Tr key={rfq.id}>
                  <Td>{rfq.title}</Td>
                  <Td>{rfq.client ? rfq.client.client_name : 'No client info'}</Td>
                  <Td>{rfq.project.name}</Td>
                  <Td>{rfq.issue_date}</Td>
                  <Td>{calculateExpireDate(rfq.issue_date)}</Td> {/* Updated expire date */}
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Quotation"
                        icon={<FaFileInvoiceDollar />}
                        onClick={() => handleQuotation(rfq)}
                        colorScheme="blue"
                        size="sm"
                      />
                      <IconButton
                        aria-label="Edit Quotation"
                        icon={<EditIcon />}
                        onClick={() => handleEditQuotation(rfq)}
                        colorScheme="yellow"
                        size="sm"
                      />
                    </Flex>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="View RFQ"
                        icon={<ViewIcon />}
                        onClick={() => handleView(rfq)}
                        size="sm"
                      />
                      <IconButton
                        aria-label="Edit RFQ"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(rfq)}
                        size="sm"
                      />
                      <IconButton
                        aria-label="Delete RFQ"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => openDeleteModal(rfq)}
                        size="sm"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="7">No RFQs available</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Stack>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this RFQ? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="gray" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default RFQManagement;
