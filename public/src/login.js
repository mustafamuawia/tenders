import React, { useState, useEffect } from 'react';

import {
  Button, Card, CardBody, CardGroup, Col, Container, Form, Input,
  InputGroup, InputGroupAddon, InputGroupText, Row, Label, FormGroup, CardHeader, Table,
  Badge, Pagination, PaginationItem, PaginationLink
} from 'reactstrap';
import { Navigate, useNavigate, BrowserRouter as Router } from 'react-router-dom';

const Login = (props) => {
  {
    let navigate = useNavigate();
    const [Tenders, setTenders] = useState([]);
    const initFormData = {
      id: -1,
      name: '',
      email: '',
      password: ''
    }
    const [formData, setformData] = useState(initFormData)

    function handleChange(event) {
      const value = event.target.value;
      setformData(formData => ({
        ...formData,
        [event.target.name]: event.target.value
      }))
    }



    const handleSubmit = e => {
      e.preventDefault();


      fetch(process.env['REACT_APP_API_URL'] + "/login", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      }).then(res => res.json())
        .then(
          (result) => {

            if (result.hasOwnProperty('access_token')) {
              if (result.user.Status == 'Not Activated') {
                alert('Account is not activated yet!')
              }
              else {
                localStorage.setItem('access_token', result.access_token);
                localStorage.setItem('user', JSON.stringify(result.user));
                props.setLoggedIn(true)
                navigate('/main');
              }
            }
            else
              alert(result.error)
          },

          (error) => {

          })
    }





    useEffect(() => {

    }, []);

    navigate = useNavigate();
    return (


      <section className="vh-100" style={{ backgroundCcolor: '#508bfc' }}>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-6">
              <div className="card shadow-2-strong" style={{ borderRadius: '1rem' }}>
                <div className="card-body p-5 text-center">
                  <Form onSubmit={handleSubmit}>
                    <img src="public/unv.png" />
                    <h3 className="mb-5">Sign in </h3>


                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="email">Email</label>

                      <input type="email" name='email' onChange={handleChange} id='email' className="form-control form-control-lg" />
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Password</label>
                      <input type="password" id="password" onChange={handleChange} name='password' className="form-control form-control-lg" />
                    </div>


                    <div className="form-check d-flex justify-content-start mb-4">
                      <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
                      {/* <label className="form-check-label" htmlFor="form1Example3"> Remember Me </label> */}
                    </div>

                    <Button className="btn btn-primary btn-lg btn-block" type="submit">Sign In</Button>

                    <hr className="my-4" />
                    You don't have account?&nbsp;          <a href="#" className="alert-link" onClick={() => navigate("/signup")}>New Account</a>
                    <br />
                    {/* <button type="button" className="btn btn-link btn-floating mx-1">
          <i className="fa fa-facebook"></i>
        </button>

        <button type="button" className="btn btn-link btn-floating mx-1">
          <i className="fa fa-google red-color"></i>
        </button> */}
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    );
  }
}
export default Login;