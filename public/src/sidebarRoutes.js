import React from 'react';
import { Link } from 'react-router-dom';
import { sidebarRoutes } from './routes';
import { Icon } from "@chakra-ui/react";

const Sidebar = () => {
  return (
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        {sidebarRoutes.map((route, index) => (
          <li className="nav-item" key={index}>
            <Link to={`${route.layout}${route.path}`} className="nav-link">
              {route.icon}
              <p>{route.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
