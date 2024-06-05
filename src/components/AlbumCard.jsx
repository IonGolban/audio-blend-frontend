import React from 'react';
import { Box, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

export default function AlbumCard({ album }) {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    console.log("album", album);    
    return (
        <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={album.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            as={Link}
            to={`/albums/${album.id}`}
        >
            <Image src={album.coverUrl} alt={album.title} />

            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="medium" noOfLines={1}>
                        {album.title}
                    </Text>
                    <Text as = {Link} to={`/artist/${album.artistId}`} fontSize="sm" color="gray.500" noOfLines={1}>
                        {album.artistName}
                    </Text>
                </VStack>
            </Box>
        </Box>
    );
}