import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  Avatar,
  InputGroup,
  InputRightElement,
  IconButton,
  Container,
  Text,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, EditIcon } from '@chakra-ui/icons';
import axios from 'axios';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // Fetch user profile data
    axios.get(`${process.env.REACT_APP_API_URL}/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setProfile(response.data);
        if (response.data.image_url) {
          setImagePreview(response.data.image_url); // Use the full URL directly
        }
      })
      .catch(error => {
        toast({
          title: 'Error fetching profile data.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Temporarily preview the new image
      setImagePreview(URL.createObjectURL(file));

      // Create FormData object for the file upload
      const formData = new FormData();
      formData.append('image', file);

      axios.post(`${process.env.REACT_APP_API_URL}/user/profile-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.data.success) {
            setImagePreview(response.data.image_url);
            toast({
              title: 'Image uploaded successfully.',
              status: 'success',
              duration: 5000,
              isClosable: true,
            });
          } else {
            toast({
              title: 'Image upload failed.',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .catch(error => {
          toast({
            title: 'Error uploading image.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };

  const handlePasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (profile.password !== passwordConfirmation) {
      toast({
        title: 'Password and confirmation do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (profile.password) {
      formData.append('password', profile.password);
    }

    axios.put(`${process.env.REACT_APP_API_URL}/api/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        toast({
          title: 'Profile updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      })
      .catch(error => {
        toast({
          title: 'Error updating profile.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      });
  };

  return (
    <Container mt={10}>
      <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md" position="relative">
        <Box position="relative" textAlign="center">
          <Box position="relative" display="inline-block">
            <Avatar size="2xl" src={imagePreview || 'http://bootdey.com/img/Content/avatar/avatar1.png'} />
            <Box
              position="absolute"
              top="0"
              left="0"
              width="100%"
              height="100%"
              bg="rgba(0, 0, 0, 0.5)"
              color="white"
              display="flex"
              justifyContent="center"
              alignItems="center"
              opacity="0"
              _hover={{ opacity: 1 }}
              cursor="pointer"
              onClick={() => document.getElementById('imageUpload').click()}
            >
              <EditIcon boxSize={6} />
              <Text ml={2}>Edit</Text>
            </Box>
          </Box>
          <Input
            type="file"
            accept="image/*"
            id="imageUpload"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </Box>
        <Stack spacing={4} mt={8}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={profile.password}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="passwordConfirmation">
            <FormLabel>Password Confirmation</FormLabel>
            <InputGroup>
              <Input
                type={showPasswordConfirmation ? 'text' : 'password'}
                name="passwordConfirmation"
                value={passwordConfirmation}
                onChange={handlePasswordConfirmationChange}
              />
              <InputRightElement>
                <IconButton
                  icon={showPasswordConfirmation ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Button colorScheme="blue" onClick={handleSubmit}>Save Changes</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditProfile;
