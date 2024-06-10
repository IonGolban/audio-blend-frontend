import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Heading, Avatar, FormControl, FormLabel, Input, Button, VStack, Flex, InputGroup, InputLeftElement, Icon } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom';
import { FiFile } from 'react-icons/fi';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';
import UpdatePasswordModal from '../components/UpdatePasswordModal.jsx';

const ProfileSettingsPage = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState({});
    const [formData, setFormData] = useState({});
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [isUpdatePasswordModalOpen, setIsUpdatePasswordModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiService('GET', `${BASE_URL}music-data/users`);
                setUser(userData);
                setFormData({
                    username: userData.username,
                    email: userData.email,
                    image: userData.imgUrl,
                });
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = (field) => {
        if (field === 'password') {
            setIsUpdatePasswordModalOpen(true);
        } else {
            setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    const uploadPhoto = async (photo) => {
        const formData = new FormData();
        formData.append('image', photo);
        console.log("Updating image", formData);
        try {
            const response = await fetch(`${BASE_URL}music-data/users/update/image`, {
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
                const updatedUser = await uploadPhoto(photo);
                setUser(updatedUser);
                setIsEditing((prev) => ({ ...prev, [field]: false }));
            } else {
                const response = await apiService('PUT', `${BASE_URL}music-data/users/update/${field}`, { [field]: formData[field] });
                setUser(response);
                setIsEditing((prev) => ({ ...prev, [field]: false }));
            }
        } catch (error) {
            console.error('Error updating user:', error);
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

    if (!user) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box px={4} py={6} maxW="500px" mx="auto">
            <Flex alignItems="center" mb={6}>
                <Avatar size="2xl" src={user.imgUrl} />
                <Box ml={4}>
                    <Heading as="h2" size="xl">{user.username}</Heading>
                    <Text fontSize="lg">{user.bio}</Text>
                </Box>
            </Flex>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <Flex>
                        <FormLabel htmlFor="username" mb="0" flex="1">
                            Username
                        </FormLabel>
                        {isEditing.username ? (
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Text flex="1">{formData.username}</Text>
                        )}
                        <Button ml={2} onClick={() => handleEditClick('username')}>
                            {isEditing.username ? 'X' : 'Edit'}
                        </Button>
                        {isEditing.username && (
                            <Button ml={2} onClick={() => handleSave('username')}>
                                Save
                            </Button>
                        )}
                    </Flex>
                </FormControl>
                <FormControl>
                    <Flex>
                        <FormLabel htmlFor="email" mb="0" flex="1">
                            Email
                        </FormLabel>
                        {isEditing.email ? (
                            <Input
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        ) : (
                            <Text flex="1">{formData.email}</Text>
                        )}
                        <Button ml={2} onClick={() => handleEditClick('email')}>
                            {isEditing.email ? 'X' : 'Edit'}
                        </Button>
                        {isEditing.email && (
                            <Button ml={2} onClick={() => handleSave('email')}>
                                Save
                            </Button>
                        )}
                    </Flex>
                </FormControl>
                <FormControl>
                    <Flex>
                        <FormLabel htmlFor="image" mb="0" flex="1">
                            Photo
                        </FormLabel>
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
                                id="profile-photo"
                                type="file"
                                ref={fileInputRef}
                                onChange={(e) => handleFileChange(e.target.files)}
                                style={{ display: 'none' }}
                            />
                        </InputGroup>
                        <Button ml={2} onClick={() => handleEditClick('image')}>
                            {isEditing.image ? 'X' : 'Edit'}
                        </Button>
                        {isEditing.image && (
                            <Button ml={2} onClick={() => handleSave('image')}>
                                Save
                            </Button>
                        )}
                    </Flex>
                </FormControl>
                <FormControl>
                    <Flex>
                        <FormLabel htmlFor="password" mb="0" flex="1">
                            Password
                        </FormLabel>
                        <Text flex="1">********</Text>
                        <Button ml={2} onClick={() => handleEditClick('password')}>
                            Edit
                        </Button>
                    </Flex>
                </FormControl>
            </VStack>

            <UpdatePasswordModal
                isOpen={isUpdatePasswordModalOpen}
                onClose={() => setIsUpdatePasswordModalOpen(false)}
            />
        </Box>
    );
};

export default ProfileSettingsPage;
