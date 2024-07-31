import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, FormControl, FormLabel, Input, Select, Table, Thead, Tbody, Tr, Th, Td, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from '@chakra-ui/react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const cancelRef = useRef();

  const [endUserCompanyName, setEndUserCompanyName] = useState('');
  const [endUserContactEmail, setEndUserContactEmail] = useState('');
  const [distributorContactName, setDistributorContactName] = useState('');
  const [estimatedRevenue, setEstimatedRevenue] = useState('');
  const [estimatedImplementationFinishDate, setEstimatedImplementationFinishDate] = useState('');
  const [summary, setSummary] = useState('');
  const [endUserContactName, setEndUserContactName] = useState('');
  const [endUserContactPhone, setEndUserContactPhone] = useState('');
  const [projectStatus, setProjectStatus] = useState('Initial');
  const [installationCity, setInstallationCity] = useState('');
  const [installationState, setInstallationState] = useState('');
  const [distributorEmail, setDistributorEmail] = useState('');
  const [estimatedBusinessPurchasingDecisionDate, setEstimatedBusinessPurchasingDecisionDate] = useState('');
  const [estimatedImplementationStartDate, setEstimatedImplementationStartDate] = useState('');
  const [sector, setSector] = useState('Private');
  const [projectCode, setProjectCode] = useState('');
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const response = await axios.get('/api/projects'); // Update the URL
    setProjects(response.data);
  };

  const handleAddProject = async () => {
    const newProject = {
      endUserCompanyName, endUserContactEmail, distributorContactName, estimatedRevenue,
      estimatedImplementationFinishDate, summary, endUserContactName, endUserContactPhone,
      projectStatus, installationCity, installationState, distributorEmail,
      estimatedBusinessPurchasingDecisionDate, estimatedImplementationStartDate,
      sector, projectCode
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/project/create`, newProject); // Update the URL
      fetchProjects();
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

  const handleEditProject = async () => {
    const project = {
      endUserCompanyName, endUserContactEmail, distributorContactName, estimatedRevenue,
      estimatedImplementationFinishDate, summary, endUserContactName, endUserContactPhone,
      projectStatus, installationCity, installationState, distributorEmail,
      estimatedBusinessPurchasingDecisionDate, estimatedImplementationStartDate,
      sector, projectCode
    };
    try {
      await axios.put(`/api/projects/${currentProject.id}`, project); // Update the URL
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (project) => {
    setIsEdit(true);
    setCurrentProject(project);
    setEndUserCompanyName(project.endUserCompanyName);
    setEndUserContactEmail(project.endUserContactEmail);
    setDistributorContactName(project.distributorContactName);
    setEstimatedRevenue(project.estimatedRevenue);
    setEstimatedImplementationFinishDate(project.estimatedImplementationFinishDate);
    setSummary(project.summary);
    setEndUserContactName(project.endUserContactName);
    setEndUserContactPhone(project.endUserContactPhone);
    setProjectStatus(project.projectStatus);
    setInstallationCity(project.installationCity);
    setInstallationState(project.installationState);
    setDistributorEmail(project.distributorEmail);
    setEstimatedBusinessPurchasingDecisionDate(project.estimatedBusinessPurchasingDecisionDate);
    setEstimatedImplementationStartDate(project.estimatedImplementationStartDate);
    setSector(project.sector);
    setProjectCode(project.projectCode);
    openModal();
  };

  const openAddModal = () => {
    setIsEdit(false);
    setEndUserCompanyName('');
    setEndUserContactEmail('');
    setDistributorContactName('');
    setEstimatedRevenue('');
    setEstimatedImplementationFinishDate('');
    setSummary('');
    setEndUserContactName('');
    setEndUserContactPhone('');
    setProjectStatus('Initial');
    setInstallationCity('');
    setInstallationState('');
    setDistributorEmail('');
    setEstimatedBusinessPurchasingDecisionDate('');
    setEstimatedImplementationStartDate('');
    setSector('Private');
    setProjectCode('');
    openModal();
  };

  const handleDeleteProject = async () => {
    try {
      await axios.delete(`/api/projects/${deleteProjectId}`); // Update the URL
      fetchProjects();
      closeAlert();
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteProjectId(id);
    openAlert();
  };

  const renderTableCell = (value) => {
    return value ? value : 'N/A';
  };

  return (
    <Box dir="ltr" textAlign="left" mt="8" p="8">
      <Button colorScheme="teal" mt="4" onClick={openAddModal}>Add Project</Button>

      <Table variant="simple" mt="4">
        <Thead>
          <Tr>
            <Th>End User Company Name</Th>
            <Th>End User Contact Email</Th>
            <Th>Distributor Contact Name</Th>
            <Th>Estimated Revenue</Th>
            <Th>Estimated Implementation Finish Date</Th>
            <Th>Summary</Th>
            <Th>End User Contact Name</Th>
            <Th>End User Contact Phone</Th>
            <Th>Project Status</Th>
            <Th>Installation City</Th>
            <Th>Installation State</Th>
            <Th>Distributor Email</Th>
            <Th>Estimated Business Purchasing Decision Date</Th>
            <Th>Estimated Implementation Start Date</Th>
            <Th>Sector</Th>
            <Th>Project Code</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {projects.map((project) => (
            <Tr key={project.id}>
              <Td>{renderTableCell(project.endUserCompanyName)}</Td>
              <Td>{renderTableCell(project.endUserContactEmail)}</Td>
              <Td>{renderTableCell(project.distributorContactName)}</Td>
              <Td>{renderTableCell(project.estimatedRevenue)}</Td>
              <Td>{renderTableCell(project.estimatedImplementationFinishDate)}</Td>
              <Td>{renderTableCell(project.summary)}</Td>
              <Td>{renderTableCell(project.endUserContactName)}</Td>
              <Td>{renderTableCell(project.endUserContactPhone)}</Td>
              <Td>{renderTableCell(project.projectStatus)}</Td>
              <Td>{renderTableCell(project.installationCity)}</Td>
              <Td>{renderTableCell(project.installationState)}</Td>
              <Td>{renderTableCell(project.distributorEmail)}</Td>
              <Td>{renderTableCell(project.estimatedBusinessPurchasingDecisionDate)}</Td>
              <Td>{renderTableCell(project.estimatedImplementationStartDate)}</Td>
              <Td>{renderTableCell(project.sector)}</Td>
              <Td>{renderTableCell(project.projectCode)}</Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(project)}>Edit</Button>
                <Button colorScheme="red" size="sm" ml="1" onClick={() => confirmDelete(project.id)}>Delete</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? 'Edit Project' : 'Add Project'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="endUserCompanyName" isRequired>
              <FormLabel>End User Company Name</FormLabel>
              <Input value={endUserCompanyName} onChange={(e) => setEndUserCompanyName(e.target.value)} />
            </FormControl>
            <FormControl id="endUserContactEmail" isRequired>
              <FormLabel>End User Contact Email</FormLabel>
              <Input type="email" value={endUserContactEmail} onChange={(e) => setEndUserContactEmail(e.target.value)} />
            </FormControl>
            <FormControl id="distributorContactName" isRequired>
              <FormLabel>Distributor Contact Name</FormLabel>
              <Input value={distributorContactName} onChange={(e) => setDistributorContactName(e.target.value)} />
            </FormControl>
            <FormControl id="estimatedRevenue">
              <FormLabel>Estimated Revenue</FormLabel>
              <Input value={estimatedRevenue} onChange={(e) => setEstimatedRevenue(e.target.value)} />
            </FormControl>
            <FormControl id="estimatedImplementationFinishDate">
              <FormLabel>Estimated Implementation Finish Date</FormLabel>
              <Input type="date" value={estimatedImplementationFinishDate} onChange={(e) => setEstimatedImplementationFinishDate(e.target.value)} />
            </FormControl>
            <FormControl id="summary">
              <FormLabel>Summary</FormLabel>
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
            </FormControl>
            <FormControl id="endUserContactName">
              <FormLabel>End User Contact Name</FormLabel>
              <Input value={endUserContactName} onChange={(e) => setEndUserContactName(e.target.value)} />
            </FormControl>
            <FormControl id="endUserContactPhone">
              <FormLabel>End User Contact Phone</FormLabel>
              <Input value={endUserContactPhone} onChange={(e) => setEndUserContactPhone(e.target.value)} />
            </FormControl>
            <FormControl id="projectStatus" isRequired>
              <FormLabel>Project Status</FormLabel>
              <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                <option value="Initial">Initial</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Select>
            </FormControl>
            <FormControl id="installationCity">
              <FormLabel>Installation City</FormLabel>
              <Input value={installationCity} onChange={(e) => setInstallationCity(e.target.value)} />
            </FormControl>
            <FormControl id="installationState">
              <FormLabel>Installation State</FormLabel>
              <Input value={installationState} onChange={(e) => setInstallationState(e.target.value)} />
            </FormControl>
            <FormControl id="distributorEmail">
              <FormLabel>Distributor Email</FormLabel>
              <Input type="email" value={distributorEmail} onChange={(e) => setDistributorEmail(e.target.value)} />
            </FormControl>
            <FormControl id="estimatedBusinessPurchasingDecisionDate">
              <FormLabel>Estimated Business Purchasing Decision Date</FormLabel>
              <Input type="date" value={estimatedBusinessPurchasingDecisionDate} onChange={(e) => setEstimatedBusinessPurchasingDecisionDate(e.target.value)} />
            </FormControl>
            <FormControl id="estimatedImplementationStartDate">
              <FormLabel>Estimated Implementation Start Date</FormLabel>
              <Input type="date" value={estimatedImplementationStartDate} onChange={(e) => setEstimatedImplementationStartDate(e.target.value)} />
            </FormControl>
            <FormControl id="sector" isRequired>
              <FormLabel>Sector</FormLabel>
              <Select value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </Select>
            </FormControl>
            <FormControl id="projectCode" isRequired>
              <FormLabel>Project Code</FormLabel>
              <Input value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={isEdit ? handleEditProject : handleAddProject}>
              {isEdit ? 'Save' : 'Add'}
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Project
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteProject} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Projects;
