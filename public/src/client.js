import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';

export default function Clients() {
    const [formData, setFormData] = useState({
        client_name: '',
        phone: '',
        address: '',
        country: '',
        state: '',
        city: '',
        status: '',
    });

    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://tenders.just.sd/api/clients', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token + '',
                },
            });
            setClients(response.data.clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('https://tenders.just.sd/api/clients', formData, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token + '',
                },
            });
            clearFormFields();
            fetchClients();
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (id) => {
        // Handle editing client
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const confirmDelete = window.confirm('Are you sure you want to delete this client?');
            if (confirmDelete) {
                await axios.delete(`https://tenders.just.sd/api/clients/${id}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token + '',
                    },
                });
                fetchClients();
            }
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    const clearFormFields = () => {
        setFormData({
            client_name: '',
            phone: '',
            address: '',
            country: '',
            state: '',
            city: '',
            status: '',
        });
    };


    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Card>
                        <CardHeader>Add Client</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="client_name">Client Name</Label>
                                    <Input
                                        type="text"
                                        name="client_name"
                                        id="client_name"
                                        placeholder="Client Name"
                                        value={formData.client_name}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="phone">Phone</Label>
                                    <Input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="address">Address</Label>
                                    <Input
                                        type="text"
                                        name="address"
                                        id="address"
                                        placeholder="Enter address"
                                        value={formData.address}
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
                                        style={{
                                            borderBottom: "1px solid #ced4da",
                                            marginBottom: "20px",
                                        }}
                                        type="text"
                                        name="city"
                                        id="city"
                                        placeholder="Enter city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <Button color="primary">Save</Button>
                                <span
                                    style={{ marginRight: "10px" }}
                                ></span>{" "}
                                <Button
                                    color="secondary"
                                    onClick={clearFormFields}
                                >
                                    Clear
                                </Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <CardHeader>Clients List</CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Client Name</th>
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients && clients.length > 0 ? (
                                        clients.map((client) => (
                                            <tr key={client.id}>
                                                <td>{client.client_name}</td>
                                                <td>{client.phone}</td>
                                                <td>{client.address}</td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() =>
                                                            handleEdit(
                                                                client.id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </Button>{" "}
                                                    <Button
                                                        color="danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                client.id
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
                                            <td colSpan="4">
                                                No clients found.
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
