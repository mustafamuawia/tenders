import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
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
} from '@chakra-ui/react';
import DefaultAuth from 'layouts/auth/Default';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password`, { email });
      setMessage('A password reset link has been sent to your email.');
      setError('');
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to send reset link');
      } else {
        setError('An unexpected error occurred');
      }
      setMessage('');
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
        >
          <Box mb="auto">
            <Heading color={textColor} fontSize="36px" mb="10px">
              Forgot Password
            </Heading>
            <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
              Enter your email to receive a password reset link.
            </Text>
          </Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Email
              <Text as="span" color="red.500"> *</Text>
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
            {message && (
              <Text color="green.500" mb="24px">
                {message}
              </Text>
            )}
            {error && (
              <Text color="red.500" mb="24px">
                {error}
              </Text>
            )}
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleForgotPassword}>
              Send Reset Link
            </Button>
            <Flex justifyContent="center" mt="4">
              <Text color={textColor} fontSize="sm">
                Remember your password?{' '}
                <NavLink to="/auth/sign-in">
                  <Text as="span" color="blue.500" fontWeight="500">
                    Sign In
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

export default ForgotPassword;
