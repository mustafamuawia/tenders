import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Text, Switch
} from '@chakra-ui/react';
import axios from 'axios';

const UnitGroups = () => {
  const [unitGroups, setUnitGroups] = useState([]);
  const [currentUnitGroup, setCurrentUnitGroup] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Not Activated');
  const [deleteUnitGroupId, setDeleteUnitGroupId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUnitGroups();
  }, []);

  const fetchUnitGroups = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/unitgroups`);
      setUnitGroups(response.data.data.unit_groups || []);
    } catch (error) {
      console.error('Error fetching unit groups:', error);
    }
  };
  

  const handleStatusChange = async (unitGroupId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/unitgroups/change-status`, { id: unitGroupId, status: newStatus });
      setUnitGroups(unitGroups.map(unitGroup => unitGroup.id === unitGroupId ? { ...unitGroup, status: newStatus } : unitGroup));
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleAddUnitGroup = async () => {
    try {
      const newUnitGroup = { name, description, status };
      await axios.post(`${process.env.REACT_APP_API_URL}/unitgroups`, newUnitGroup);
      fetchUnitGroups();
      closeModal();
      setError('');
    } catch (error) {
      console.error('Error adding unit group:', error);
      setError('An error occurred.');
    }
  };

  const handleEditUnitGroup = async () => {
    try {
      const unitGroup = { name, description, status };
      await axios.put(`${process.env.REACT_APP_API_URL}/unitgroups/${currentUnitGroup.id}`, unitGroup);
      fetchUnitGroups();
      closeModal();
      setError('');
    } catch (error) {
      console.error('Error editing unit group:', error);
      setError('An error occurred.');
    }
  };

  const openEditModal = (unitGroup) => {
    setIsEdit(true);
    setCurrentUnitGroup(unitGroup);
    setName(unitGroup.name);
    setDescription(unitGroup.description);
    setStatus(unitGroup.status);
    setError('');
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setName('');
    setDescription('');
    setStatus('Not Activated');
    setError('');
    openModal();
  };

  const handleDeleteUnitGroup = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/unitgroups/${deleteUnitGroupId}`);
      fetchUnitGroups();
      closeAlert();
    } catch (error) {
      console.error('Error deleting unit group:', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteUnitGroupId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Unit Group</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {unitGroups.map((unitGroup) => (
            <Tr key={unitGroup.id}>
              <Td>{renderTableCell(unitGroup.name)}</Td>
              <Td>{renderTableCell(unitGroup.description)}</Td>
              <Td>
                <Box color={unitGroup.status === 1 ? 'green.500' : 'red.500'}>
                  {unitGroup.status === 1 ? 'Activated' : 'Not Activated'}
                </Box>
                <Switch
                  isChecked={unitGroup.status === 1}
                  onChange={() => handleStatusChange(unitGroup.id, unitGroup.status === 1 ? 'Activated' : 'Not Activated')}
                />
              </Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(unitGroup)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(unitGroup.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Unit Group' : 'Add Unit Group'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.500" mb="4">{error}</Text>}
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="description">
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl id="status" isRequired>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="1">Activated</option>
                <option value="0">Not Activated</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" onClick={isEdit ? handleEditUnitGroup : handleAddUnitGroup}>
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
            Delete Unit Group
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this unit group? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteUnitGroup} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default UnitGroups;
