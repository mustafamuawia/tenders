import React, { useEffect, useState } from "react";
import axios from "axios";
// Chakra imports
import { Flex, useColorModeValue, Image, Text } from "@chakra-ui/react";
// Import the default image in case user profile image is not available
import defaultUserAvatar from "assets/img/avatars/avatar1.png";
// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  const logoColor = useColorModeValue("navy.700", "white");

  const [user, setUser] = useState({
    profileImage: defaultUserAvatar, // Default profile image
    name: "Loading..." // Default name while loading
  });

  useEffect(() => {
    // Get the user ID from local storage
    const userId = localStorage.getItem('userId');

    if (userId) {
      axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`)
        .then(response => {
          const userData = response.data;
          setUser({
            profileImage: userData.profileImage || defaultUserAvatar,
            name: userData.name
          });
        })
        .catch(error => {
          console.error("There was an error fetching the user data!", error);
          setUser({
            profileImage: defaultUserAvatar,
            name: "User not found"
          });
        });
    } else {
      setUser({
        profileImage: defaultUserAvatar,
        name: "No user ID found"
      });
    }
  }, []);

  return (
    <Flex align="center" direction="column">
      <Image
        borderRadius="full"
        boxSize="70px"
        src={user.profileImage}
        alt={user.name}
        mb="12px"
      />
      <Text color={logoColor} fontWeight="bold" mb="12px">
        {user.name}
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
