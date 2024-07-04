import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    IconButton
} from "@chakra-ui/react";
import { FaList, FaHeart, FaRegHeart } from 'react-icons/fa';
import { msToHumanReadable } from '../utils/UtilsHelper.js';
import MusicStore from '../stores/MusicStore.js';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';
import AddToPlaylistModal from './AddToPlaylistModal.jsx';

export default function SongList({ setItems, items, listId, type, isUserPlaylist }) {
    const [likedSongs, setLikedSongs] = useState([]);
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [isAddToPlaylistOpen, setIsAddToPlaylistOpen] = useState(false);
    const [selectedSongId, setSelectedSongId] = useState(null);

    useEffect(() => {
        const fetchLikedSongs = async () => {
            let url = type === 'album' ? `${BASE_URL}music-data/likes/songs/album/${listId}` : `${BASE_URL}music-data/likes/songs/playlist/${listId}`;
            const likedSongs = await apiService('GET', url);
            setLikedSongs(likedSongs.map((item) => item.songId));
        }
        fetchLikedSongs();
    }, [listId, type]);

    const handleClickSong = (item) => {
        MusicStore.update(s => {
            s.currentSong = item.audioUrl;
            s.isPlaying = true;
            s.songInfo = item;
        });
    }

    const handleAddToQueue = (item) => {
        MusicStore.update(s => {
            s.queue.push(item);
        });
    };

    const handleToggleLike = async (item) => {
        if (!isAuth) return;
        if (!likedSongs.includes(item.id)) {
            await apiService("POST", `${BASE_URL}music-data/likes/add/song/${item.id}`);
        } else {
            await apiService("DELETE", `${BASE_URL}music-data/likes/remove/song/${item.id}`);
        }
        setLikedSongs((prevLikedSongs) => {
            if (prevLikedSongs.includes(item.id)) {
                return prevLikedSongs.filter((id) => id !== item.id);
            } else {
                return [...prevLikedSongs, item.id];
            }
        });
    };

    const handleAddToPlaylistClick = (songId) => {
        setSelectedSongId(songId);
        setIsAddToPlaylistOpen(true);
    }

    const handleRemoveFromPlaylist = async (songId) => {
        const body = {
            songId: songId,
            playlistId: listId
        }
        const response = await apiService("DELETE", `${BASE_URL}music-data/playlist-songs`, body);
        if (response) {
            const newItems = items.filter(item => item.id !== songId);
            setItems(newItems);
        } else {
            console.log("Failed to remove song from playlist");
        }
    }

    return (
        <Box overflowX="auto" padding={4} w='100vh'>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Like</Th>
                        <Th>Title</Th>
                        <Th>Duration</Th>
                        <Th>Artist</Th>
                        <Th>Genre</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item) => (
                        <Tr
                            key={item.id}
                            _hover={{ backgroundColor: "gray.100", transform: "scale(1.01)", transition: "all 0.1s ease" }}
                            onDoubleClick={() => handleClickSong(item)}
                        >
                            <Td>
                                <IconButton
                                    icon={likedSongs.includes(item.id) ? <FaHeart /> : <FaRegHeart />}
                                    colorScheme={likedSongs.includes(item.id) ? "red" : "gray"}
                                    onClick={() => handleToggleLike(item)}
                                    aria-label="Like"
                                    variant="ghost"
                                />
                            </Td>
                            <Td>
                                <Box fontWeight="bold" fontSize="13">{item.title}</Box>
                            </Td>
                            <Td>{msToHumanReadable(item.duration)}</Td>
                            <Td>{item.artistName}</Td>
                            <Td>{item.genres.map(g => g.name).join(", ")}</Td>
                            <Td>
                                <Menu>
                                    <MenuButton as={Button} rightIcon={<FaList />} />
                                    <MenuList minW="200px" maxH="200px" zIndex={100}>
                                        <MenuItem onClick={() => handleAddToQueue(item)}>Add to Queue</MenuItem>
                                        <MenuItem onClick={() => handleAddToPlaylistClick(item.id)}>Add to Playlist</MenuItem>
                                        {isUserPlaylist && <MenuItem onClick={() => handleRemoveFromPlaylist(item.id)}>Delete</MenuItem>}
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {selectedSongId && (
                <AddToPlaylistModal isOpen={isAddToPlaylistOpen} onClose={() => setIsAddToPlaylistOpen(false)} songId={selectedSongId} />
            )}
        </Box>
    );
}
