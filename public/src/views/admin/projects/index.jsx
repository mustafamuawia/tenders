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
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/projects`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddProject = async () => {
    const newProject = {
      end_user_company_name: endUserCompanyName,
      end_user_contact_email: endUserContactEmail,
      distributor_contact_name: distributorContactName,
      estimated_revenue: parseFloat(estimatedRevenue) || null,
      estimated_implementation_finish_date: estimatedImplementationFinishDate,
      summary: summary,
      end_user_contact_name: endUserContactName,
      end_user_contact_phone: endUserContactPhone,
      project_status: projectStatus,
      installation_city: installationCity,
      installation_state: installationState,
      distributor_email: distributorEmail,
      estimated_business_purchasing_decision_date: estimatedBusinessPurchasingDecisionDate,
      estimated_implementation_start_date: estimatedImplementationStartDate,
      sector: sector,
      project_code: projectCode
    };

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/projects`, newProject);
      fetchProjects();
      closeModal();
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        alert("Error: " + JSON.stringify(error.response.data.errors, null, 2));
      } else {
        console.error(error);
      }
    }
  };

  const handleEditProject = async () => {
    const project = {
      end_user_company_name: endUserCompanyName,
      end_user_contact_email: endUserContactEmail,
      distributor_contact_name: distributorContactName,
      estimated_revenue: parseFloat(estimatedRevenue) || null,
      estimated_implementation_finish_date: estimatedImplementationFinishDate,
      summary: summary,
      end_user_contact_name: endUserContactName,
      end_user_contact_phone: endUserContactPhone,
      project_status: projectStatus,
      installation_city: installationCity,
      installation_state: installationState,
      distributor_email: distributorEmail,
      estimated_business_purchasing_decision_date: estimatedBusinessPurchasingDecisionDate,
      estimated_implementation_start_date: estimatedImplementationStartDate,
      sector: sector,
      project_code: projectCode
    };

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/projects/${currentProject.id}`, project);
      fetchProjects();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const openEditModal = (project) => {
    setIsEdit(true);
    setCurrentProject(project);
    setEndUserCompanyName(project.end_user_company_name);
    setEndUserContactEmail(project.end_user_contact_email);
    setDistributorContactName(project.distributor_contact_name);
    setEstimatedRevenue(project.estimated_revenue);
    setEstimatedImplementationFinishDate(project.estimated_implementation_finish_date);
    setSummary(project.summary);
    setEndUserContactName(project.end_user_contact_name);
    setEndUserContactPhone(project.end_user_contact_phone);
    setProjectStatus(project.project_status);
    setInstallationCity(project.installation_city);
    setInstallationState(project.installation_state);
    setDistributorEmail(project.distributor_email);
    setEstimatedBusinessPurchasingDecisionDate(project.estimated_business_purchasing_decision_date);
    setEstimatedImplementationStartDate(project.estimated_implementation_start_date);
    setSector(project.sector);
    setProjectCode(project.project_code);
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
      await axios.delete(`${process.env.REACT_APP_API_URL}/projects/${deleteProjectId}`);
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
              <Td>{renderTableCell(project.end_user_company_name)}</Td>
              <Td>{renderTableCell(project.end_user_contact_email)}</Td>
              <Td>{renderTableCell(project.distributor_contact_name)}</Td>
              <Td>{renderTableCell(project.estimated_revenue)}</Td>
              <Td>{renderTableCell(project.estimated_implementation_finish_date)}</Td>
              <Td>{renderTableCell(project.summary)}</Td>
              <Td>{renderTableCell(project.end_user_contact_name)}</Td>
              <Td>{renderTableCell(project.end_user_contact_phone)}</Td>
              <Td>{renderTableCell(project.project_status)}</Td>
              <Td>{renderTableCell(project.installation_city)}</Td>
              <Td>{renderTableCell(project.installation_state)}</Td>
              <Td>{renderTableCell(project.distributor_email)}</Td>
              <Td>{renderTableCell(project.estimated_business_purchasing_decision_date)}</Td>
              <Td>{renderTableCell(project.estimated_implementation_start_date)}</Td>
              <Td>{renderTableCell(project.sector)}</Td>
              <Td>{renderTableCell(project.project_code)}</Td>
              <Td display="flex" justifyContent="flex-start" gap="2">
                <Button colorScheme="yellow" size="sm" onClick={() => openEditModal(project)}>Edit</Button>
                <Button colorScheme="red" size="sm" onClick={() => confirmDelete(project.id)}>Delete</Button>
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
            <FormControl mb="4">
              <FormLabel>End User Company Name</FormLabel>
              <Input value={endUserCompanyName} onChange={(e) => setEndUserCompanyName(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>End User Contact Email</FormLabel>
              <Input value={endUserContactEmail} onChange={(e) => setEndUserContactEmail(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Distributor Contact Name</FormLabel>
              <Input value={distributorContactName} onChange={(e) => setDistributorContactName(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Estimated Revenue</FormLabel>
              <Input type="number" value={estimatedRevenue} onChange={(e) => setEstimatedRevenue(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Estimated Implementation Finish Date</FormLabel>
              <Input type="date" value={estimatedImplementationFinishDate} onChange={(e) => setEstimatedImplementationFinishDate(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Summary</FormLabel>
              <Input value={summary} onChange={(e) => setSummary(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>End User Contact Name</FormLabel>
              <Input value={endUserContactName} onChange={(e) => setEndUserContactName(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>End User Contact Phone</FormLabel>
              <Input value={endUserContactPhone} onChange={(e) => setEndUserContactPhone(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Project Status</FormLabel>
              <Select value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                <option value="Initial">Initial</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Installation City</FormLabel>
              <Input value={installationCity} onChange={(e) => setInstallationCity(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Installation State</FormLabel>
              <Input value={installationState} onChange={(e) => setInstallationState(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Distributor Email</FormLabel>
              <Input value={distributorEmail} onChange={(e) => setDistributorEmail(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Estimated Business Purchasing Decision Date</FormLabel>
              <Input type="date" value={estimatedBusinessPurchasingDecisionDate} onChange={(e) => setEstimatedBusinessPurchasingDecisionDate(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Estimated Implementation Start Date</FormLabel>
              <Input type="date" value={estimatedImplementationStartDate} onChange={(e) => setEstimatedImplementationStartDate(e.target.value)} />
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Sector</FormLabel>
              <Select value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
              </Select>
            </FormControl>
            <FormControl mb="4">
              <FormLabel>Project Code</FormLabel>
              <Input value={projectCode} onChange={(e) => setProjectCode(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr="3" onClick={isEdit ? handleEditProject : handleAddProject}>
              {isEdit ? 'Update Project' : 'Add Project'}
            </Button>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Delete</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this project? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
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
