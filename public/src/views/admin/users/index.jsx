import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch, Text
} from '@chakra-ui/react';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Admin');
  const [status, setStatus] = useState('Not Activated');
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/fetch`);
    setUsers(response.data);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/admin/changestatus`, { id: userId, status: newStatus });
      setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
    } catch (error) {
      console.error(error);
    }
  };

  const validateForm = () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) return;

    const newUser = {
      name, email, password, password_confirmation: confirmPassword, role,
      status
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/createadmin`, newUser);
      fetchUsers();
      closeModal();
      setError('');
    } catch (error) {
      if (error.response) {
        if (error.response.data.message.includes('email')) {
          setError('Email already exists.');
        } else {
          setError('An error occurred.');
        }
      } else {
        setError('An error occurred.');
      }
    }
  };

  const handleEditUser = async () => {
    if (!validateForm()) return;

    const user = {
      name, email, password, password_confirmation: confirmPassword, role,
      status
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/admin/edit/${currentUser.id}`, user);
      fetchUsers();
      closeModal();
      setError('');
    } catch (error) {
      console.error(error);
      setError('An error occurred.');
    }
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword('');
    setConfirmPassword('');
    setRole(user.role);
    setStatus(user.status);
    setError('');
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('Admin');
    setStatus('Not Activated');
    setError('');
    openModal();
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/admin/delete/${deleteUserId}`);
      fetchUsers();
      closeAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteUserId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add User</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Role</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td>{renderTableCell(user.name)}</Td>
              <Td>{renderTableCell(user.email)}</Td>
              <Td>{renderTableCell(user.role)}</Td>
              <Td>
                <Box color={user.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {user.status}
                </Box>
                <Switch
                  isChecked={user.status === 'Activated'}
                  onChange={() => handleStatusChange(user.id, user.status)}
                />
              </Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(user)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(user.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit User' : 'Add User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && <Text color="red.500" mb="4">{error}</Text>}
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </FormControl>
            <FormControl id="role" isRequired>
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Admin">Admin</option>
              </Select>
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
            <Button colorScheme="teal" onClick={isEdit ? handleEditUser : handleAddUser}>
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
            Delete User
          </AlertDialogHeader>
          <AlertDialogBody>
            Are you sure you want to delete this user? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={closeAlert}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteUser} ml={3}>
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
};

export default Users;
