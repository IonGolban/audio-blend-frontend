import React, { useState, useRef, useEffect } from "react";
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
    Text,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListItem,
    Icon
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, SearchIcon } from "@chakra-ui/icons";
import { Link, useNavigate, createSearchParams } from "react-router-dom";
import { useStoreState } from "pullstate";
import AuthStore from "../stores/AuthStore.js";
import { BASE_URL } from "../utils/Constants.js";
import apiService from "../utils/ApiService.js";
import { BiAlbum } from "react-icons/bi";
import { CiMusicNote1 } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
import { playSong } from "../utils/AudioHelper.js";


const Links = [{ name: "Home", link: "/home" }, { name: "Feed", link: "/feed" }, { name: "Library", link: "/library" }];

const NavLink = ({ to, name }) => {
    return (
        <Box
            as="a"
            px={2}
            py={1}
            rounded={"md"}
            _hover={{ textDecoration: "none", bg: useColorModeValue("gray.200", "gray.700") }}
            _focus={{ textDecoration: "none" }}
        >
            <Link to={to}
                _activeLink={{ bg: useColorModeValue("gray.200", "gray.700") }}>
                <Text fontWeight={"semibold"} lineHeight={"100%"} fontStyle="">
                    {name}
                </Text>
            </Link>
        </Box>
    );
};

export default function Simple() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isAuth = useStoreState(AuthStore, s => s.isAuth);
    const showNavbar = useBreakpointValue({ base: false, md: true });
    const LinksMenu = isAuth ?
        [{ name: "Profile", link: "/profile" }, { name: "Settings", link: "/profile/settings" }, { name: "Logout", link: "/login" }]
        : [{ name: "Login", link: "/login" }, { name: "Register", link: "/register" }];
    const count_suggestions = 5;
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const suggestionsRef = useRef();

    const handleSearch = async (e) => {
        setSearchQuery(e.target.value);
        if (e.target.value.length > 2) {
            const path = `${BASE_URL}music-data/search`;
            const data = await apiService('GET', path, null, { query: e.target.value, count: count_suggestions });
            setSuggestions(data);
            console.log("Suggestions:", data);
        } else {
            setSuggestions([]);
        }
    };

    const handlePlaySong = (song) => {
        playSong(song);
    };

    const handleSeeAll = () => {
        const q = createSearchParams({ query: searchQuery });
        navigate(`/search?${q}`);
    };

    const handleClickOutside = (e) => {
        if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
            setSuggestions([]);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await apiService('GET', `${BASE_URL}music-data/users`);
                setUser(userData);
                document.addEventListener("mousedown", handleClickOutside);

            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <HStack w="full" spacing={8} justifyContent="space-between">
                            <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }} justifyContent={"center"}>
                                {Links.map((link) => (
                                    <NavLink key={link.name} to={link.link} name={link.name} />
                                ))}
                            </HStack>
                            <InputGroup maxW="400px">
                                <Input
                                    type="text"
                                    placeholder="Search"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                                <InputRightElement pointerEvents="none">
                                    <SearchIcon color="gray.500" />
                                </InputRightElement>
                            </InputGroup>
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
                                    {user ? <Avatar size={"sm"} src={user.imgUrl} /> : <Avatar size={"sm"} />}
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
            {(suggestions.albums?.length > 0 || suggestions.songs?.length > 0 || suggestions.artists?.length > 0) && (
                <Box ref={suggestionsRef} zIndex="1000" position="absolute" top="70px" right="20px" width="450px" justifyItems={'center'} overflowY={'scroll'}>
                    <Flex mt={2} bg={useColorModeValue("gray.50", "gray.900")} px={4} rounded="md" shadow="md" width="100%">
                        <List spacing={2} width="100%">
                            {suggestions.albums?.map((suggestion, index) => (
                                <ListItem key={index} py={2} px={4} _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}>
                                    <Flex alignItems="center" as={Link} to={`/albums/${suggestion.id}`}>
                                        <Icon as={BiAlbum} w={6} h={6} mr={2} />
                                        <Text>{suggestion.title}</Text>
                                        <Text ml={2} color="gray.500">{suggestion.artistName}</Text>
                                    </Flex>
                                </ListItem>
                            ))}
                            {suggestions.songs?.map((suggestion, index) => (
                                <ListItem key={index} py={2} px={4} _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}>
                                    <Flex alignItems="center" as={Button} onClick={() => handlePlaySong(suggestion)}>
                                        <Icon as={CiMusicNote1} w={6} h={6} mr={2} />
                                        <Text>{suggestion.title}</Text>
                                        <Text ml={2} color="gray.500">{suggestion.artistName}</Text>
                                    </Flex>
                                </ListItem>
                            ))}
                            {suggestions.artists?.map((suggestion, index) => (
                                <ListItem key={index} py={2} px={4} _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}>
                                    <Flex alignItems="center" as={Link} to={`/artists/${suggestion.id}`}>
                                        <Icon as={GoPerson} w={6} h={6} mr={2} />
                                        <Text>{suggestion.name}</Text>
                                    </Flex>
                                </ListItem>
                            ))}
                            <ListItem py={2} px={4} _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}>
                                <Flex alignItems="center" as={Button} onClick={() => handleSeeAll()}>
                                    <Text>See All</Text>
                                </Flex>
                            </ListItem>
                        </List>
                    </Flex>
                </Box>
            )}
        </>

    );
}
