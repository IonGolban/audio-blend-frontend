import React from 'react';
import { Box, Image, Text, VStack, useColorModeValue, Link } from '@chakra-ui/react';

export default function UserCard({ user }) {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");

    console.log("usercard", user);

    return (
        <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={user.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            as={Link}
            to={`/users/${user.id}`}
        >
            <Image 
                src={user.imgUrl} 
                alt={user.username} 
                boxSize="150px" 
                objectFit="cover" 
            />

            <Box p="2">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                        {user.username}
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
};
