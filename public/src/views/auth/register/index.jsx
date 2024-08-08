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

  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailConfirm, setEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setError(''); // Reset error message
    if (email !== emailConfirm) {
      setError('Emails do not match');
      return;
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/create`, {
        name: contactName,
        email,
        password,
        password_confirmation: passwordConfirm,
        CompanyName: companyName,
        CompanyEmail: companyEmail,
        Phone: companyPhone,
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
          mt={4}
          maxH="80vh"
          overflowY="auto" // Ensure scrollability of the card content
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
          <Box>
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
                Contact Name
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
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
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
                Company Email
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="company@mail.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                color={inputTextColor}
              />
              <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
                Company Phone
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="text"
                placeholder="(123) 456-7890"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
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
                placeholder="mail@company.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color={inputTextColor}
              />
              <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
                Confirm Email
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                type="email"
                placeholder="Confirm Email"
                mb="24px"
                fontWeight="500"
                size="lg"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
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
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
          </Box>
        </Flex>
        <Box as="footer" textAlign="center" mt={8}>
        </Box>
      </Flex>
    </DefaultAuth>
  );
}

export default Register;
