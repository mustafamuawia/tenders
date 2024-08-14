import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
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
  const [imagePreview, setImagePreview] = useState(localStorage.getItem('profileImage') || 'http://bootdey.com/img/Content/avatar/avatar1.png');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
          const fullImageUrl = response.data.image_url.replace(/\\/, ''); // Correctly format URL
          setImagePreview(fullImageUrl);
          localStorage.setItem('profileImage', fullImageUrl); // Save to local storage
        }
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, []);

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
            const fullImageUrl = response.data.image_url.replace(/\\/, ''); // Correctly format URL
            
            // Update both local storage and state to ensure persistence
            localStorage.setItem('profileImage', fullImageUrl);
            setImagePreview(fullImageUrl);

            // Trigger a global event that SidebarBrand can listen to
            const event = new Event('profileImageUpdated');
            window.dispatchEvent(event);
          } else {
            console.error('Image upload failed');
          }
        })
        .catch(error => {
          console.error('Error uploading image:', error);
        });
    }
  };

  const handlePasswordConfirmationChange = (e) => {
    setPasswordConfirmation(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (profile.password !== passwordConfirmation) {
      console.error('Password and confirmation do not match.');
      return;
    }

    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (profile.password) {
      formData.append('password', profile.password);
    }

    axios.put(`${process.env.REACT_APP_API_URL}/profile`, formData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Profile updated successfully.');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  // Check if there's an image in local storage on initial load
  useEffect(() => {
    const storedImage = localStorage.getItem('profileImage');
    if (storedImage) {
      setImagePreview(storedImage);
    }
  }, []);

  return (
    <Container mt={10}>
      <Box p={5} borderWidth="1px" borderRadius="lg" shadow="md" position="relative">
        <Box position="relative" textAlign="center">
          <Box position="relative" display="inline-block">
            <Avatar size="2xl" src={imagePreview} />
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
