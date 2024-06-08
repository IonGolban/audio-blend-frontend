import { VStack, Flex, Text, Image, Box, Button, Spinner,IconButton } from "@chakra-ui/react";
import SongList from "../components/SongList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Constants.js";
import apiService from "../utils/ApiService.js";
import { format, parseISO } from 'date-fns';
import { FaList, FaHeart, FaRegHeart } from 'react-icons/fa';

import AuthStore from "../stores/AuthStore.js";
export default function PlaylistPage({ children }) {
    const { playlistid} = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [error, setError] = useState(null);
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [liked, setLiked] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/playlists/${playlistid}`);
                if (isAuth) {
                    const likedPlaylist = await apiService('GET', `${BASE_URL}music-data/likes/playlist/check/${playlistid}`);
                    setLiked(likedPlaylist?true:false);
                }
                setPlaylist(response);
                console.log(response);
            } catch (error) {
                console.error("Error fetching playlists:", error);
                setError(error);
            }
        };
        fetchData();
    }, [playlistid]);

    if (error) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Text fontSize="2xl" color="red.500">Error: {error.message}</Text>
            </Flex>
        );
    }

    if (!playlist) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }
    const handleToggleLike = async (item) => {
        if(!isAuth) return;
        if (!liked) {
            const response = await apiService("POST", `${BASE_URL}music-data/likes/add/playlist/${item.id}`);
            console.log(response);
            setLiked(true);
        } else {
            const response = await apiService("DELETE", `${BASE_URL}music-data/likes/remove/playlist/${item.id}`);
            console.log(response);
            setLiked(false);
        }
    }
    return (
        <Flex p={10} justifyContent="center" flexDirection="column" alignItems="center" maxW="800px" mx="auto">
            <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }} mb={8}>
                <Image src={playlist.coverUrl} alt={playlist.title} borderRadius="full" boxSize="150px" mb={{ base: 4, md: 0 }} mr={{ md: 8 }} />
                <Box textAlign={{ base: "center", md: "left" }}>
                    <Text fontSize="4xl" fontWeight="bold" mb={2}>{playlist.title}</Text>
                    <Text fontSize="2xl" color="gray.600" mb={2}>{playlist.artistName}</Text>
                    {isAuth && <IconButton
                        icon={liked ? <FaHeart /> : <FaRegHeart />}
                        colorScheme={liked ? "red" : "gray"}
                        onClick={() => handleToggleLike(playlist)}
                        aria-label="Like"
                        variant="ghost"

                    />}
                </Box>
            </Flex>
            <SongList items={playlist.playlistSongs.map(ps => ps.song)} listId = {playlist.id} type = "playlist" />
        </Flex>
    );
}
