import logo from './logo.svg';
import React , { useState,useEffect } from 'react';
import Tenders from './tenders';
import Users from './users';
import Main from './main';
import Login from './login';
import Partners from './partners';
import Profile from './profile';
import Signup from './signup';
import Clients from './client';
import Items from './items';

import { Button, Card, CardBody, Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row,Label,FormGroup,CardHeader,Table,
  Badge,Pagination,PaginationItem,PaginationLink} from 'reactstrap';
 
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Routes,
  Route,
  Link,
  useNavigate,
 
} from "react-router-dom";
import {Redirect} from 'react-router'
// import {  } from 'react/cjs/react.production.min';

export default function App() {
 
  let navigate = useNavigate(); 
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin,setIsAdmin] = useState(false)
  const [isOpen,setIsOpen] = useState(false)
  const [User,setUser]= useState([])
  function getUser()  
  {
    var user = localStorage.getItem('user')
    return JSON.parse(user);
  }
 const handleLogin = () => {
 setLoggedIn(true)
 }
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    setLoggedIn(false)

    navigate('/Login',{ replace: true })
    }
    const handleOnClick = () => {
      
      const div = document.getElementById('navbar');
      if (div !== null) {
          if (isOpen) { 
                 
            div.classList.remove("in");
             setIsOpen(!isOpen)
          } else {
             
            setIsOpen(!isOpen)
          }
      }
  }
    const checkStorage = key => {
      const storedData = localStorage.getItem(key);
      if (!storedData) 
      return false
      else 
      return true
   }
    useEffect(() => {
    const isUserFound = checkStorage('user')

   if (isUserFound)
   setLoggedIn(true)
   else
   {
     handleLogout()
     return
   }
   
   const user = getUser()
   setUser(user)
   //alert(user.role=='Admin')
   console.log('')
   if (user.role=='Admin')
   {
     setIsAdmin(true)
   }
   else 
   setIsAdmin(false)

    },[isAdmin,loggedIn]);
  
if (loggedIn)
    
return (
<>
 <nav className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" id="toggle" onClick={handleOnClick} className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">Projects, Welcome {User.name}</a>
        </div>
        <div id="navbar" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right flip">
          <li><Link onClick={handleOnClick} to="/main">Home</Link></li>
          <li> <Link onClick={handleOnClick} to="/tenders">Projects</Link></li>
          {isAdmin?
          <>
          <li><Link onClick={handleOnClick} to="/partners">Partners</Link></li>
          <li><Link onClick={handleOnClick} to="/users">Users</Link></li>

         
          </>
          :null
            }
            <li><Link className="link link-primary" to="/client">Clients</Link></li>
            <li><Link className="link link-primary" to="/items">Items</Link></li>
             <li><Link onClick={handleOnClick} to="/profile">Profile</Link></li>
          <li><a className="link link-primary" onClick={handleLogout} >Logout</a></li>
         </ul>
          {/* <form className="navbar-form navbar-right flip">
            <input type="text" className="form-control" placeholder="Search" />
          </form> */}
        </div>
      </div>
    </nav>

    <div className="container-fluid">
      <div className="row">
        <div className="col-sm-3 col-md-2 sidebar">
          <ul className="nav nav-sidebar   navbar-center ">
          <li><Link to="/main">Home</Link></li>
          <li><Link to="/tenders">Projects</Link></li>
            {isAdmin?
          <>
           
            <li><Link to="/partners">Partners</Link></li>
            <li><Link  to="/users">Users</Link></li>

               </>
          :null}
          <li><Link className="link link-primary" to="/client">Clients</Link></li>
          <li><Link className="link link-primary" to="/items">Items</Link></li>
        
          <li><Link className="link link-primary" to="/profile">Profile</Link></li>
         
            <li><a className="link link-primary" onClick={handleLogout} >Logout</a></li>
          </ul>
        
        </div>
        <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
        <Routes>
<Route path="/tenders" exact name="Tenders" element={<Tenders/>} /> 
<Route path="/client" exact name ="Client" element={<Clients />}/>
<Route path="/items" exact name ="ITEMS" element={< Items/>}/>

            <Route path="/users" exact name="users" element={<Users />} />
         <Route path='/main' exact name="main" element={<Main />} /> 
         <Route path='/partners' exact name="partners" element={<Partners />} /> 
         <Route path='/profile' exact name="profile" element={<Profile />} /> 
         
          </Routes>
                      
        </div>
      </div>
    </div>

    </>
)
else
{
 return(  <Routes>
           <Route path='/login' exact name="login" element={<Login  loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} /> 
           <Route path='/signup' exact name="signup" element={<Signup />} /> 
           
           </Routes>)
}
                   
                    }


