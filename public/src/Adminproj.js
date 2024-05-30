import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardHeader, Col, Container, Row, Table } from 'reactstrap';

export default function Adminproj() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://tenders.just.sd/api/projects', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token + '',
                },
            });
            setProjects(response.data.data.projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const confirmDelete = window.confirm('Are you sure you want to delete this project?');
            if (confirmDelete) {
                await axios.delete(`https://tenders.just.sd/api/projects/${id}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token + '',
                    },
                });
                fetchProjects();
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleEdit = (id) => {
        // Redirect to the Projects page with the project id to edit
        // This could be implemented using react-router or a similar routing library
        window.location.href = `/projects/${id}`;
    };

    return (
        <Container>
            <Row>
                <Col md={12}>
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
                                                <td>{project.project_code}</td>
                                                <td>{project.project_title}</td>
                                                <td>{project.start_date}</td>
                                                <td>{project.end_date}</td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() => handleEdit(project.id)}
                                                    >
                                                        Edit
                                                    </Button>{" "}
                                                    <Button
                                                        color="danger"
                                                        onClick={() => handleDelete(project.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5">No projects found.</td>
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
