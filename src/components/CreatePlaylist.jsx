import {
    InputGroup,
    InputLeftElement,
    Icon,
    Box,
    Modal,
    ModalBody,
    ModalHeader,
    FormControl,
    ModalContent,
    FormLabel,
    ModalFooter,
    ModalCloseButton,
    ModalOverlay,
    Flex,
    Heading,
    Input,
    Button,
} from '@chakra-ui/react';
import { useNavigate, Link } from "react-router-dom";

import { useState, useRef } from 'react';
import { FiFile } from 'react-icons/fi';
import { Switch } from '@chakra-ui/react';
import { set } from 'date-fns';
import apiService from '../utils/ApiService';

const CreatePlaylist = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const closePlaylistModal = () => {
        setFileName('');

        onClose();
    };

    const handleFileChange = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    const handleCreatePlaylist = async () => {
        console.log("Create playlist");
        const name = document.getElementById("playlist-name").value;
        const description = document.getElementById("playlist-description").value;
        const isPublic = document.getElementById("playlist-public").checked;
        const photo = fileInputRef.current.files[0];

        console.log(name, description, isPublic, photo);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('isPublic', isPublic);
        formData.append('image', photo);

        try {
            const response = await fetch('https://localhost:7195/api/v1/music-data/playlists/add', {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Playlist created successfully:', data);
                navigate(`/playlists/${data.id}`);
            } else {
                console.error('Failed to create playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }

        closePlaylistModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Playlist</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <Input id="playlist-name" placeholder="Enter playlist name" variant={'flushed'} focusBorderColor='gray.500' />
                    </FormControl>
                    <FormControl mt={4}>
                        <Input id="playlist-description" placeholder="Enter description" variant={'flushed'} focusBorderColor='gray.500' />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Is Public </FormLabel>
                        <Switch id="playlist-public" size="md" />
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Photo</FormLabel>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FiFile} />
                            </InputLeftElement>
                            <Input
                                placeholder="Select a file..."
                                value={fileName}
                                readOnly
                                
                                onClick={() => fileInputRef.current.click()}
                            />
                            <input
                                id="playlist-photo"
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files)}
                                style={{ display: 'none' }}
                                on
                            />
                        </InputGroup>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" variant="ghost" mr={3} onClick={handleCreatePlaylist}>
                        Create
                    </Button>
                    <Button variant="ghost" onClick={closePlaylistModal}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreatePlaylist;
