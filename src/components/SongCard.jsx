import React from 'react';
import { HStack, Box, Image, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { msToHumanReadable } from '../utils/UtilsHelper.js';
import { addToQueue, playSong } from '../utils/AudioHelper.js';
import { PiQueue } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { FaList, FaHeart, FaRegHeart } from 'react-icons/fa';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';
import { IconButton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function SongCard({ song }) {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [likedSongs, setLikedSongs] = useState([]);
    const currentUserId = AuthStore.useState(s => s.id);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchLikeSong = async () => {
            let url = `${BASE_URL}music-data/likes/song/check/${song.id}`;
            const likedSongs = await apiService('GET', url);
            if (likedSongs) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        }
        fetchLikeSong();
    }, [song.id]);


    const handleToggleLike = async (item) => {
        if (!isAuth) return;
        if (!isLiked) {
            await apiService("POST", `${BASE_URL}music-data/likes/add/song/${item.id}`);
        } else {
            await apiService("DELETE", `${BASE_URL}music-data/likes/remove/song/${item.id}`);
        }
        setIsLiked(!isLiked);

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
            key={song.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            onClick={() => playSong(song)}
        >
            <Image
                src={song.coverUrl}
                alt={song.title}
                minHeight={150}
                maxHeight={200}
                objectFit="cover"
            />

            <Box p="4">
                <VStack spacing={1} align="start">


                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                        {song.title}
                    </Text>

                    <Text as={Link} to={`/artist/${song.artistId}`} fontSize="sm" color="gray.500" noOfLines={1}>
                        {song.artistName}
                    </Text>
                    <HStack>
                        <IconButton
                            icon={isLiked ? <FaHeart /> : <FaRegHeart />}
                            colorScheme={isLiked ? "red" : "gray"}
                            onClick={(e) => { e.stopPropagation(); handleToggleLike(song); }}
                            aria-label="Like"
                            variant="ghost"
                            zIndex={10}
                        />
                        <PiQueue onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(song);
                        }} />
                    </HStack>

                </VStack>
            </Box>
        </Box>
    );

};