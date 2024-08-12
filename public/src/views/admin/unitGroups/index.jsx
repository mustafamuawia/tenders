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
      console.log(response.data); // Inspect the data structure
      setUnitGroups(response.data || []); 
    } catch (error) {
      console.error('Error fetching unit groups:', error);
      setUnitGroups([]); 
    }
  };

  const handleStatusChange = async (unitGroupId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/changeunitgroupstatus`, {
        id: unitGroupId,
        status: newStatus
      });
      setUnitGroups(unitGroups.map(unitGroup => 
        unitGroup.id === unitGroupId 
          ? { ...unitGroup, status: newStatus } 
          : unitGroup
      ));
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
      setError('An error occurred while adding the unit group.');
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
      setError('An error occurred while editing the unit group.');
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
          {(unitGroups || []).map((unitGroup) => (
            <Tr key={unitGroup.id}>
              <Td>{renderTableCell(unitGroup.name)}</Td>
              <Td>{renderTableCell(unitGroup.description)}</Td>
              <Td>
              <Box color={unitGroup.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {unitGroup.status}
                </Box>
                <Switch
                  isChecked={unitGroup.status === 'Activated'}
                  onChange={() => handleStatusChange(unitGroup.id, unitGroup.status)}
                />
              </Td>
              
              <Td>
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(unitGroup)}>Edit</Button>
                <Button colorScheme="red"  size="sm" ml="1" onClick={() => confirmDelete(unitGroup.id)}>Delete</Button>
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
            <FormControl mb="4">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Activated">Activated</option>
                <option value="Not Activated">Not Activated</option>
              </Select>
            </FormControl>
            {error && <Text color="red.500">{error}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr="3" onClick={isEdit ? handleEditUnitGroup : handleAddUnitGroup}>
              {isEdit ? 'Save Changes' : 'Add Unit Group'}
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Unit Group</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this unit group? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteUnitGroup} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default UnitGroups;
