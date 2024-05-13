import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';

export default function Projects() {
    const [formData, setFormData] = useState({
        project_title: '',
        start_date: '',
        end_date: '',
        country: '',
        state: '',
        city: '',
        address: '',
        status: '',
    });

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(
                "https://tenders.just.sd/api/projects",
                {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token + "",
                    },
                }
            );
            setProjects(response.data.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            await axios.post("https://tenders.just.sd/api/projects", formData, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token + "",
                },
            });
            setFormData({
                project_title: '',
                start_date: '',
                end_date: '',
                country: '',
                state: '',
                city: '',
                address: '',
                status: '',
            });
            fetchProjects();
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };
    const generateProjectCode = () => {
        // Generate a unique project code, you can use any logic you prefer
        const code =
            "PROJ_" + Math.random().toString(36).substring(2, 8).toUpperCase();
        return code;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (id) => {
        // Implement edit functionality here
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const confirmDelete = window.confirm('Are you sure you want to delete this project?');
            if (confirmDelete) {
                await axios.delete(
                    `https://tenders.just.sd/api/projects/${id}`,
                    {
                        headers: {
                            "Access-Control-Allow-Origin": "*",
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token + "",
                        },
                    }
                );
                fetchProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Card>
                        <CardHeader>Add Project</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="project_code">
                                        Project Code
                                    </Label>
                                    <Input
                                        type="text"
                                        name="project_code"
                                        id="project_code"
                                        placeholder="Project Code"
                                        value={generateProjectCode()} // Generate project code here
                                        disabled
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="project_title">
                                        Project Title
                                    </Label>
                                    <Input
                                        type="text"
                                        name="project_title"
                                        id="project_title"
                                        placeholder="Enter project title"
                                        value={formData.project_title}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label for="start_date">Start Date</Label>
                                    <Input
                                        type="date"
                                        name="start_date"
                                        id="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="end_date">End Date</Label>
                                    <Input
                                        type="date"
                                        name="end_date"
                                        id="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="country">Country</Label>
                                    <Input
                                        type="text"
                                        name="country"
                                        id="country"
                                        placeholder="Enter country"
                                        value={formData.country}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="state">State</Label>
                                    <Input
                                        type="text"
                                        name="state"
                                        id="state"
                                        placeholder="Enter state"
                                        value={formData.state}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="city">City</Label>
                                    <Input
                                        type="text"
                                        name="city"
                                        id="city"
                                        placeholder="Enter city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="address">Address</Label>
                                    <Input
                                        style={{
                                            borderBottom: "1px solid #ced4da",
                                            marginBottom: "20px",
                                        }}
                                        type="text"
                                        name="address"
                                        id="address"
                                        placeholder="Enter address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </FormGroup>

                                <Button color="primary">Save</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <CardHeader>Projects List</CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Project Code</th>
                                        <th>Project Title</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects && projects.length > 0 ? (
                                        projects.map((project) => (
                                            <tr key={project.id}>
                                                <td>{project.project_title}</td>
                                                <td>{project.start_date}</td>
                                                <td>{project.end_date}</td>
                                                <td>{project.status}</td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() =>
                                                            handleEdit(
                                                                project.id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>{" "}
                                                    <Button
                                                        color="danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                project.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">
                                                No projects found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
