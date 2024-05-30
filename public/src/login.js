import React, { useState, useEffect } from 'react';
import { Button, Form, Container, Card, CardBody, CardHeader } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

const Login = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: -1,
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (event) => {
    const value = event.target.value;
    setFormData((formData) => ({
      ...formData,
      [event.target.name]: value
    }));
  };

  const handleSubmit = (e) => {
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
            if (result.user.Status === 'Not Activated') {
              alert('Account is not activated yet!');
            } else {
              localStorage.setItem('access_token', result.access_token);
              localStorage.setItem('user', JSON.stringify(result.user));
              props.setLoggedIn(true);
              navigate('/main');
            }
          } else {
            alert(result.error);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  };

  useEffect(() => {}, []);

  return (
    <Container className="vh-100 d-flex justify-content-center align-items-center">
      <Card className="shadow-2-strong" style={{ borderRadius: '1rem' }}>
        <CardHeader className="text-center">
          <img src="public/unv.png" alt="Logo" style={{ width: '150px', height: 'auto' }} />
        </CardHeader>
        <CardBody>
          <h3 className="mb-5 text-center">Sign in</h3>
          <Form onSubmit={handleSubmit} className="text-center">
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                id="email"
                className="form-control form-control-lg text-center"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                onChange={handleChange}
                name="password"
                className="form-control form-control-lg text-center"
                style={{ width: '100%' }}
              />
            </div>

            <div className="form-check d-flex justify-content-center mb-4">
              <input className="form-check-input" type="checkbox" value="" id="form1Example3" />
            </div>

            <Button className="btn btn-primary btn-lg btn-block" type="submit">Sign In</Button>
          </Form>
          <hr className="my-4" />
          <div className="text-center">
            You don't have an account?&nbsp;
            <a href="#" className="alert-link" onClick={() => navigate("/signup")}>New Account</a>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};

export default Login;
