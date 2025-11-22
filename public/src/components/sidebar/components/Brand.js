import React, { useEffect, useState } from "react";
import axios from "axios";
import { Flex, useColorModeValue, Image, Text } from "@chakra-ui/react";
import { HSeparator } from "components/separator/Separator";
import placeholderImage from "assets/img/avatars/505-5058560_person-placeholder-image-free-hd-png-download.png"; 

export function SidebarBrand() {
  const logoColor = useColorModeValue("navy.700", "white");

  // Use the imported image as the default avatar
  const defaultUserAvatar = placeholderImage;

  const [user, setUser] = useState({
    profileImage: localStorage.getItem('profileImage') || defaultUserAvatar,
    name: "Loading..."
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
          const userData = response.data;
          const imageUrl = userData.profileImage ? `${process.env.REACT_APP_API_URL}/storage/${userData.profileImage}` : defaultUserAvatar;
          
          // Update state and local storage
          setUser({
            profileImage: imageUrl,
            name: userData.name || "User"
          });
          localStorage.setItem('profileImage', imageUrl);
        } else {
          setUser({
            profileImage: defaultUserAvatar,
            name: "No user ID found"
          });
        }
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
        setUser({
          profileImage: defaultUserAvatar,
          name: "User not found"
        });
      }
    };

    // Initial fetch
    fetchUserData();

    // Listen for profile image updates
    const handleProfileImageUpdate = () => {
      const updatedImage = localStorage.getItem('profileImage');
      setUser(prevUser => ({
        ...prevUser,
        profileImage: updatedImage || defaultUserAvatar
      }));
    };

    window.addEventListener('profileImageUpdated', handleProfileImageUpdate);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('profileImageUpdated', handleProfileImageUpdate);
    };
  }, []);

  return (
    <Flex align="center" direction="column">
      <Image
        src={user.profileImage || defaultUserAvatar}
        alt="Profile Image"
        borderRadius="full"
        boxSize="100px"
        mb={4}
      />
      <Text fontSize="xl" fontWeight="bold" color={logoColor}>
        {user.name}
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
