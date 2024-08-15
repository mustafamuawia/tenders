import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function AdminNavbar(props) {
    const [ setScrolled] = useState(false);
    const [displayRouteName, setDisplayRouteName] = useState('');
    const [isMounted, setIsMounted] = useState(false); // Track if the component is fully mounted
    const location = useLocation();

    useEffect(() => {
        // Update displayRouteName when location changes
        if (isMounted) {
            const routeName = location.pathname.split('/').pop();
            const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);
            setDisplayRouteName(`Admin / ${capitalizeFirstLetter(routeName.replace('-', ' '))}`);
        }
    }, [location, isMounted]);

    useEffect(() => {
        // Mark component as mounted
        setIsMounted(true);

        window.addEventListener('scroll', changeNavbar);

        return () => {
            window.removeEventListener('scroll', changeNavbar);
        };
    }, []);

    const { secondary, message } = props;

    let mainText = useColorModeValue('navy.700', 'white');
    let navbarPosition = 'fixed';
    let navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');
    let navbarShadow = 'none';
    let navbarBorder = 'transparent';
    let secondaryMargin = '0px';
    let paddingX = '15px';
    let gap = '0px';

    const changeNavbar = () => {
        if (window.scrollY > 1) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    return (
        <Box
            position={navbarPosition}
            boxShadow={navbarShadow}
            bg={navbarBg}
            borderColor={navbarBorder}
            alignItems={{ xl: 'center' }}
            display={secondary ? 'block' : 'flex'}
            minH='75px'
            justifyContent={{ xl: 'center' }}
            mx='auto'
            mt={secondaryMargin}
            pb='8px'
            right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
            px={{
                sm: paddingX,
                md: '10px'
            }}
            pt='8px'
            top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
            w={{
                base: 'calc(100vw - 6%)',
                md: 'calc(100vw - 8%)',
                lg: 'calc(100vw - 6%)',
                xl: 'calc(100vw - 350px)',
                '2xl': 'calc(100vw - 365px)'
            }}>
            <Flex
                w='100%'
                flexDirection={{
                    sm: 'column',
                    md: 'row'
                }}
                alignItems={{ xl: 'center' }}
                mb={gap}
                justifyContent={{ xl: 'flex-start' }}>
                <Box mb={{ sm: '8px', md: '0px' }}>
                </Box>
                <Box w={{ sm: '100%', md: 'unset' }}>
                    <Text 
                        fontSize='2xl' 
                        fontWeight='bold' 
                        color={mainText} 
                        textAlign='left'>
                        {displayRouteName}
                    </Text>
                </Box>
            </Flex>
            {secondary ? (
                <Text color='white'>{message}</Text>
            ) : null}
        </Box>
    );
}

AdminNavbar.propTypes = {
    brandText: PropTypes.string,
    variant: PropTypes.string,
    secondary: PropTypes.bool,
    fixed: PropTypes.bool,
    onOpen: PropTypes.func
};
