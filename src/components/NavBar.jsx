"use client";
import React from "react";
import {
    Box,
    Flex,
    Avatar,
    HStack,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    useDisclosure,
    useColorModeValue,
    Stack,
    useBreakpointValue,
    Text
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { useStoreState } from "pullstate";
import AuthStore from "../stores/AuthStore.js";

const Links = [{ name: "Home", link: "/home" }, { name: "Feed", link: "/feed" }, { name: "Library", link: "/library" }];

const NavLink = ({ to, name }) => {
   
    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={"md"}
            _hover={{
                textDecoration: "none",
                bg: useColorModeValue("gray.200", "gray.700"),
            }}
        >
            <Link to={to}>
                <Text fontFamily="Abolition">{name}</Text>
            </Link>
        </Box>
    );
};

export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
        const isAuth = useStoreState(AuthStore, s => s.isAuth);

    const showNavbar = useBreakpointValue({ base: false, md: true });
    const LinksMenu =  isAuth ?
    [{ name: "Profile", link: "/profile" }, { name: "Settings", link: "/settings" }, { name: "Logout", link: "/login" }]
        : [{ name: "Login", link: "/login" }, { name: "Register", link: "/register" }];
    return (
        <>
            {showNavbar && (
                <Box bg={useColorModeValue("gray.50", "gray.900")} px={4}>
                    <Flex h={16} justifyContent={"space-between"} alignContent={"center"}>
                        <IconButton
                            size={"md"}
                            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                            aria-label={"Open Menu"}
                            display={{ md: "none" }}
                            onClick={isOpen ? onClose : onOpen}
                        />
                        <HStack w="full" spacing={8} justifyContent="center">
                            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }} justifyContent={"center"}>
                                {Links.map((link) => (
                                    <NavLink key={link.name} to={link.link} name={link.name} />
                                ))}
                            </HStack>
                        </HStack>
                        <Flex alignItems={"center"}>
                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={"full"}
                                    variant={"link"}
                                    cursor={"pointer"}
                                    minW={0}
                                >
                                    <Avatar size={"sm"} src={"https://100k-faces.glitch.me/random-image"} />
                                </MenuButton>
                                <MenuList>
                                    {LinksMenu.map((link) => (
                                        <MenuItem key={link.name} as={Link} to={link.link}>
                                            {link.name}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        </Flex>
                    </Flex>

                    {isOpen && (
                        <Box pb={4} display={{ md: "none" }}>
                            <Stack as={"nav"} spacing={4}>
                                {Links.map((link) => (
                                    <NavLink key={link.name} to={link.link} name={link.name} />
                                ))}
                            </Stack>
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
}
