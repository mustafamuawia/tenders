import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { sidebarRoutes } from "routes"; 
import { useHistory } from 'react-router-dom';

const RoleBasedRoutes = () => {
  const [userRole, setUserRole] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
        const { role } = response.data;
        setUserRole(role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('Guest');
      }
    };

    fetchUserRole();
  }, []);

  if (!userRole) {
    return <div>Loading...</div>; 
  }

  // Filter routes based on user role
  const filteredRoutes = sidebarRoutes.filter(route => {
    if (userRole === 'Admin') {
      return true; 
    } else {
      return ['Clients', 'RFQ Management', 'Edit Profile', 'Projects'].includes(route.name);
    }
  });

  return (
    <div>
      {filteredRoutes.map((route, index) => (
        <div key={index} onClick={() => history.push(route.layout + route.path)}>
          {route.name}
        </div>
      ))}
    </div>
  );
};

export default RoleBasedRoutes;
