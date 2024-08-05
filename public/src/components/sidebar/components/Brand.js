import React from "react";
// Chakra imports
import { Flex, useColorModeValue, Image, Text } from "@chakra-ui/react";
// Import the image
import userAvatar from "assets/img/avatars/avatar1.png";
// Custom components
import { HSeparator } from "components/separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  const user = {
    profileImage: userAvatar, // User's profile image URL
    name: "John Doe" // User's name
  };

  return (
    <Flex align='center' direction='column'>
      <Image
        borderRadius='full'
        boxSize='70px'
        src={user.profileImage} // Use the imported image
        alt={user.name}
        mb='12px'
      />
      <Text color={logoColor} fontWeight='bold' mb='32px'>
        {user.name} 
      </Text>
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
