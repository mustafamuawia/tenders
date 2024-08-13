import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
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

function ResetPassword() {
  const location = useLocation();
  const history = useHistory();

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const handleResetPassword = async () => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!password || !passwordConfirm || password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/reset-password`, {
        token,
        email,
        password,
        password_confirmation: passwordConfirm,
      });
      setMessage('Password has been successfully reset.');
      setError('');
      setTimeout(() => history.push('/auth/sign-in'), 3000); // Redirect to sign-in after a short delay
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || 'Failed to reset password');
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
              Reset Password
            </Heading>
            <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
              Enter your new password below.
            </Text>
          </Box>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              New Password
              <Text as="span" color="red.500"> *</Text>
            </FormLabel>
            <Input
              isRequired
              variant="auth"
              fontSize="sm"
              type="password"
              placeholder="New password"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg={inputBgColor}
              color={inputTextColor}
              _placeholder={{ color: inputTextColor }}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="left">
              Confirm New Password
              <Text as="span" color="red.500"> *</Text>
            </FormLabel>
            <Input
              isRequired
              variant="auth"
              fontSize="sm"
              type="password"
              placeholder="Confirm new password"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleResetPassword}>
              Reset Password
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default ResetPassword;
