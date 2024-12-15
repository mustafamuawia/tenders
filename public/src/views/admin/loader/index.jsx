import React from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';

const Loader = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      flexDirection="column"
      bg="gray.100"
    >
      <Spinner 
        size="xl" 
        thickness="4px" 
        speed="0.65s" 
        color="blue.500" 
        emptyColor="gray.300" 
      />
      <Text mt={4} fontSize="lg" color="gray.600">
        please wait...
      </Text>
    </Box>
  );
};

export default Loader;
