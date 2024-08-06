import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Switch, Text
} from '@chakra-ui/react';
import axios from 'axios';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [currentPartner, setCurrentPartner] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('Not Activated');
  const [membershipType, setMembershipType] = useState('Silver');
  const [deletePartnerId, setDeletePartnerId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/fetch`);
      if (Array.isArray(response.data)) {
        setPartners(response.data);
      } else {
        setPartners([]);
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    }
  };

  const handleStatusChange = async (partnerId, currentStatus) => {
    const newStatus = currentStatus === 'Activated' ? 'Not Activated' : 'Activated';
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/partner/changestatus`, { id: partnerId, status: newStatus });
      setPartners(partners.map(partner => partner.id === partnerId ? { ...partner, status: newStatus } : partner));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPartner = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const newPartner = {
      name: contactName,
      email,
      password,
      password_confirmation: confirmPassword,
      CompanyName: companyName,
      CompanyEmail: companyEmail,
      Phone: companyPhone,
      status,
      Class: membershipType,
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/user/create`, newPartner);
      fetchPartners();
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

  const handleEditPartner = async () => {
    const partner = {
      name: contactName,
      email,
      password,
      password_confirmation: confirmPassword,
      CompanyName: companyName,
      CompanyEmail: companyEmail,
      Phone: companyPhone,
      status,
      Class: membershipType,
    };
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/user/edit/${currentPartner.id}`, partner);
      fetchPartners();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (partner) => {
    setIsEdit(true);
    setCurrentPartner(partner);
    setContactName(partner.name);
    setCompanyName(partner.CompanyName);
    setCompanyEmail(partner.CompanyEmail);
    setCompanyPhone(partner.Phone);
    setEmail(partner.email);
    setPassword('');
    setConfirmPassword('');
    setStatus(partner.status);
    setMembershipType(partner.Class);
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setContactName('');
    setCompanyName('');
    setCompanyEmail('');
    setCompanyPhone('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setStatus('Not Activated');
    setMembershipType('Silver');
    openModal();
  };

  const handleDeletePartner = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/user/delete/${deletePartnerId}`);
      fetchPartners();
      closeAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeletePartnerId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Partner</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>Contact Name</Th>
            <Th>Company Name</Th>
            <Th>Company Email</Th>
            <Th>Company Phone</Th>
            <Th>Email</Th>
            <Th>Status</Th>
            <Th>Membership Type</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {partners.map((partner) => (
            <Tr key={partner.id}>
              <Td>{renderTableCell(partner.name)}</Td>
              <Td>{renderTableCell(partner.CompanyName)}</Td>
              <Td>{renderTableCell(partner.CompanyEmail)}</Td>
              <Td>{renderTableCell(partner.Phone)}</Td>
              <Td>{renderTableCell(partner.email)}</Td>
              <Td>
                <Box color={partner.status === 'Activated' ? 'green.500' : 'red.500'}>
                  {partner.status}
                </Box>
                <Switch
                  isChecked={partner.status === 'Activated'}
                  onChange={() => handleStatusChange(partner.id, partner.status)}
                />
              </Td>
              <Td>{renderTableCell(partner.Class)}</Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(partner)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(partner.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Partner' : 'Add Partner'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="contactName" isRequired>
              <FormLabel>Contact Name</FormLabel>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
            </FormControl>
            <FormControl id="companyName" isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
            </FormControl>
            <FormControl id="companyEmail" isRequired>
              <FormLabel>Company Email</FormLabel>
              <Input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
            </FormControl>
            <FormControl id="companyPhone" isRequired>
              <FormLabel>Company Phone</FormLabel>
              <Input value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
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
            <FormControl id="status" isRequired>
              <FormLabel>Status</FormLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Not Activated">Not Activated</option>
                <option value="Activated">Activated</option>
              </Select>
            </FormControl>
            <FormControl id="membershipType" isRequired>
              <FormLabel>Membership Type</FormLabel>
              <Select value={membershipType} onChange={(e) => setMembershipType(e.target.value)}>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </Select>
            </FormControl>
            {error && <Text color="red.500" mt="2">{error}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr="3" onClick={isEdit ? handleEditPartner : handleAddPartner}>
              {isEdit ? 'Save Changes' : 'Add Partner'}
            </Button>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Partner
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this partner? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeletePartner} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Partners;
