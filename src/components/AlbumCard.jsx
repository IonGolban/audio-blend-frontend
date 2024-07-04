import React, { useState, useEffect, } from 'react';
import { Box, Image, Text, VStack, useColorModeValue, IconButton } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import apiService from '../utils/ApiService';
import { BASE_URL } from '../utils/Constants';

export default function AlbumCard({ album }) {
    const navigate = useNavigate();
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const [isUserAlbum, setIsUserAlbum] = useState(false);

    useEffect(() => {
        const checkIfUserAlbum = async () => {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/albums/${album.id}/isUserAlbum`);
                if (response === true) { 
                    setIsUserAlbum(true);
                }
            } catch (error) {
                console.error('Failed to check if album belongs to user', error);
            }
        };

        checkIfUserAlbum();
    }, [album.id]);

    const removeAlbum = async () => {
        try {
            await apiService('DELETE', `${BASE_URL}music-data/albums/${album.id}`);
            navigate('/profile');
        } catch (error) {
            console.error('Failed to remove album', error);
        }
    };

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
            position="relative"
            as = {Link}
            to={`/albums/${album.id}`}
        >
            <Image src={album.coverUrl} alt={album.title} />
            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="medium" noOfLines={1}>
                        {album.title}
                    </Text>
                    <Text as={Link} to={`/artist/${album.artistId}`} fontSize="sm" color="gray.500" noOfLines={1}>
                        {album.artistName}
                    </Text>
                </VStack>
            </Box>
            {isUserAlbum && (
                <IconButton
                    icon={<FaTrash />}
                    colorScheme="red"
                    size="sm"
                    position="absolute"
                    top="2"
                    right="2"
                    onClick={(e) => {
                        e.preventDefault();
                        removeAlbum();
                    }}
                    aria-label="Remove Album"
                />
            )}
        </Box>
    );
}
