// views/admin/Logout.js
import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/logout'); 
   
      history.push('/auth/signin'); 
    } catch (error) {
      console.error('Logout failed:', error);

    }
  };
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null;
};

export default Logout;
