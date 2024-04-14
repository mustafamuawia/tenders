import React, { useState,useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row,Label,FormGroup,CardHeader,Table,
  Badge,Pagination,PaginationItem,PaginationLink} from 'reactstrap';
 
export default function Profile() {

  const initFormData= { name:'',
  CompanyEmail:'',
  email:'',
  email_confirmation:'',
  password:'',
  password_confirmation:'',
  Phone:'',
  partner:{PartnerId:'',CompanyEmail:"",CompanyName:"",Phone:"",Class:""}
}
    const [formData,setformData]= useState(initFormData)
    const [value,setValue]=useState('')
    const [isPartner,setIsPartner] = useState(true)
   
   

    function getUser()  
  {
    var user = localStorage.getItem('user')
    return JSON.parse(user);
  }
    function handleChange(event) {
        const value = event.target.value;
        setformData(formData=>({
          ...formData,
          [event.target.name]: event.target.value
       }))
      }
        
          
        const handleSubmit = e => {
          e.preventDefault();
          let url="";
          if (isPartner)
          url="/user/updateuser"
          else
          url="/user/updateadmin"
          
             fetch(process.env['REACT_APP_API_URL']+url, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData),
            }).then(setformData(initFormData)).then(alert("تم"));;
          
        };
      
        
          useEffect(() => {
           let user = getUser()
           setformData(user)
           if (user.role =="Admin")
           setIsPartner(false)
          },[value]);
     
       const navigate = useNavigate();

        return (
          
          
            <section className="vh-100" style={{backgroundCcolor: '#508bfc'}}>
            <div className="container py-5 h-100">
              <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-lg-6">
                  <div className="card shadow-2-strong" style={{borderRadius: '1rem'}}>
                    <div className="card-body p-5 text-center">
          
                      <h3 className="mb-5">Profile</h3>
                      <Form onSubmit={handleSubmit}>
                      <div className="form-outline mb-4">
                        
                       <label className="form-label" htmlFor="ContactName">Contact Name</label>
                        <input type="text" id="name"  onChange={handleChange} value={formData.name}  required  name="name" className="form-control form-control-lg" />
                        </div>
                        {isPartner?<>
                        <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="CompanyName">Company Name</label>
                         <input type="text" id="CompanyName"  onChange={handleChange} value={formData.partner.CompanyName} required name="CompanyName" className="form-control form-control-lg" />
                         </div>
                         <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="CompanyEmail">Company Email</label>
                         <input type="email" id="CompanyEmail"  onChange={handleChange} value={formData.partner.CompanyEmail}  required name="CompanyEmail" className="form-control form-control-lg" />
                         </div>
                         <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="Phone">Company Phone</label>
                         <input type="text" id="Phone" onChange={handleChange}  name="Phone" value={formData.partner.Phone} className="form-control form-control-lg" />
                         </div></>:null
                        }
                       <div className="form-outline mb-4">
                       <label className="form-label" htmlFor="email">Email</label>
                        <input type="email" id="email"  onChange={handleChange} value={formData.email} required name="email" className="form-control form-control-lg" />
                        </div>
                        <div className="form-outline mb-4">
                       <label className="form-label" htmlFor="email_confirmation">Email Confirm</label>
                        <input type="email" id="email_confirmation"  onChange={handleChange} value={formData.email} name="confirmation"  required className="form-control form-control-lg" />
                        </div>
                      <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="password">Password</label>
                      
                        <input type="password" id="password" onChange={handleChange}  required name="password" className="form-control form-control-lg" />
                      </div>
          
                      <div className="form-outline mb-4">
                      <label className="form-label"   htmlFor="PasswordConfirm">Password Confirm</label>
                     
                        <input type="password"  onChange={handleChange}  id="password_confirmation" required name="password_confirmation" className="form-control form-control-lg" />
                        </div>
                      <Button className="btn btn-primary btn-lg btn-block" type="submit">Save </Button>
                      
                      </Form>

                    
          <br/>
                      {/* <button type="button" className="btn btn-link btn-floating mx-1">
          <i className="fa fa-facebook"></i>
        </button>

        <button type="button" className="btn btn-link btn-floating mx-1">
          <i className="fa fa-google red-color"></i>
        </button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </section>
        
        );
                      }