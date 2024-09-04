import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

export default function AdminNavbar(props) {
    const [scrolled, setScrolled] = useState(false);
    const [displayRouteName, setDisplayRouteName] = useState('');
    const [isMounted, setIsMounted] = useState(false);
    const [rolePrefix, setRolePrefix] = useState(''); // State for role prefix
    const location = useLocation();

    useEffect(() => {
        // Fetch user role
        const fetchUserRole = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (userId) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
                    const userRole = response.data.role;

                    // Set the role prefix based on the user's role
                    if (userRole === 'Admin') {
                        setRolePrefix('Admin /');
                    } else if (userRole === 'Partner') {
                        setRolePrefix('Partner /');
                    } else {
                        setRolePrefix('User /'); // Default prefix for other roles
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        if (isMounted) {
            const routeName = location.pathname.split('/').pop();
            const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
            setDisplayRouteName(`${rolePrefix} ${capitalizeFirstLetter(routeName.replace('-', ' '))}`);
        }
    }, [location, isMounted, rolePrefix]);

    useEffect(() => {
        setIsMounted(true);
        window.addEventListener('scroll', changeNavbar);

        return () => {
            window.removeEventListener('scroll', changeNavbar);
        };
    }, []);

    const { secondary, message } = props;

    let mainText = useColorModeValue('navy.700', 'white');
    let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');

    const changeNavbar = () => {
        setScrolled(window.scrollY > 1);
    };

    return (
        <Box
            position="fixed"
            boxShadow="none"
            bg={navbarBg}
            borderColor="transparent"
            alignItems="center"
            display="flex"
            minH="75px"
            justifyContent="center"
            mx="auto"
            mt="0px"
            pb="8px"
            right="30px"
            px="15px"
            pt="8px"
            top="20px"
            w="calc(100vw - 350px)">
            <Flex w="100%" flexDirection="row" alignItems="center" mb="0px" justifyContent="flex-start">
                <Box mb="0px">
                    <Text fontSize="2xl" fontWeight="bold" color={mainText} textAlign="left">
                    </Text>
                </Box>
            </Flex>
            {secondary ? <Text color="white">{message}</Text> : null}
        </Box>
    );
}

AdminNavbar.propTypes = {
    brandText: PropTypes.string,
    variant: PropTypes.string,
    secondary: PropTypes.bool,
    fixed: PropTypes.bool,
    onOpen: PropTypes.func,
};
