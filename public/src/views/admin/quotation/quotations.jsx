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

function Quotations() {
  const [quotations, setQuotations] = useState([]);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const [userData, setUserData] =useState([]);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
          setUserData(response.data)
        }
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Quotations`);
        if (response.data && Array.isArray(response.data.data.requests)) {
          setQuotations(response.data.data.requests);
        } else {
          console.error('Unexpected data format:', response.data);
          setQuotations([]);
        }
      } catch (error) {
        setQuotations([]);
      }
    };

    fetchQuotations();
  }, []);

  // Function to calculate expire date as one month from issue date
  const calculateExpireDate = (issueDate) => {
    const date = new Date(issueDate);
    date.setMonth(date.getMonth() + 1); // Add one month to issue date
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  const handleView = (Quotation) => {
    history.push(`/admin/view-Quotation/${Quotation.id}/view`);
  };

  const handleEdit = (Quotation) => {
    history.push(`/admin/edit-Quotation/${Quotation.id}/edit`);
  };

  const handleQuotation = (Quotation) => {
    history.push(`/admin/quotation/${Quotation.id}/Details`);
  };

  const handleEditQuotation = (Quotation) => {
    history.push(`/admin/edit-quot/${Quotation.id}/edit`);
  };

  const handleAdd = () => {
    history.push('/admin/add-Quotation');
  };

  const handleDelete = async () => {
    if (selectedQuotation) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/Quotation/${selectedQuotation.id}`);
        setQuotations(Quotations.filter(existingQuotation => existingQuotation.id !== selectedQuotation.id));
      } catch (error) {
        console.error('Error deleting Quotation:', error);
      } finally {
        onClose();
      }
    }
  };

  const openDeleteModal = (Quotation) => {
    setSelectedQuotation(Quotation);
    onOpen();
  };

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Quotation Management
      </Heading>

      <Stack spacing={4}>
        {(userData.role !== 'Admin')&&
        (  
        
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
          + Add Quotation
        </Button>
        )
        }
        <Table variant="striped" colorScheme="teal" size={{ base: 'sm', md: 'md' }}>
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Partner</Th>
              <Th>RFQ</Th>
              <Th>Client</Th>
              <Th>Project</Th>
              <Th>Issue Date</Th>
              <Th>Expire Date</Th>
              <Th>Quotation</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Quotations.length > 0 ? (
              Quotations.map((Quotation) => (
                <Tr key={Quotation.id}>
                  <Td>{Quotation.title}</Td>
                  <Td>{Quotation.partner.CompanyName}</Td>
                  <Td>{Quotation.client.client_name}</Td>
                  <Td>{Quotation.project.name}</Td>
                  <Td>{Quotation.issue_date}</Td>
                  <Td>{calculateExpireDate(Quotation.issue_date)}</Td> {/* Updated expire date */}
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="Quotation"
                        icon={<FaFileInvoiceDollar />}
                        onClick={() => handleQuotation(Quotation)}
                        colorScheme="blue"
                        size="sm"
                      />
                      <IconButton
                        aria-label="Edit Quotation"
                        icon={<EditIcon />}
                        onClick={() => handleEditQuotation(Quotation)}
                        colorScheme="yellow"
                        size="sm"
                      />
                    </Flex>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        aria-label="View Quotation"
                        icon={<ViewIcon />}
                        onClick={() => handleView(Quotation)}
                        size="sm"
                      />
                      <IconButton
                        aria-label="Edit Quotation"
                        icon={<EditIcon />}
                        onClick={() => handleEdit(Quotation)}
                        size="sm"
                      />
                      <IconButton
                        aria-label="Delete Quotation"
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        onClick={() => openDeleteModal(Quotation)}
                        size="sm"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan="7">No Quotations available</Td>
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
            Are you sure you want to delete this Quotation? This action cannot be undone.
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

export default Quotations;
