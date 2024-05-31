import { Flex, Box, FormControl, FormLabel, Input, Checkbox, Stack, Link, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { checkAuth } from '../utils/AuthHelper';
import AuthStore from '../stores/AuthStore';
import axios from "axios"

export default function RegisterPage({ children }) {
    const navigate = useNavigate();

    const [data, setData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState();

    function register() {
        console.log(data)
        axios
            .post("https://localhost:7195/api/v1/register", data)
            .then((res) => {
                console.log(res)
                navigate("/login")
                ;
            })
            .catch((err) => {
                console.log(error)
                setError(err.response.data ?? err.response.data.data);
                console.log("error: ", err.response.data);
            });
    }

    return (
        <>
            <Flex
                align={'center'}
                justify={'center'}
                height="100vh"
                pb="85"
                bgColor="gray.300"
            >
                <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} bgColor={'gray.200'} rounded="lg">
                    <Stack align={'center'}>
                        <Heading fontSize={'5xl'} fontFamily="monospace" fontWeight="bold">Register</Heading>
                    </Stack>
                    <Box
                        rounded={'lg'}
                        bg={useColorModeValue('gray.100', 'gray.700')}
                        boxShadow={'lg'}
                        p={8}>
                        <Stack spacing={4}>
                            <FormControl id="username" >
                                <FormLabel fontFamily="monospace" fontWeight="bold" >Username</FormLabel>
                                <Input type="username" onChange={(ev) => {
                                    setData({ ...data, username: ev.target.value });
                                }} />
                            </FormControl>

                            <FormControl id="email" >
                                <FormLabel fontFamily="monospace" fontWeight="bold" >  Email address</FormLabel>
                                <Input type="email" onChange={(ev) => {
                                    setData({ ...data, email: ev.target.value });
                                }} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel fontFamily="monospace" fontWeight="bold" >Password</FormLabel>
                                <Input type="password" onChange={(ev) => {
                                    setData({ ...data, password: ev.target.value });
                                }} />
                            </FormControl>
                            <FormControl id="confirm-password">
                                <FormLabel fontFamily="monospace" fontWeight="bold" >Confirm password</FormLabel>
                                <Input type="password" onChange={(ev) => {
                                    setData({ ...data, confirmPassword: ev.target.value });
                                }} />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}>
                                    <Link color={'gray.400'} to='/login'>Already have an account ?</Link>
                                </Stack>
                                <Button
                                    filled
                                    onClick={register}
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'gray.500',
                                    }}>
                                    Register
                                </Button>
                                {error && <Text fontSize="2x1" color="red.300">{error}</Text>}
                            
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </Flex>
            {children}
        </>

    );
}
