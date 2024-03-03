import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardBody, CardGroup, Col, Container, Form, Input,
  InputGroup, InputGroupAddon, InputGroupText, Row, Label, FormGroup, CardHeader, Table,
  Badge, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';

export default function Partners() {
  const [Partners, setPartners] = useState([]);
  const [value, setValue] = useState('')

  let initFormData = {
CompanyEmail:'',
CompanyName:'',
Phone:'',
Class:'',
User:[],

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

    fetch(process.env['REACT_APP_API_URL'] + "/auth/partner/getpartners", {
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
          setPartners(result)
        },

        (error) => {

        }
      );

  }

  function editRow(e) {
    setformData(formData);

  }

  const deleteRow = id => {
    if (window.confirm('Are you sure to delete this record?')) {
      const token = localStorage.getItem('access_token')
      fetch(process.env['REACT_APP_API_URL'] + "/auth/partner/delete/" + id, {
        method: 'get',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "Authorization": 'Bearer ' + token + ''
        },
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


  useEffect(() => {
    getData();

  }, [value]);

  return (


    <Container>
      <Row>
        
        <Col lg="12">
          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Partners List
            </CardHeader>
            <CardBody>
              {Partners.length ?
                (
                  <Table responsive striped>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>ID</th>
                        <th>Contact Name</th>
                        <th>Company Name</th>
                        <th>Company Email</th>
                        <th>Email</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        Partners.map(Partner => (
                          <tr>
                            <td><Button name={"Delete" + Partner.PartnerId} className="btn btn-danger" onClick={() => deleteRow( Partner.PartnerId)} >Delete</Button></td>
                              <td>{Partner.PartnerId}</td>
                              <td>{Partner.user?Partner.user.name:'-'}</td>
                            <td>{Partner.CompanyName}</td>
                            <td>{Partner.CompanyEmail}</td>
                            <td>{Partner.Phone}</td>
                            <td>{Partner.Class}</td>
                            <td>{Partner.user?Partner.user.Status:''}</td>
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