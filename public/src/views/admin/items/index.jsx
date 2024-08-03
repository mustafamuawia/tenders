import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch
} from '@chakra-ui/react';
import axios from 'axios';

const Items = () => {
  const [items, setItems] = useState([]);
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
  const [status, setStatus] = useState(false); // Switch for status
  const [deleteItemId, setDeleteItemId] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/items`);
    setItems(response.data);
  };

  const handleStatusChange = async (itemId, currentStatus) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/changeitemstatus`, { id: itemId, status: newStatus });
      fetchItems();
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
      status: status ? 1 : 0
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
      status: status ? 1 : 0
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
    setStatus(item.status === 1);
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
    setStatus(false);
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
              <Td>{item.item_name}</Td>
              <Td>{item.description || 'N/A'}</Td>
              <Td>{item.specifications || 'N/A'}</Td>
              <Td>{item.manufacturer || 'N/A'}</Td>
              <Td>{item.origin_country || 'N/A'}</Td>
              <Td>{item.note || 'N/A'}</Td>
              <Td>
                <Switch
                  isChecked={item.status === 1}
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
              <Input value={specifications} onChange={(e) => setSpecifications(e.target.value)} />
            </FormControl>
            <FormControl id="manufacturer">
              <FormLabel>Manufacturer</FormLabel>
              <Input value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
            </FormControl>
            <FormControl id="originCountry">
              <FormLabel>Origin Country</FormLabel>
              <Input value={originCountry} onChange={(e) => setOriginCountry(e.target.value)} />
            </FormControl>
            <FormControl id="note" isRequired>
              <FormLabel>Note</FormLabel>
              <Input value={note} onChange={(e) => setNote(e.target.value)} />
            </FormControl>
            <FormControl id="status">
              <FormLabel>Status</FormLabel>
              <Switch isChecked={status} onChange={(e) => setStatus(e.target.checked)} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={isEdit ? handleEditItem : handleAddItem}>
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
