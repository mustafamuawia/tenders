import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch
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
  const [role, setRole] = useState('Partner');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [userClass, setUserClass] = useState('');
  const [status, setStatus] = useState(false); // Switch for status
  const [deleteUserId, setDeleteUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await axios.get('/api/users'); // Update the URL
    setUsers(response.data);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post('/api/changestatus', { id: userId, Status: newStatus }); // Update the URL
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = async () => {
    const newUser = {
      name, email, password, password_confirmation: confirmPassword, role,
      company_email: role === 'Partner' ? companyEmail : undefined,
      company_name: role === 'Partner' ? companyName : undefined,
      phone: role === 'Partner' ? phone : undefined,
      class: role === 'Partner' ? userClass : undefined,
      status: status ? 'Activated' : 'Not Activated'
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/createadmin`, newUser); // Update the URL
      fetchUsers();
      closeModal();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data); // Log the error response for debugging
        alert("Error: " + error.response.data.message); // Display a user-friendly message
      } else {
        console.error(error);
      }
    }
  };

  const handleEditUser = async () => {
    const user = {
      name, email, password, password_confirmation: confirmPassword, role,
      company_email: role === 'Partner' ? companyEmail : undefined,
      company_name: role === 'Partner' ? companyName : undefined,
      phone: role === 'Partner' ? phone : undefined,
      class: role === 'Partner' ? userClass : undefined,
      status: status ? 'Activated' : 'Not Activated'
    };
    try {
      await axios.put(`/api/users/${currentUser.id}`, user); // Update the URL
      fetchUsers();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setCurrentUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // Clear password field
    setConfirmPassword(''); // Clear confirm password field
    setRole(user.role);
    setStatus(user.Status === 'Activated');
    if (user.role === 'Partner') {
      setCompanyEmail(user.company_email || '');
      setCompanyName(user.company_name || '');
      setPhone(user.phone || '');
      setUserClass(user.class || '');
    }
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setRole('Admin');
    setCompanyEmail('');
    setCompanyName('');
    setPhone('');
    setUserClass('');
    setStatus(false);
    openModal();
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/api/users/${deleteUserId}`); // Update the URL
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
            <Th>Phone</Th>
            <Th>Company Email</Th>
            <Th>Company Name</Th>
            <Th>Class</Th>
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
              <Td>{renderTableCell(user.phone)}</Td>
              <Td>{renderTableCell(user.company_email)}</Td>
              <Td>{renderTableCell(user.company_name)}</Td>
              <Td>{renderTableCell(user.class)}</Td>
              <Td>{renderTableCell(user.role)}</Td>
              <Td>
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
                <option value="Partner">Partner</option>
              </Select>
            </FormControl>
            {role === 'Partner' && (
              <>
                <FormControl id="companyEmail" isRequired>
                  <FormLabel>Company Email</FormLabel>
                  <Input value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
                </FormControl>
                <FormControl id="companyName" isRequired>
                  <FormLabel>Company Name</FormLabel>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                </FormControl>
                <FormControl id="phone" isRequired>
                  <FormLabel>Phone</FormLabel>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </FormControl>
                <FormControl id="class" isRequired>
                  <FormLabel>Class</FormLabel>
                  <Input value={userClass} onChange={(e) => setUserClass(e.target.value)} />
                </FormControl>
              </>
            )}
            <FormControl id="status" isRequired>
              <FormLabel>Status</FormLabel>
              <Switch isChecked={status} onChange={(e) => setStatus(e.target.checked)} />
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
