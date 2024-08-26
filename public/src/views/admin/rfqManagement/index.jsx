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
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function RFQManagement() {
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const history = useHistory(); 

  useEffect(() => {
    const fetchRfqs = async () => {
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

    fetchRfqs();
  }, []);

  const handleView = (rfq) => {
    setIsEditMode(false);
    setSelectedRfq(rfq);
    history.push(`/admin/add-rfq/${rfq.id}/view`, { mode: 'view', rfq });
  };
  
  const handleEdit = (rfq) => {
    setIsEditMode(true);
    setSelectedRfq(rfq);
    history.push(`/admin/add-rfq/${rfq.id}/edit`, { mode: 'edit', rfq });
  };
  const handleAdd = () => {
    history.push('/admin/add-rfq'); // Redirect to the Add RFQ page
  };

  const handleDelete = async () => {
    if (selectedRfq) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/rfqs/${selectedRfq.id}`);
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
      <Heading as="h1" size="xl" mb={6}>
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
          width="250px"
          fontWeight="bold"
          fontSize="md"
          boxShadow="md"
          textAlign="center"
          variant="solid"
        >
          + Add RFQ
        </Button>

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
                  <Td>{rfq.client.client_name}</Td>
                  <Td>{rfq.project.name}</Td>
                  <Td>{rfq.issue_date}</Td>
                  <Td>{rfq.expire_date}</Td>
                  <Td>
                    <IconButton
                      aria-label="View RFQ"
                      icon={<ViewIcon />}
                      onClick={() => handleView(rfq)}
                      mr={2}
                    />
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
                      onClick={() => openDeleteModal(rfq)}
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
