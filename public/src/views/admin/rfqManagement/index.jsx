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
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import axios from 'axios';

function RFQManagement() {
  const [rfqs, setRfqs] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);
  const [units, setUnits] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedRfq, setSelectedRfq] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

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

    const fetchClients = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

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

    fetchRfqs();
    fetchClients();
    fetchProjects();
    fetchItems();
    fetchUnits();
  }, []);

  const handleView = (rfq) => {
    setIsEditMode(false);
    setSelectedRfq(rfq);
    onOpen();
  };

  const handleEdit = (rfq) => {
    setIsEditMode(true);
    setSelectedRfq(rfq);
    onOpen();
  };

  const handleDelete = (rfq) => {
    setSelectedRfq(rfq);
    onDeleteOpen();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/rfqs/${selectedRfq.id}`);
      setRfqs(rfqs.filter(rfq => rfq.id !== selectedRfq.id));
      onDeleteClose();
    } catch (error) {
      console.error('Error deleting RFQ:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedRfq(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/rfqs/${selectedRfq.id}`, selectedRfq);
      setRfqs(rfqs.map(rfq => (rfq.id === selectedRfq.id ? selectedRfq : rfq)));
      onClose();
    } catch (error) {
      console.error('Error updating RFQ:', error);
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

        {/* View/Edit Modal */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{isEditMode ? 'Edit RFQ' : 'View RFQ'}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Title</FormLabel>
                <Input
                  name="title"
                  value={selectedRfq?.title || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Client</FormLabel>
                <Select
                  name="client_id"
                  value={selectedRfq?.client?.id || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                >
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.client_name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Project</FormLabel>
                <Select
                  name="project_id"
                  value={selectedRfq?.project?.id || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Issue Date</FormLabel>
                <Input
                  name="issue_date"
                  type="date"
                  value={selectedRfq?.issue_date || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Expire Date</FormLabel>
                <Input
                  name="expire_date"
                  type="date"
                  value={selectedRfq?.expire_date || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                />
              </FormControl>

              {/* RFQ Details */}
              <Heading as="h2" size="md" mt={6} mb={4}>
                RFQ Details
              </Heading>

              <FormControl mb={4}>
                <FormLabel>Items</FormLabel>
                <Select
                  name="item"
                  value={selectedRfq?.item || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                >
                   {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.item_name}
                  </option>
                ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Unit</FormLabel>
                <Select
                  name="unit"
                  value={selectedRfq?.unit || ''}
                  onChange={handleInputChange}
                  isDisabled={!isEditMode}
                >
             {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
                </Select>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Quantity</FormLabel>
                <NumberInput
                  name="quantity"
                  value={selectedRfq?.quantity || 0}
                  onChange={(valueString) => handleInputChange({ target: { name: 'quantity', value: valueString } })}
                  isDisabled={!isEditMode}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Price</FormLabel>
                <NumberInput
                  name="price"
                  value={selectedRfq?.price || 0}
                  onChange={(valueString) => handleInputChange({ target: { name: 'price', value: valueString } })}
                  isDisabled={!isEditMode}
                  min={0}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              {isEditMode ? (
                <Button colorScheme="teal" mr={3} onClick={handleSave}>
                  Save
                </Button>
              ) : null}
              <Button variant="ghost" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete RFQ</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              Are you sure you want to delete this item? This action cannot be undone.
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={confirmDelete}>
                Delete
              </Button>
              <Button variant="ghost" onClick={onDeleteClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Stack>
    </Box>
  );
}

export default RFQManagement;
