import React, { useEffect, useState } from "react";
import axios from "axios";
// Chakra imports
import { Flex, useColorModeValue, Image, Text } from "@chakra-ui/react";



// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  const logoColor = useColorModeValue("navy.700", "white");
  // Default image URL
const defaultUserAvatar = "http://bootdey.com/img/Content/avatar/avatar1.png";

  const [user, setUser] = useState({
    profileImage: defaultUserAvatar, // Default profile image
    name: "Loading..." // Default name while loading
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the user ID from local storage
        const userId = localStorage.getItem('userId');

        if (userId) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}`);
          const userData = response.data;
          // Use the profile image or fallback to default
          const imageUrl = userData.profileImage ? `${process.env.REACT_APP_API_URL}/storage/${userData.profileImage}` : defaultUserAvatar;
          setUser({
            profileImage: imageUrl,
            name: userData.name || "User"
          });
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

    fetchUserData();
  }, []);

  return (
    <Flex align="center" direction="column">
      <Image
        borderRadius="full"
        boxSize="70px"
        src={user.profileImage} // Use the dynamically updated profile image
        alt={user.name}
        mb="12px"
        fallbackSrc={defaultUserAvatar} // Fallback image
      />
      <Text color={logoColor} fontWeight="bold" mb="12px">
        {user.name}
      </Text>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
