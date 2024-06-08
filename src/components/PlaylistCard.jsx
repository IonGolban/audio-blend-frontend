import React from 'react';
import { Box, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function PlaylistCard({ playlist }) {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    console.log("playlist", playlist);    
    return (
        <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={playlist.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            as={Link}
            to={`/playlists/${playlist.id}`}
        >
            <Image src={playlist.coverUrl} alt={playlist.title} />

            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="medium" noOfLines={1}>
                        {playlist.title}
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}