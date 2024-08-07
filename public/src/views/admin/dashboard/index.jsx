import {
  useColorModeValue,
} from "@chakra-ui/react";



export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  
  // Return null instead of JSX
  return null;
}
