import React, { useState } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useColorMode,
  IconButton,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import DefaultAuth from 'layouts/auth/Default';

function Register() {
  const navigate = useHistory();
  const { colorMode } = useColorMode();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [userClass, setUserClass] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError(''); // Reset error message
    try {
      // Debugging: Log the data being sent in the request
      console.log('Registration Data:', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        companyEmail,
        companyName,
        phone,
        userClass
      });

      const response = await axios.post(`http://localhost:8000/api/user/create`, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        companyEmail,
        companyName,
        phone,
        userClass
      });

      if (response.data.msg === 'Success') {
        navigate.push('/auth/sign-in');
      } else {
        setError('Registration failed. Please check your inputs.');
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <DefaultAuth>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        minH="100vh"
        p={4}
      >
        <Flex
          direction="column"
          w={{ base: '100%', md: '420px' }}
          p={8}
          background={useColorModeValue('white', 'gray.800')}
          borderRadius="15px"
          boxShadow="lg"
          textAlign="center"
          mb={8}
          mt={4} // Add top margin to ensure it's not too high
        >
          <Flex justify="space-between" w="100%" mb="16px">
            <NavLink to="/auth/sign-in">
              <IconButton
                icon={<ArrowBackIcon />}
                aria-label="Back to sign in"
                variant="ghost"
                colorScheme="gray"
              />
            </NavLink>
          </Flex>
          <Heading color={textColor} fontSize="36px" mb="10px">
            Create an Account
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Fill out the form below to create an account!
          </Text>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Name
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="text"
              placeholder="John Doe"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Email
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="mail@simmmple.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Password
            </FormLabel>
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="At least 8 characters"
              mb="24px"
              size="lg"
              type="password"
              variant="auth"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Confirm Password
            </FormLabel>
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="At least 8 characters"
              mb="24px"
              size="lg"
              type="password"
              variant="auth"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Company Email
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="email"
              placeholder="company@example.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Company Name
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="text"
              placeholder="Company Name"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Phone
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="text"
              placeholder="123456789"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Class
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="text"
              placeholder="Class"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
              color={inputTextColor}
            />
            {error && (
              <Text color="red.500" mb="24px">
                {error}
              </Text>
            )}
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleRegister}>
              Register
            </Button>
          </FormControl>
        </Flex>
        <Box as="footer" textAlign="center" mt={8}>
          <Text color={textColorSecondary} fontSize="sm">
            © {new Date().getFullYear()} Your Company. All Rights Reserved.
          </Text>
        </Box>
      </Flex>
    </DefaultAuth>
  );
}

export default Register;
