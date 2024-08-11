import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch
} from '@chakra-ui/react';
import axios from 'axios';

const Items = () => {
  const [items, setItems] = useState([]);
  const [countries, setCountries] = useState([]);
  const [currentItem, setCurrentItem] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [specifications, setSpecifications] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [originCountry, setOriginCountry] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('Not Activated'); // Default status
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchItems();
    fetchCountries();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
    setItems(response.data);
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const sortedCountries = response.data
        .map(country => ({
          name: country.name.common,
          code: country.cca2
        }))
        .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
      setCountries(sortedCountries);
    } catch (error) {
      console.error("Failed to fetch countries:", error);
    }
  };

  const handleStatusChange = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/changeitemstatus`, { id: itemId, status: newStatus });
      setItems(items.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = async () => {
    const newItem = {
      item_name: itemName,
      description,
      specifications,
      manufacturer,
      origin_country: originCountry,
      note,
      status
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/items`, newItem);
      fetchItems();
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

  const handleEditItem = async () => {
    const item = {
      item_name: itemName,
      description,
      specifications,
      manufacturer,
      origin_country: originCountry,
      note,
      status
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/items/${currentItem.id}`, item);
      fetchItems();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (item) => {
    setIsEdit(true);
    setCurrentItem(item);
    setItemName(item.item_name);
    setDescription(item.description || '');
    setSpecifications(item.specifications || '');
    setManufacturer(item.manufacturer || '');
    setOriginCountry(item.origin_country || '');
    setNote(item.note || '');
    setStatus(item.status);
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setItemName('');
    setDescription('');
    setSpecifications('');
    setManufacturer('');
    setOriginCountry('');
    setNote('');
    setStatus('Not Activated');
    openModal();
  };

  const handleDeleteItem = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/items/${deleteItemId}`);
      fetchItems();
      closeAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteItemId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Item</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Item Name</Th>
            <Th>Description</Th>
            <Th>Specifications</Th>
            <Th>Manufacturer</Th>
            <Th>Origin Country</Th>
            <Th>Note</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {items.map((item) => (
            <Tr key={item.id}>
              <Td>{renderTableCell(item.item_name)}</Td>
              <Td>{renderTableCell(item.description)}</Td>
              <Td>{renderTableCell(item.specifications)}</Td>
              <Td>{renderTableCell(item.manufacturer)}</Td>
              <Td>{renderTableCell(item.origin_country)}</Td>
              <Td>{renderTableCell(item.note)}</Td>
              <Td>
                <Box color={item.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {item.status}
                </Box>
                <Switch
                  isChecked={item.status === 'Activated'}
                  onChange={() => handleStatusChange(item.id, item.status)}
                />
              </Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(item)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(item.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Item' : 'Add Item'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="itemName" isRequired>
              <FormLabel>Item Name</FormLabel>
              <Input value={itemName} onChange={(e) => setItemName(e.target.value)} />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl id="specifications">
              <FormLabel>Specifications</FormLabel>
              <Textarea value={specifications} onChange={(e) => setSpecifications(e.target.value)} />
            </FormControl>
            <FormControl id="manufacturer">
              <FormLabel>Manufacturer</FormLabel>
              <Input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </FormControl>
            <FormControl id="originCountry">
              <FormLabel>Origin Country</FormLabel>
              <Select value={originCountry} onChange={(e) => setOriginCountry(e.target.value)}>
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="note" isRequired>
              <FormLabel>Note</FormLabel>
              <Textarea value={note} onChange={(e) => setNote(e.target.value)} />
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
            <Button colorScheme="teal" onClick={isEdit ? handleEditItem : handleAddItem}>
              {isEdit ? 'Edit' : 'Add'}
            </Button>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
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
            Delete Item
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this item? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteItem} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Items;
