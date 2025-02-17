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
        console.log(response.data.data);
          setQuotations(response.data.data);
        
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
    return date.getDate(); // Format as YYYY-MM-DD
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
    history.push('/admin/add-quotation');
  };

  const handleDelete = async () => {
    if (selectedQuotation) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/Quotation/${selectedQuotation.id}`);
        setQuotations(quotations.filter(existingQuotation => existingQuotation.id !== selectedQuotation.id));
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
  const handleDownload = 
    async (file) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/download/${file.id}`,
          {
             responseType: 'blob', // Important for downloading files
          }
        );
    console.log(response)
        // Create a URL for the blob and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', file.file_name); // Set the downloaded file's name
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error('Error downloading file:', error);
      }
  }

  return (
    <Box p={4} maxWidth="100%" mx="auto" mt={16} borderRadius="lg" boxShadow="xl" bg="white">
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Quotations
      </Heading>

      <Stack spacing={4}>
        <Table variant="striped" colorScheme="teal" size={{ base: 'sm', md: 'md' }}> 
          <Thead>
            <Tr>
              <Th>Code</Th>
              <Th>RFQ</Th>
              <Th>Note</Th>
              <Th>Files</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {quotations.length > 0 ? (
              quotations.map((Quotation) => (
                <Tr key={Quotation.id}>
                  <Td>{Quotation.title}</Td>
                  <Td>{Quotation.note}</Td>
                  <Td>{Quotation.rfq.title}</Td>
                  <Td> {Quotation.files.map((file, index) => (
                      <a
                        key={index}
                        href={`${process.env.REACT_APP_API_URL}/download/${file.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(file);
                        }}
                        style={{ marginRight: '10px' }}
                      >
                        {file.file_name}
                      </a>
                    ))}</Td>
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
