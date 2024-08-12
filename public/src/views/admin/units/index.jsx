import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Text, Switch
} from '@chakra-ui/react';
import axios from 'axios';

const Units = () => {
  const [units, setUnits] = useState([]);
  const [currentUnit, setCurrentUnit] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [unitName, setUnitName] = useState('');
  const [description, setDescription] = useState('');
  const [ratio, setRatio] = useState('');
  const [unitGroupId, setUnitGroupId] = useState('');
  const [status, setStatus] = useState('Not Activated');
  const [deleteUnitId, setDeleteUnitId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/units`);
      console.log('Fetched units:', response.data); // Inspect the data structure
      setUnits(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching units:', error);
      setUnits([]); 
    }
  };

  const handleStatusChange = async (unitId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/changeunitstatus`, {
        id: unitId,
        status: newStatus
      });
      setUnits(units.map(unit => 
        unit.id === unitId 
          ? { ...unit, status: newStatus } 
          : unit
      ));
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const handleAddUnit = async () => {
    try {
      const newUnit = { unit_name: unitName, description, ratio, unit_group_id: unitGroupId, status };
      await axios.post(`${process.env.REACT_APP_API_URL}/units`, newUnit);
      fetchUnits();
      closeModal();
      setError('');
    } catch (error) {
      console.error('Error adding unit:', error);
      setError('An error occurred while adding the unit.');
    }
  };

  const handleEditUnit = async () => {
    try {
      const unit = { unit_name: unitName, description, ratio, unit_group_id: unitGroupId, status };
      await axios.put(`${process.env.REACT_APP_API_URL}/units/${currentUnit.id}`, unit);
      fetchUnits();
      closeModal();
      setError('');
    } catch (error) {
      console.error('Error editing unit:', error);
      setError('An error occurred while editing the unit.');
    }
  };

  const openEditModal = (unit) => {
    setIsEdit(true);
    setCurrentUnit(unit);
    setUnitName(unit.unit_name);
    setDescription(unit.description);
    setRatio(unit.ratio);
    setUnitGroupId(unit.unit_group_id);
    setStatus(unit.status);
    setError('');
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setUnitName('');
    setDescription('');
    setRatio('');
    setUnitGroupId('');
    setStatus('Not Activated');
    setError('');
    openModal();
  };

  const handleDeleteUnit = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/units/${deleteUnitId}`);
      fetchUnits();
      closeAlert();
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteUnitId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Unit</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Unit Name</Th>
            <Th>Description</Th>
            <Th>Ratio</Th>
            <Th>Unit Group ID</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(units && Array.isArray(units) ? units : []).map((unit) => (
            <Tr key={unit.id}>
              <Td>{renderTableCell(unit.unit_name)}</Td>
              <Td>{renderTableCell(unit.description)}</Td>
              <Td>{renderTableCell(unit.ratio)}</Td>
              <Td>{renderTableCell(unit.unit_group_id)}</Td>
              <Td>
                <Box color={unit.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {unit.status}
                </Box>
                <Switch
                  isChecked={unit.status === 'Activated'}
                  onChange={() => handleStatusChange(unit.id, unit.status)}
                />
              </Td>
              <Td>
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(unit)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(unit.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Unit' : 'Add Unit'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Unit Name</FormLabel>
              <Input value={unitName} onChange={(e) => setUnitName(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Description</FormLabel>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Ratio</FormLabel>
              <Input type="number" step="0.000001" value={ratio} onChange={(e) => setRatio(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Unit Group ID</FormLabel>
              <Input type="number" value={unitGroupId} onChange={(e) => setUnitGroupId(e.target.value)} />
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
            <Button colorScheme="teal" mr="3" onClick={isEdit ? handleEditUnit : handleAddUnit}>
              {isEdit ? 'Save Changes' : 'Add Unit'}
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Unit</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this unit? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDeleteUnit} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Units;
