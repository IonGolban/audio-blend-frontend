import React, { useState } from 'react';
import { InputGroup,Icon, InputLeftElement,Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Textarea, Switch, Image, VStack, Box } from "@chakra-ui/react";
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import { FiFile } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';

export default function EditPlaylistModal({ isOpen, onClose, playlist, onUpdate }) {
    const [title, setTitle] = useState(playlist.title);
    const [description, setDescription] = useState(playlist.description);
    const [isPublic, setIsPublic] = useState(playlist.isPublic);
    const navigate = useNavigate();
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    const handleSave = async () => {
        const photo = fileInputRef.current?.files[0];

        const formData = new FormData();
        formData.append('Id', playlist.id);
        formData.append('Name', title);
        formData.append('Description', description);
        formData.append('IsPublic', isPublic);
        formData.append('Image', photo);
        
        console.log("Updating playlist", formData);
        // const response = await apiService("PUT", `${BASE_URL}music-data/playlists/update`, formData);

        try {
            const response = await fetch('https://localhost:7195/api/v1/music-data/playlists/update', {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Playlist created successfully:', data);
                onUpdate(data);
                onClose();

            } else {
                console.error('Failed to create playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating playlist:', error);
        }


    };
    const handleFileChange = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    const deletePlaylist = async () => {
        try {
            const response = await fetch(`https://localhost:7195/api/v1/music-data/playlists/${playlist.id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Playlist deleted:', data);
                navigate(-1);
            } else {
                console.error('Failed to delete playlist:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting playlist:', error);
        }
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Playlist</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4} align="stretch">
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input variant={'flushed'} focusBorderColor='gray.500' value={title} onChange={(e) => setTitle(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea variant={'flushed'} focusBorderColor='gray.500' value={description} onChange={(e) => setDescription(e.target.value)} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Cover Photo</FormLabel>
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
                        <FormControl display="flex" alignItems="center">
                            <FormLabel mb="0">Public</FormLabel>
                            <Switch isChecked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button variant={'ghost'} mr={3} onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant={'ghost'} color = {'red'} onClick={()=>deletePlaylist()}>Delete</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
