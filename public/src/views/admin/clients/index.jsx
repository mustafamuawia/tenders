import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch
} from '@chakra-ui/react';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [currentClient, setCurrentClient] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [status, setStatus] = useState('Not Activated'); // Default status
  const [deleteClientId, setDeleteClientId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/clients`);
    setClients(response.data);
  };

  const handleStatusChange = async (clientId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/changeclientstatus`, { id: clientId, status: newStatus });
      setClients(clients.map(client => client.id === clientId ? { ...client, status: newStatus } : client));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddClient = async () => {
    const newClient = {
      client_name: clientName,
      phone,
      address,
      country,
      state,
      city,
      status
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/clients`, newClient);
      fetchClients();
      closeModal();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        alert("Error: " + error.response.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleEditClient = async () => {
    const client = {
      client_name: clientName,
      phone,
      address,
      country,
      state,
      city,
      status
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/clients/${currentClient.id}`, client);
      fetchClients();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (client) => {
    setIsEdit(true);
    setCurrentClient(client);
    setClientName(client.client_name);
    setPhone(client.phone || '');
    setAddress(client.address || '');
    setCountry(client.country || '');
    setState(client.state || '');
    setCity(client.city || '');
    setStatus(client.status);
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setClientName('');
    setPhone('');
    setAddress('');
    setCountry('');
    setState('');
    setCity('');
    setStatus('Not Activated');
    openModal();
  };

  const handleDeleteClient = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/clients/${deleteClientId}`);
      fetchClients();
      closeAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteClientId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Client</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Client Name</Th>
            <Th>Phone</Th>
            <Th>Address</Th>
            <Th>Country</Th>
            <Th>State</Th>
            <Th>City</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {clients.map((client) => (
            <Tr key={client.id}>
              <Td>{renderTableCell(client.client_name)}</Td>
              <Td>{renderTableCell(client.phone)}</Td>
              <Td>{renderTableCell(client.address)}</Td>
              <Td>{renderTableCell(client.country)}</Td>
              <Td>{renderTableCell(client.state)}</Td>
              <Td>{renderTableCell(client.city)}</Td>
              <Td>
                <Box color={client.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {client.status}
                </Box>
                <Switch
                  isChecked={client.status === 'Activated'}
                  onChange={() => handleStatusChange(client.id, client.status)}
                />
              </Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(client)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(client.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Client' : 'Add Client'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="clientName" isRequired>
              <FormLabel>Client Name</FormLabel>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </FormControl>
            <FormControl id="phone">
              <FormLabel>Phone</FormLabel>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </FormControl>
            <FormControl id="address">
              <FormLabel>Address</FormLabel>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </FormControl>
            <FormControl id="country">
              <FormLabel>Country</FormLabel>
              <Input value={country} onChange={(e) => setCountry(e.target.value)} />
            </FormControl>
            <FormControl id="state">
              <FormLabel>State</FormLabel>
              <Input value={state} onChange={(e) => setState(e.target.value)} />
            </FormControl>
            <FormControl id="city">
              <FormLabel>City</FormLabel>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </FormControl>
            <FormControl id="status" isRequired>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Activated">Activated</option>
                <option value="Not Activated">Not Activated</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={isEdit ? handleEditClient : handleAddClient}>
              {isEdit ? 'Edit' : 'Add'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Delete Client
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this client? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteClient} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Clients;
