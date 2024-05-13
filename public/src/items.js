import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormGroup, Input, Label, Row, Table } from 'reactstrap';


export default function Items() {
    const [formData, setFormData] = useState({
        id: null,
        item_name: '',
        description: '',
        specifications: '',
        manufacturer: '',
        origin_country: '',
    });

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('https://tenders.just.sd/api/items', {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token + '',
                },
            });
            setItems(response.data.data.items); // Update items state
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            if (formData.id) {
                // If formData has an id, it means we're updating an existing item
                await axios.put(`https://tenders.just.sd/api/items/${formData.id}`, formData, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization" : 'Bearer '+token+''
                    },
                });
            } else {
                // If formData doesn't have an id, it means we're creating a new item
                await axios.post('https://tenders.just.sd/api/items', formData, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization" : 'Bearer '+token+''
                    },
                });
            }
            
            // Clear the form fields after submission
            clearFormFields();
            
            // Fetch the updated list of items
            fetchItems(); 
        } catch (error) {
            console.error('Error creating/updating item:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleEdit = (id) => {
        // Find the item with the specified id
        const itemToEdit = items.find(item => item.id === id);
        
        // Populate the form fields with the data of the item to edit
        setFormData({
            id: itemToEdit.id,
            item_name: itemToEdit.item_name,
            description: itemToEdit.description,
            specifications: itemToEdit.specifications,
            manufacturer: itemToEdit.manufacturer,
            origin_country: itemToEdit.origin_country,
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('access_token');
            const confirmDelete = window.confirm('Are you sure you want to delete this item?');
            if (confirmDelete) {
                await axios.delete(`https://tenders.just.sd/api/items/${id}`, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token + '',
                    },
                });
                fetchItems();
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const clearFormFields = () => {
        setFormData({
            id: null,
            item_name: '',
            description: '',
            specifications: '',
            manufacturer: '',
            origin_country: '',
        });
    };

    return (
        <Container>
            <Row>
                <Col md={6}>
                    <Card>
                        <CardHeader>Add Item</CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label for="item_name">Item Name</Label>
                                    <Input
                                        type="text"
                                        name="item_name"
                                        id="item_name"
                                        placeholder="Enter item name"
                                        value={formData.item_name}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
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
                                <FormGroup>
                                    <Label for="specifications">
                                        Specifications
                                    </Label>
                                    <Input
                                        type="textarea"
                                        name="specifications"
                                        id="specifications"
                                        placeholder="Enter specifications"
                                        value={formData.specifications}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="manufacturer">
                                        Manufacturer
                                    </Label>
                                    <Input
                                        type="text"
                                        name="manufacturer"
                                        id="manufacturer"
                                        placeholder="Enter manufacturer"
                                        value={formData.manufacturer}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <FormGroup
                                    className="mt-4"
                                    style={{
                                        borderBottom: "1px solid #ced4da",
                                        marginBottom: "20px",
                                    }}
                                >
                                    <Label for="origin_country">
                                        Origin Country
                                    </Label>
                                    <Input
                                        type="text"
                                        name="origin_country"
                                        id="origin_country"
                                        placeholder="Enter origin country"
                                        value={formData.origin_country}
                                        onChange={handleChange}
                                    />
                                </FormGroup>
                                <Button color="primary" className="mr-2">
                                    Save
                                </Button>
                                <span style={{ marginRight: "10px" }}></span>{" "}
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
                        <CardHeader>Items List</CardHeader>
                        <CardBody>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Item Name</th>
                                        <th>Manufacturer</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items && items.length > 0 ? (
                                        items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.item_name}</td>
                                                <td>{item.manufacturer}</td>
                                                <td>{item.created_at}</td>
                                                <td>
                                                    <Button
                                                        color="info"
                                                        onClick={() =>
                                                            handleEdit(item.id)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>{" "}
                                                    <Button
                                                        color="danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                item.id
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
                                            <td colSpan="4">No items found.</td>
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
