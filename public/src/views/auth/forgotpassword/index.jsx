import React, { useState } from 'react';
import { Button, Flex, FormControl, FormLabel, Heading, Input, Text, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import DefaultAuth from 'layouts/auth/Default';

function ForgotPassword() {
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/forgot-password`, {
        email,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Something went wrong, please try again');
    }
  };

  return (
    <DefaultAuth>
      <Flex direction="column" alignItems="center" justifyContent="center" minH="100vh">
        <Flex direction="column" w={{ base: '100%', md: '420px' }} p={8} background={inputBgColor} borderRadius="15px" boxShadow="lg">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Forgot Password
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
            Enter your email to receive a password reset link.
          </Text>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px">
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
              bg={inputBgColor}
              color={inputTextColor}
            />
            {message && (
              <Text color={message.includes('sent') ? 'green.500' : 'red.500'} mb="24px">
                {message}
              </Text>
            )}
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleForgotPassword}>
              Send
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default ForgotPassword;
