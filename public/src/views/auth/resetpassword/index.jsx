import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Box, Button, Flex, FormControl, FormLabel, Heading, Input, Text, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import DefaultAuth from 'layouts/auth/Default';

function ResetPassword() {
  const navigate = useHistory();
  const location = useLocation();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = useColorModeValue('gray.400', 'gray.500');
  const inputBgColor = useColorModeValue('white', 'gray.700');
  const inputTextColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.700', 'gray.200');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      setMessage(response.data.message);
      if (response.data.message === 'Password reset successful') {
        navigate.push('/auth/sign-in');
      }
    } catch (error) {
      setMessage('Something went wrong, please try again');
    }
  };

  return (
    <DefaultAuth>
      <Flex direction="column" alignItems="center" justifyContent="center" minH="100vh">
        <Flex direction="column" w={{ base: '100%', md: '420px' }} p={8} background={inputBgColor} borderRadius="15px" boxShadow="lg">
          <Heading color={textColor} fontSize="36px" mb="10px">
            إعادة تعيين كلمة المرور
          </Heading>
          <Text mb="36px" color={textColorSecondary} fontWeight="400" fontSize="md">
            أدخل كلمة المرور الجديدة.
          </Text>
          <FormControl>
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="right">
              كلمة المرور
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="password"
              placeholder="8 أحرف على الأقل"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg={inputBgColor}
              color={inputTextColor}
            />
            <FormLabel fontSize="sm" fontWeight="500" color={labelColor} mb="8px" textAlign="right">
              تأكيد كلمة المرور
            </FormLabel>
            <Input
              isRequired={true}
              variant="auth"
              fontSize="sm"
              type="password"
              placeholder="8 أحرف على الأقل"
              mb="24px"
              fontWeight="500"
              size="lg"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              bg={inputBgColor}
              color={inputTextColor}
            />
            {message && (
              <Text color={message.includes('successful') ? 'green.500' : 'red.500'} mb="24px">
                {message}
              </Text>
            )}
            <Button fontSize="sm" variant="brand" fontWeight="500" w="100%" h="50" mb="24px" onClick={handleResetPassword}>
              إعادة تعيين كلمة المرور
            </Button>
          </FormControl>
        </Flex>
      </Flex>
    </DefaultAuth>
  );
}

export default ResetPassword;
