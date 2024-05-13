import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';
import Switch from 'react-switch'; // Import Switch from react-switch

export default function Unit_Category() {
    // State variable for form data
    const [formData, setFormData] = useState({
        unit_group_name: '',
        description: '',
    });

    // Sample data for the table
    const [groups, setGroups] = useState([
        { id: 1, unit_group_name: 'Group 1', description: 'Description 1', status: true },
        { id: 2, unit_group_name: 'Group 2', description: 'Description 2', status: false },
        // Add more groups as needed
    ]);

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Perform form submission logic here
    };

    // Function to handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to toggle group status
    const toggleStatus = (id) => {
        setGroups(groups.map(group => group.id === id ? { ...group, status: !group.status } : group));
    };

    return (
        <Container>
            <Row>
                <Col md={6}>
                    {/* Form Section */}
                    <Card>
                        <CardHeader>Add Unit</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                {/* Input fields for group details */}
                                <FormGroup>
                                    <Label for="unit_group_name">Unit Name</Label>
                                    <Input
                                        type="text"
                                        name="unit_group_name"
                                        id="unit_group_name"
                                        placeholder="Enter unit name"
                                        value={formData.unit_group_name}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                {/* Description */}
                                <FormGroup  
                                className="mt-4"
                                style={{
                                    borderBottom: "1px solid #ced4da",
                                    marginBottom: "20px",
                                }}>
                                    <Label for="description">Description</Label>
                                    <Input
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        placeholder="Enter description"
                                        value={formData.description}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                {/* Submit button */}
                                <Button color="primary">Save</Button>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
                <Col md={6}>
                    {/* Table Section */}
                    <Card>
                        <CardHeader>Units List</CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Group Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groups.map(group => (
                                        <tr key={group.id}>
                                            <td>{group.unit_group_name}</td>
                                            <td>{group.description}</td>
                                            <td>
                                                {/* Toggle switch for status */}
                                                <Switch
                                                    checked={group.status}
                                                    onChange={() => toggleStatus(group.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
