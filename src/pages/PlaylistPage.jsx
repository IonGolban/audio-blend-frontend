import React, { useEffect, useState } from "react";
import { VStack, Flex, Text, Image, Box, Button, Spinner, IconButton } from "@chakra-ui/react";
import SongList from "../components/SongList";
import { useParams } from "react-router-dom";
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import apiService from "../utils/ApiService.js";
import { BASE_URL } from "../utils/Constants.js";
import AuthStore from "../stores/AuthStore.js";
import EditPlaylistModal from "../components/EditPlaylistModal.jsx";

export default function PlaylistPage({ children }) {
    const { playlistid } = useParams();
    const [playlist, setPlaylist] = useState(null);
    const [songs, setSongs] = useState([]);
    const [error, setError] = useState(null);
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [liked, setLiked] = useState(false);
    const [isUserPlaylist, setIsUserPlaylist] = useState(false);
    const userId = AuthStore.useState(s => s.id);
    const [userPlaylist, setUserPlaylist] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/playlists/${playlistid}`);
                if (isAuth) {
                    const likedPlaylist = await apiService('GET', `${BASE_URL}music-data/likes/playlist/check/${playlistid}`);
                    setLiked(likedPlaylist ? true : false);
                }
                const userPlaylistApi = await apiService('GET', `${BASE_URL}music-data/users/${response.userId}`);
                
                setPlaylist(response);
                setUserPlaylist(userPlaylistApi);
                setSongs(response.songs);
                if (userId === userPlaylistApi.id) {
                    setIsUserPlaylist(true);
                }
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, [playlistid, isAuth, userId]);

    const handleToggleLike = async (item) => {
        if (!isAuth) return;
        if (!liked) {
            await apiService("POST", `${BASE_URL}music-data/likes/add/playlist/${item.id}`);
            setLiked(true);
        } else {
            await apiService("DELETE", `${BASE_URL}music-data/likes/remove/playlist/${item.id}`);
            setLiked(false);
        }
    };

    const handleUpdatePlaylist = (updatedPlaylist) => {
        setPlaylist(updatedPlaylist);
    };

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

    return (
        <Flex p={10} justifyContent="center" flexDirection="column" alignItems="center" maxW="800px" mx="auto">
            <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }} mb={8}>
                <Image src={playlist.coverUrl} alt={playlist.title} borderRadius="full" boxSize="150px" mb={{ base: 4, md: 0 }} mr={{ md: 8 }} />
                <Box textAlign={{ base: "center", md: "left" }}>
                    <Text fontSize="4xl" fontWeight="bold" mb={2}>{playlist.title}</Text>
                    <Text fontSize="2xl" color="gray.600" mb={2}>{playlist.description}</Text>
                    <Text fontSize="sm" color="gray.600" mb={2}>Created by {userPlaylist.username}</Text>
                    {isAuth && <IconButton
                        icon={liked ? <FaHeart /> : <FaRegHeart />}
                        colorScheme={liked ? "red" : "gray"}
                        onClick={() => handleToggleLike(playlist)}
                        aria-label="Like"
                        variant="ghost"
                    />}
                    {isUserPlaylist && (
                        <Button onClick={() => setIsEditModalOpen(true)} mt={4}>
                            Edit Playlist
                        </Button>
                    )}
                </Box>
            </Flex>
            <SongList setItems={setSongs} items={songs} listId={playlist.id} type="playlist" isUserPlaylist={isUserPlaylist} />
            {isEditModalOpen && (
                <EditPlaylistModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    playlist={playlist}
                    onUpdate={handleUpdatePlaylist}
                />
            )}
        </Flex>
    );
}
