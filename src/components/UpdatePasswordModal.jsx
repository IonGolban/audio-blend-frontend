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
    InputRightElement,
    Input,
    Button,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import apiService from '../utils/ApiService';
import { BASE_URL } from '../utils/Constants.js';

const UpdatePasswordModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

    const handleUpdatePassword = async () => {
        if (newPassword !== newPasswordConfirm) {
            alert('New passwords do not match');
            return;
        }
        try {
            const response = await apiService('PUT', `${BASE_URL}music-data/users/update/password`, {
                'CurrentPassword': oldPassword,
                'NewPassword' : newPassword,
                'ConfirmNewPassword' : newPasswordConfirm
            });
            console.log(response);
            onClose();
        } catch (error) {
            console.error('Error updating password:', error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Password</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Old Password</FormLabel>
                        <InputGroup>
                            <Input
                                id="old-password"
                                type={showOldPassword ? 'text' : 'password'}
                                placeholder="Enter old password"
                                variant={'flushed'}
                                focusBorderColor='gray.500'
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowOldPassword(!showOldPassword)}>
                                    {showOldPassword ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>New Password</FormLabel>
                        <InputGroup>
                            <Input
                                id="new-password"
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                variant={'flushed'}
                                focusBorderColor='gray.500'
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowNewPassword(!showNewPassword)}>
                                    {showNewPassword ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Confirm New Password</FormLabel>
                        <InputGroup>
                            <Input
                                id="new-password-confirm"
                                type={showNewPasswordConfirm ? 'text' : 'password'}
                                placeholder="Confirm new password"
                                variant={'flushed'}
                                focusBorderColor='gray.500'
                                value={newPasswordConfirm}
                                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                            />
                            <InputRightElement width="4.5rem">
                                <Button h="1.75rem" size="sm" onClick={() => setShowNewPasswordConfirm(!showNewPasswordConfirm)}>
                                    {showNewPasswordConfirm ? <FiEyeOff /> : <FiEye />}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleUpdatePassword} mr={3}>
                        Update
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default UpdatePasswordModal;
