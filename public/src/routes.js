// Imports
import React from "react";
import { Icon } from "@chakra-ui/react";
import {
  MdHome,
  MdGroup,
  MdPeople,
  MdList,
  MdEdit,
  MdLayers,
  MdBuild,
  MdBusiness,
  MdControlPoint,
  MdPersonAdd,
  MdOutlineLibraryBooks
} from "react-icons/md";


// Admin Imports
import MainDashboard from "views/admin/dashboard";
import Users from "views/admin/users";
import Partners from "views/admin/partners";
import Items from "views/admin/items";
import Clients from "views/admin/clients";
import Projects from "views/admin/projects";
import AddRFQ from "views/admin/rfq";
import EditRFQ from "views/admin/edit-rfq";
import ViewRFQ from "views/admin/view-rfq";
import EditQuotation from "views/admin/edit-quot";
import RFQManagement from "views/admin/rfqManagement";
import UnitGroups from "views/admin/unitGroups";
import Units from "views/admin/units";
import EditProfile from "views/admin/editProfile";
import Quotation from "views/admin/quotation";
import Quotations from "views/admin/quotation/quotations";


// Auth Imports
import SignInCentered from "views/auth/signIn";
import Register from "views/auth/register";
import ForgotPassword from "views/auth/forgotpassword"; // Import Forgot Password component
import ResetPassword from "views/auth/resetpassword"; // Import Reset Password component

// Routes definition with roles
const routes = [
  {
    layout: "/auth",
    path: "/sign-in",
    component: SignInCentered,
  },
  {
    layout: "/auth",
    path: "/register",
    component: Register,
  },
  {
    layout: "/auth",
    path: "/forgot-password",
    component: ForgotPassword,
  },
  {
    layout: "/auth",
    path: "/reset-password",
    component: ResetPassword,
  },
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/dashboard",
    icon: <Icon as={MdHome} width='20px' height='20px' color='inherit' />,
    component: MainDashboard,
  },
  {
    name: "Users",
    layout: "/admin",
    path: "/users",
    icon: <Icon as={MdGroup} width='20px' height='20px' color='inherit' />,
    component: Users,

  },
  {
    name: "Partners",
    layout: "/admin",
    path: "/partners",
    icon: <Icon as={MdPersonAdd} width='20px' height='20px' color='inherit' />,
    component: Partners,

  },
  // {
  //   name: "Items",
  //   layout: "/admin",
  //   path: "/items",
  //   icon: <Icon as={MdList} width='20px' height='20px' color='inherit' />,
  //   component: Items,

  // },
  {
    name: "Clients",
    layout: "/admin",
    path: "/clients",
    icon: <Icon as={MdPeople} width='20px' height='20px' color='inherit' />,
    component: Clients,
 
  },
  {
    name: "Projects",
    layout: "/admin",
    path: "/projects",
    icon: <Icon as={MdLayers} width='20px' height='20px' color='inherit' />,
    component: Projects,
  },
  {
    layout: "/admin",
    path: "/add-rfq",
    component: AddRFQ,
  },
  {
    layout: "/admin",
    path: "/quotation/:id",
    component: Quotation,
  },
  {
    layout: "/admin",
    path: "/edit-quot/:id",
    component: EditQuotation,
  },
  {
    layout: "/admin",
    path: "/edit-rfq/:id",
    component: EditRFQ,
  },
  {
    layout: "/admin",
    path: "/view-rfq/:id",
    component: ViewRFQ,
  },
  {
    name: "RFQ Management",
    layout: "/admin",
    path: "/rfq-management",
    icon: <Icon as={MdBuild} width='20px' height='20px' color='inherit' />,
    component: RFQManagement,
  },
  {
    // name: "Quotsation",
    layout: "/admin",
    path: "/quotation/:rfq_id/RFQ",
    component: Quotation,
  },
  {
    name: "Quotations",
    layout: "/admin",
    path: "/quotations",
    icon: <Icon as={MdOutlineLibraryBooks} width='20px' height='20px' color='inherit' />,
    component: Quotations,
  },

  // {
  //   name: "Unit Groups",
  //   layout: "/admin",
  //   path: "/unit-groups",
  //   icon: <Icon as={MdBusiness} width='20px' height='20px' color='inherit' />,
  //   component: UnitGroups,
  // },
  // {
  //   name: "Units",
  //   layout: "/admin",
  //   path: "/units",
  //   icon: <Icon as={MdControlPoint} width='20px' height='20px' color='inherit' />,
  //   component: Units,
  // },
  {
    name: "Edit Profile",
    layout: "/admin",
    path: "/edit-profile",
    icon: <Icon as={MdEdit} width='20px' height='20px' color='inherit' />,
    component: EditProfile,
  },
];

const getUserRole = () => {
  const _role = localStorage.getItem('role');
  return _role  
};


const getRoutesForRole = (role) => {
  if (role === 'Admin') {
    console.log(routes,role);
    return routes; 
  } else {
    console.log(routes,role);
    return routes.filter(route => 
      ['Dashboard','clients', 'projects', 'rfq-management', 'edit-profile'].includes(route.path.split('/')[1])
    );
  }
};

const sidebarRoutes = routes.filter(route => route.name); 


export { routes, sidebarRoutes };
export default routes;