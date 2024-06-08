import React, { useState, useEffect } from 'react';
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Stack
} from '@chakra-ui/react';
import apiService from '../utils/ApiService';
import { BASE_URL } from '../utils/Constants';

const AddToPlaylistModal = ({ isOpen, onClose, songId }) => {
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");

    const handleCloseModal = () => {
        onClose();
    };

    useEffect(() => {
        async function fetchData() {
            const userPlaylists = await apiService('GET', `${BASE_URL}music-data/playlists/user`);
            setPlaylists(userPlaylists);
        }
        if (isOpen) {
            fetchData();
        }
    }, [isOpen]);

    const handlePlaylistSelect = (playlistId) => {
        setSelectedPlaylist(playlistId === selectedPlaylist ? "" : playlistId);
    };

    const handleAddToPlaylist = async () => {
        try {

            console.log("Adding to playlist", selectedPlaylist);
            const data = {
                songId: songId,
                playlistId: selectedPlaylist
            }
            const response = await apiService('POST', `${BASE_URL}music-data/playlist-songs`, data);
            console.log(response);
            handleCloseModal();

            // const response = await fetch(`${BASE_URL}music-data/playlists/${selectedPlaylist}/add-song`);
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <Modal isOpen={isOpen} onClose={handleCloseModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add to Playlist</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Select a Playlist</FormLabel>
                        <Stack spacing={2}>
                            {playlists.map((playlist) => (
                                <Button
                                    key={playlist.id}
                                    onClick={() => handlePlaylistSelect(playlist.id)}
                                    variant={selectedPlaylist === playlist.id ? 'solid' : 'outline'}
                                    colorScheme={'gray'}
                                    justifyContent='left'
                                >
                                    {playlist.title}
                                </Button>
                            ))}
                        </Stack>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={handleAddToPlaylist} isDisabled={!selectedPlaylist}>
                        Add
                    </Button>
                    <Button variant="ghost" ml={3} onClick={handleCloseModal}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddToPlaylistModal;
