import React, { useState } from 'react';
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
import { useEffect } from 'react';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';

export default function SongList({ items, listId, type  }) {
    const [likedSongs, setLikedSongs] = useState([]);
    // console.log("listId", listId);
    useEffect(() => {
        const fetchLikedSongs = async () => {
            url = type === 'album' ? `${BASE_URL}music-data/likes/songs/album/${listId}` : `${BASE_URL}music-data/likes/songs/playlist/${listId}`;
            const likedSongs = await apiService('GET', url);
            
            // setLikedSongs(likedSongs);
            setLikedSongs(likedSongs.map((item) => item.songId));
            console.log(likedSongs);
            console.log(items);
        }
        fetchLikedSongs();
    }, []);



    const handleClickSong = (item) => {
        console.log("aud_url", item.audioUrl);
        MusicStore.update(s => {
            s.currentSong = item.audioUrl;
            s.isPlaying = true;
            s.songInfo = item;
        });
    }

    const handleAddToQueue = (item) => {
        console.log("add to queue", item);
        MusicStore.update(s => {
            s.queue.push(item);
        });
    };
    const  handleToggleLike = async (item) => {
        console.log("likedSongs", likedSongs);
        if (!likedSongs.includes(item.id)) {
            const response = await apiService("POST", `${BASE_URL}music-data/likes/add/song/${item.id}`);
            console.log(response);
        
        }else{
            const response = await apiService("DELETE", `${BASE_URL}music-data/likes/remove/song/${item.id}`);
            console.log(response);
        }

        setLikedSongs((prevLikedSongs) => {
            if (prevLikedSongs.includes(item.id)) {
                return prevLikedSongs.filter((id) => id !== item.id);
            } else {
                return [...prevLikedSongs, item.id];
            }
        });
    };

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
                        <Th>Popularity</Th>
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
                            <Td>{item.genres}</Td>
                            <Td>{item.popularity ? item.popularity : "0"}</Td>
                            <Td>
                                <Menu>
                                    <MenuButton as={Button} rightIcon={<FaList />} variant = 'ghost' />
                                    <MenuList >
                                        <MenuItem onClick={() => handleAddToQueue(item)}>Add to Queue</MenuItem>
                                        <MenuItem>Add to Playlist</MenuItem>
                                        <MenuItem>Share</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>

                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}
