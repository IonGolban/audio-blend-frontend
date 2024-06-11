import React from 'react';
import { Box, Image, Text, VStack, Card, CardHeader, CardFooter, CardBody, Flex,useColorModeValue, } from '@chakra-ui/react';
import { msToHumanReadable } from '../utils/UtilsHelper.js';
import { addToQueue, playSong } from '../utils/AudioHelper.js';
import { PiQueue } from "react-icons/pi";
import { Link } from 'react-router-dom';

export default function UserCard ({ user }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={song.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            as='Link'
            to={`/users/${user.id}`}
            
        >
            <Image src={user.imgUrl} alt={user.userName} />

            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                        {user.userName}
                    </Text>
                </VStack>
            </Box>
        </Box>
  );

};
 
