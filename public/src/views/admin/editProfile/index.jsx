import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, EditIcon } from "@chakra-ui/icons";

export function EditProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const userData = response.data;
          // const imageUrl = userData.profileImage ? `${process.env.REACT_APP_API_URL}/storage/${userData.profileImage}` : 'http://bootdey.com/img/Content/avatar/avatar1.png';
          // console.log(imageUrl);
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            currentPassword: "",
            newPassword: ""
          });
          // setImagePreview(imageUrl);
          // localStorage.setItem('profileImage', imageUrl);
        }
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
        setProfile({
          name: "Error loading",
          email: "Error loading",
          currentPassword: "",
          newPassword: ""
        });
        setImagePreview('http://bootdey.com/img/Content/avatar/avatar1.png');
      }
    };

    fetchUserData();
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
      setImagePreview(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append('image', file);

      axios.post(`${process.env.REACT_APP_API_URL}/user/profile-picture`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(response => {
          if (response.data.success) {
            const fullImageUrl = response.data.image_url.replace(/\\/, '');
            console.log(fullImageUrl);
            localStorage.setItem('profileImage', fullImageUrl);
            setImagePreview(fullImageUrl);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profile.newPassword !== passwordConfirmation) {
      console.error('New password and confirmation do not match.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('email', profile.email);
      if (profile.newPassword) {
        formData.append('newPassword', profile.newPassword);
        formData.append('passwordConfirmation', passwordConfirmation);
      }
      formData.append('currentPassword', profile.currentPassword);

      await axios.put(`${process.env.REACT_APP_API_URL}/user/${userId}/update`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data' // Ensure the correct content type is set
        }
      });

      console.log('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
    }
  };


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
          <FormControl id="currentPassword">
            <FormLabel>Current Password</FormLabel>
            <InputGroup>
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                name="currentPassword"
                value={profile.currentPassword}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  icon={showCurrentPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <FormControl id="newPassword">
            <FormLabel>New Password</FormLabel>
            <InputGroup>
              <Input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                value={profile.newPassword}
                onChange={handleChange}
              />
              <InputRightElement>
                <IconButton
                  icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowNewPassword(!showNewPassword)}
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
}

export default EditProfile;
