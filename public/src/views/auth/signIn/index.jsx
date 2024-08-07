import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Set up Axios defaults and interceptors
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Retrieve and set the token if available
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post('/refresh-token', {}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const { access_token } = response.data;
        localStorage.setItem('token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return axios(originalRequest);
      } catch (err) {
        localStorage.removeItem('token');
        window.location.href = '/auth/sign-in'; // Redirect to sign-in page
      }
    }

    return Promise.reject(error);
  }
);

function SignIn() {
  const navigate = useHistory();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const textColorBrand = useColorModeValue('brand.500', 'white');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleClick = () => setShow(!show);

  const handleLogin = async () => {
    try {
      const response = await axios.post('/login', {
        email,
        password,
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('userId', response.data.user.id);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
        navigate.push('/admin/default'); // Redirect to the dashboard
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Invalid credentials');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <DefaultAuth>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        p={5}
        sx={{
          '& > *': {
            zIndex: '1 !important',
          },
        }}
      >
        <Flex
          direction="column"
          w={{ base: '100%', md: '420px' }}
          p={8}
          background={inputBgColor}
          borderRadius="15px"
          boxShadow="lg"
          mb={8} 
        >
          <Box mb="auto">
            <Heading color={textColor} fontSize="36px" mb="10px">
              Sign In
            </Heading>
            <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
              Enter your email and password to sign in!
            </Text>
          </Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Email
              <Text as="span" color={textColorBrand}> *</Text>
            </FormLabel>
            <Input
              isRequired
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="mail@simmmple.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBgColor}
              color={inputTextColor}
              _placeholder={{ color: inputTextColor }}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Password
              <Text as="span" color={textColorBrand}> *</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                isRequired
                fontSize="sm"
                placeholder="At least 8 characters"
                mb="24px"
                size="lg"
                type={show ? 'text' : 'password'}
                variant="auth"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg={inputBgColor}
                color={inputTextColor}
                _placeholder={{ color: inputTextColor }}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: 'pointer' }}
                  as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                  onClick={handleClick}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox id="remember-login" colorScheme="brandScheme" me="10px" />
                <FormLabel htmlFor="remember-login" mb="0" fontWeight="normal" color={textColor} fontSize="sm" textAlign="left">
                  Remember me
                </FormLabel>
              </FormControl>
              <NavLink to="/auth/forgot-password">
                <Text color={textColorBrand} fontSize="sm" w="124px" fontWeight="500">
                  Forgot password?
                </Text>
              </NavLink>
            </Flex>
            {error && (
              <Text color="red.500" mb="24px">
                {error}
              </Text>
            )}
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleLogin}>
              Sign In
            </Button>
            <Flex justifyContent="center" mt="4">
              <Text color={textColor} fontSize="sm">
                Don't have an account?{' '}
                <NavLink to="/auth/register">
                  <Text as="span" color={textColorBrand} fontWeight="500">
                    Create an account
                  </Text>
                </NavLink>
              </Text>
            </Flex>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;
