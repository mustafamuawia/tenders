import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardBody, CardGroup, Col,CustomInput, Container, Form, Input,
  InputGroup, InputGroupAddon, InputGroupText, Row, Label, FormGroup, CardHeader, Table,
  Badge, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import $ from 'jquery'

export default function Users() {

  const [Users, setUsers] = useState([]);
  const [value, setValue] = useState('')
  function getUser() {
    var user = localStorage.getItem('user')
    return user.id;
  }

  let initFormData = {
    id: '',
    name: '',
    email: '',
    password: '',
    role: 'Admin',
    Status: ''
  }
  const [formData, setformData] = useState(initFormData)

  function handleChange(event) {
    const value = event.target.value;
    setformData(formData => ({
      ...formData,
      [event.target.name]: event.target.value
    }))
  }

  const getData = () => {
    const token = localStorage.getItem('access_token')

    fetch(process.env['REACT_APP_API_URL'] + "/auth/user/getusers", {
      // mode:'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + token + ''
      }
    })
      .then(res => res.json())
      .then(
        (result) => {
          setUsers(result)
        },

        (error) => {

        }
      );

  }

  function editRow(e, ProductID, ProductName, Species, CategoryID) {
    setformData(formData);

  }

  const deleteRow = id => {
    if (window.confirm('Are you sure to delete this record?')) {
      const token = localStorage.getItem('access_token')
      fetch(process.env['REACT_APP_API_URL'] + "/auth/user/delete/" + id, {
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token + ''
        },
        //  body: JSON.stringify(formData),
      }).then(getData()).then(setformData(initFormData)).then(alert("تم"));
    }
  }
  const handleSubmit = e => {
    e.preventDefault();
    const token = localStorage.getItem('access_token')

    if (formData.id != '' && typeof formData.id != "undefined") {
      fetch(process.env['REACT_APP_API_URL'] + "/auth/user/update", {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token + ''
        },
        body: JSON.stringify(formData),
      }).then(getData()).then(setformData(initFormData)).then(alert("تم"));
    }
    else {
      fetch(process.env['REACT_APP_API_URL'] + "/auth/user/create", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token + ''
        },
        body: JSON.stringify(formData),
      }).then(getData()).then(setformData(formData)).then(alert("تم"));;
    }

  };
  const ChangeStatus = (id,Status) =>
  {
    const token = localStorage.getItem('access_token')

    fetch(process.env['REACT_APP_API_URL'] + "/auth/user/changestatus", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "Authorization": 'Bearer ' + token + ''
      },
      body: JSON.stringify({id:id,Status:Status}),
    }).then(getData()).then(setformData(formData)).then(alert("تم"));

  }
  const onChangeValue = (event) => {
    
    const value = event.target.value;
    if (!document.getElementById(event.target.id).checked)
    {
      if (window.confirm('Are you sure to deactivate the user?')) {
         
        document.getElementById(event.target.id).checked=false
       
    ChangeStatus(event.target.id,'Not Activated')
        }
        else
        document.getElementById(event.target.id).checked=true
    }
    else
    {
      if (window.confirm('Are you sure you want to activate the user?')) {
        
        
   ChangeStatus(event.target.id,'Activated')
   document.getElementById(event.target.id).checked=true
      }
     else
     {
      document.getElementById(event.target.id).checked=false
     }
    }
  }
  const setChecked=(id,Status)=>
  {
    if (Status=='Activated')
    $('#'+id).prop('checked', true);
  }

  useEffect(() => {
    getData();

  }, [value]);

  return (


    <Container>
      <Row>
        <Col lg="5">
          <Card>

            <CardHeader>
              <h1>Add User</h1>
            </CardHeader>
            <CardBody>

              <Form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" onChange={handleChange} value={formData.name} name="name" placeholder="End User Company Name" autoComplete="name" />
                </div>

                <div className='form-group'>
                  <Label htmlFor="email">Email</Label>

                  <Input type="text" onChange={handleChange} value={formData.email} name="email" placeholder="Email" autoComplete="email" />

                </div>

                <div className='form-group'>

                  <Label htmlFor="password">Password</Label>

                  <Input type="text" onChange={handleChange} value={formData.password} name="password" placeholder="Password" autoComplete="password" />

                </div>

                <div className='form-group'>
                  <Label htmlFor="password_confirm">Password Confirm</Label>

                  <Input type="text" onChange={handleChange} value={formData.password_confirm} name="password_confirm" placeholder="Password Confirm" autoComplete="password_confirm" />
                </div>

                <div className='form-group'>
                  <Label htmlFor="role">Role</Label>
                  <select className='form-control' name="role" defaultValue={formData.role}>
                    <option>Admin</option>
                   
                  </select>
                </div>

                <Button color="primary" className="btn btn-info">Save</Button>

              </Form>

            </CardBody>

          </Card>
        </Col>
        <Col lg="7">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Users List
            </CardHeader>
            <CardBody>
              {Users.length ?
                (
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Users.map(User => (
                          <tr>
                            <td><Button className="btn btn-info" name={"Edit" + User.id} onClick={(e) => editRow(e)}>Edit</Button>
                              <Button name={"Delete" + User.id} className="btn btn-danger" onClick={(e) => deleteRow(User.id)} >Delete</Button></td>

                            <td>{User.id}</td>
                            <td>{User.name}</td>
                            <td>{User.email}</td>
                            <td>{User.role}</td>
                            <td><label className="switch">
  <Input type="checkbox" id={User.id} defaultChecked={User.Status=="Activated"?true:false} onChange={onChangeValue}  />
  <span className="slider"></span>
</label></td>
                          </tr>

                        )
                        )
                      }
                    </tbody></Table>
                ) :
                <p>No Data...</p>

              }


            </CardBody>
          </Card>

        </Col>
      </Row>
    </Container>

  );
}