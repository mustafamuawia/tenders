import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
  Button,
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import {
  renderThumb,
  renderTrack,
  renderView,
} from "components/scrollbar/Scrollbar";
import { Scrollbars } from "react-custom-scrollbars-2";
import { IoMenuOutline } from "react-icons/io5";
import PropTypes from "prop-types";
import { sidebarRoutes } from "routes";
import axios from "axios";

function Sidebar() {
  const [userRole, setUserRole] = useState(null);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
        const { role } = response.data;
        setUserRole(role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userRole) {
      // Filter routes based on user role
      const routes = sidebarRoutes.filter(route => {
        if (userRole === "Admin") {
          return true; // Admins can see all routes
        } else {
          return ["Clients", "RFQ Management", "Edit Profile", "Projects","Quotations"].includes(route.name);
        }
      });
      setFilteredRoutes(routes);
    }
  }, [userRole]);

  let variantChange = "0.2s linear";
  let shadow = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
    "unset"
  );
  let sidebarBg = useColorModeValue("white", "navy.800");
  let sidebarMargins = "0px";
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        display={{ sm: "flex", xl: "none" }}
        position="fixed"
        top="20px"
        right="20px"
        onClick={onOpen}
        zIndex="1000"
        bg="gray.500"
        color="white"
        _hover={{ bg: "gray.600" }}
      >
        <IoMenuOutline size={20} />
      </Button>

      <Box display={{ sm: "none", xl: "block" }} w="100%" position="fixed" minH="100%">
        <Box
          bg={sidebarBg}
          transition={variantChange}
          w="300px"
          h="100vh"
          m={sidebarMargins}
          minH="100%"
          overflowX="hidden"
          boxShadow={shadow}
        >
          <Scrollbars
            autoHide
            renderTrackVertical={renderTrack}
            renderThumbVertical={renderThumb}
            renderView={renderView}
          >
            <Content routes={filteredRoutes} />
          </Scrollbars>
        </Box>
      </Box>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={null}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBg}>
          <DrawerCloseButton
            zIndex="3"
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={filteredRoutes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidebar;
