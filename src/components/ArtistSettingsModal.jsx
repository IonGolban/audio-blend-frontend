import React, { useState, useEffect, useRef } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Text, Heading, Avatar, FormControl, FormLabel, Input, Button, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { FiFile } from 'react-icons/fi';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';

const ArtistSettingsModal = ({ isOpen, onClose }) => {
    const [artist, setArtist] = useState(null);
    const [isEditing, setIsEditing] = useState({
        name: false,
        image: false,
    });
    const [formData, setFormData] = useState({
        name: '',
        imgUrl: '',
    });
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const isAuth = AuthStore.useState(s => s.isAuth);

    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistData = await apiService('GET', `${BASE_URL}music-data/artists/user`);
                console.log('Artist data:', artistData);
                setArtist(artistData);
                setFormData({
                    name: artistData.name,
                    imgUrl: artistData.imgUrl,
                });
            } catch (error) {
                console.error('Failed to fetch artist data:', error);
            }
        };

        fetchArtistData();
    }, []);

    const handleEditClick = (field) => {
        setIsEditing(prev => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    const uploadPhoto = async (photo) => {
        const formData = new FormData();
        formData.append('image', photo);
        console.log('Uploading photo:', photo);
        try {
            const response = await fetch(`${BASE_URL}music-data/artists/update/image`, {
                method: 'PUT',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error('Failed to update image:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating image:', error);
        }
    };

    const handleSave = async (field) => {
        try {
            if (field === 'image') {
                const photo = fileInputRef.current?.files[0];
                const updatedArtist = await uploadPhoto(photo);
                setArtist(updatedArtist);
                setIsEditing(prev => ({
                    ...prev,
                    [field]: false,
                }));
            } else if (field === 'name') {
                const updates = { 'username': formData.name };
                const response = await apiService('PUT', `${BASE_URL}music-data/artists/update/${field}`, updates);
                setArtist(response);
                setIsEditing(prev => ({
                    ...prev,
                    [field]: false,
                }));
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    };

    if (!isAuth) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, teal.400, teal.600)" backgroundClip="text">
                    Unauthorized
                </Heading>
                <Text fontSize="18px" mt={3} mb={2}>
                    Please log in to view this page.
                </Text>
                <Box mt={10}>
                    <Button as={Link} to="/login" colorScheme="teal" variant="solid" mr={3}>
                        Log in
                    </Button>
                    <Button as={Link} to="/register" colorScheme="gray" variant="outline">
                        Sign up
                    </Button>
                </Box>
            </Box>
        );
    }

    if (!artist) {
        return <Box>Loading...</Box>;
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Profile</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box px={4} py={6} maxW="500px" mx="auto">
                        <Box textAlign="center">
                            <Avatar size="2xl" src={artist.imageUrl ? artist.imageUrl  : artist.imgUrl  } />
                            <Heading as="h2" size="xl" mt={4}>{artist.name}</Heading>
                        </Box>
                        <FormControl mt={6}>
                            <FormLabel>Name</FormLabel>
                            {isEditing.name ? (
                                <Input
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    name="name"
                                />
                            ) : (
                                <Text>{formData.name}</Text>
                            )}
                            <Button mt={2} onClick={() => handleEditClick('name')}>
                                {isEditing.name ? 'Cancel' : 'Edit'}
                            </Button>
                            {isEditing.name && (
                                <Button ml={2} onClick={() => handleSave('name')}>
                                    Save
                                </Button>
                            )}
                        </FormControl>
                        <FormControl mt={6}>
                            <FormLabel>Profile Image</FormLabel>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <Icon as={FiFile} />
                                </InputLeftElement>
                                <Input
                                    type="text"
                                    value={fileName}
                                    placeholder="Choose file"
                                    readOnly
                                    onClick={() => fileInputRef.current.click()}
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e.target.files)}
                                />
                            </InputGroup>
                            <Button mt={2} onClick={() => handleEditClick('image')}>
                                {isEditing.image ? 'Cancel' : 'Edit'}
                            </Button>
                            {isEditing.image && (
                                <Button ml={2} onClick={() => handleSave('image')}>
                                    Save
                                </Button>
                            )}
                        </FormControl>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ArtistSettingsModal;
