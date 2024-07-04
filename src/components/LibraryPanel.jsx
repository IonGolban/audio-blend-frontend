import React, { useEffect, useState } from "react";
import { useNavigate, Link  } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/Constants.js";
import { useStoreState } from "pullstate";
import AuthStore from "../stores/AuthStore.js";
import {
    IconButton,
    Box,
    CloseButton,
    Flex,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    VStack,
    HStack,
    Image,
    Button,
} from "@chakra-ui/react";
import {
    FiHome,
    FiTrendingUp,
    FiCompass,
    FiStar,
    FiSettings,
    FiMenu, 
} from "react-icons/fi";
import { FaMusic, FaPlay, FaRandom, FaPlus, FaArrowLeft   } from "react-icons/fa";
import CreatePlaylist from "./CreatePlaylist.jsx";
import apiSerivce from "../utils/ApiService.js";

const LinkItems = [
    { name: "Home", icon: FiHome },
    { name: "Trending", icon: FiTrendingUp },
    { name: "Explore", icon: FiCompass },
    { name: "Favourites", icon: FiStar },
    { name: "Settings", icon: FiSettings },
];

const appName = "AudioBlend";

function clickItem() {
    console.log("clicked");
}

export default function SimpleSidebar({ children }) {
    const { isOpen: isLeftOpen, onOpen: onLeftOpen, onClose: onLeftClose } = useDisclosure();
    const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();
    const show = true;
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [randomItems, setRandomItems] = useState([]);
    const [artists, setArtists] = useState([]);
    const navigate = useNavigate();
    const isAuth = useStoreState(AuthStore, s => s.isAuth);
    useEffect(() => {
        async function fetchData() {
            try {
                let albums_url = "";
                let playlists_url = "";
                let artists_url = "";
                albums_url = `${BASE_URL}music-data/albums/liked`;
                playlists_url = `${BASE_URL}music-data/playlists/liked`;
                artists_url = `${BASE_URL}music-data/artists/followed/user`;
                
                const albumResponse = await axios.get(`${albums_url}`);
                setAlbums(albumResponse.data);

                const playlistResponse = await axios.get(`${playlists_url}`);
                setPlaylists(playlistResponse.data);

                const artistsResponse = await axios.get(`${artists_url}`);
                console.log(artistsResponse.data);
                setArtists(artistsResponse.data);
                // const randomResponse = await axios.get(`${BASE_URL}music-data/random`);
                // setRandomItems(randomResponse.data);

                // console.log(playlistResponse.data);
                // console.log(randomResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, []);

    const goto = (path) => {
        navigate(path);
    };

    return (
        <>
            {show && (
                <>
                    <SidebarContent onClose={onLeftClose} artists={artists} albums={albums} playlists={playlists} randomItems={randomItems} goto={goto} display={{ base: "none", md: "block" }} />
                    <Drawer
                        autoFocus={false}
                        isOpen={isLeftOpen}
                        placement="left"
                        onClose={onLeftClose}
                        returnFocusOnClose={false}
                        onOverlayClick={onLeftClose}
                        size="full"
                    >
                        <DrawerContent>
                            <SidebarContent isAuth = {isAuth} onClose={onLeftClose} albums={albums} playlists={playlists} randomItems={randomItems} goto={goto} />
                        </DrawerContent>
                    </Drawer>
                    <Drawer
                        autoFocus={false}
                        isOpen={isRightOpen}
                        placement="right"
                        onClose={onRightClose}
                        returnFocusOnClose={false}
                        onOverlayClick={onRightClose}
                        size="full"
                    >
                        <DrawerContent>
                            <RightSidebarContent onClose={onRightClose} />
                        </DrawerContent>
                    </Drawer>
                    {/* mobilenav */}
                    <MobileNav onLeftOpen={onLeftOpen} onRightOpen={onRightOpen} display={{ base: "flex", md: "none" }} />
                </>
            )}
        </>
    );
}

const SidebarContent = ({ isAuth, onClose, albums, playlists,artists, randomItems, goto, ...rest }) => {
    const [isPlaylistModalOpen, setPlaylistModalOpen] = useState(false);
    return (
        <Box
            bg={useColorModeValue("gray.50", "gray.800")}
            borderRight="1px"
            borderRightColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            overflowY="scroll"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                        {appName}
                    </Text>
                </Link>
                <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
                <Button p = {5} onClick={()=> setPlaylistModalOpen(true)}>
                    + Playlist
                </Button>
            <VStack spacing={4} mt={4}>
                <Section title="Albums" items={albums} icon={FaMusic} goto={goto}/>
                <Section title="Playlists" items={playlists} icon={FaPlay} goto={goto} />
                <Box w="full" px="4">
                <Text fontSize="xl" mt="4" mb="2">Artists</Text>
                {artists.map((item) => (
                    <Link to={`/artist/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
                        <NavItem key = {item.id} icon={FaRandom} img_url ={item.imgUrl} fontSize="sm">
                            {item.name}
                        </NavItem>
                    </Link>
                ))}
    </Box>
            </VStack>
        <CreatePlaylist isOpen={isPlaylistModalOpen} onClose={()=>setPlaylistModalOpen(false)} />

        </Box>
    );
};

const Section = ({ title, items, icon, goto }) => (
    <Box w="full" px="4">
        <Text fontSize="xl" mt="4" mb="2">{title}</Text>
        {items.map((item) => (
            <Link to={`/${title.toLowerCase()}/${item.id}`} key={item.id} style={{ textDecoration: "none" }}>
                <NavItem key = {item.id} icon={icon} img_url ={item.coverUrl} fontSize="sm">
                    {item.title}
                </NavItem>
            </Link>
        ))}
    </Box>
);

const RightSidebarContent = ({ onClose, ...rest }) => {
    return (
        <Box
            bg={useColorModeValue("gray.50", "gray.800")}
            borderLeft="1px"
            borderLeftColor={useColorModeValue("gray.200", "gray.700")}
            w={{ base: "full", md: 60 }}
            pos="fixed"
            h="full"
            overflowY="scroll"
            {...rest}
        >
            <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    Links
                </Text>
                <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon}>
                    <Link to={`/${link.name.toLowerCase()}`} onClick={clickItem}>{link.name}</Link>
                </NavItem>
            ))}
        </Box>
    );
};

const NavItem = ({ img_url, icon, children, fontSize, ...rest }) => {
    return (
        <Flex
            align="center"
            p="2"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{ bg: "gray.300", color: "white" }}
            fontSize={fontSize}
            {...rest}
        >
            {img_url ? <Image mr = "4" boxSize='50px' objectFit='cover' borderRadius='md'  src = {`${img_url}`}/> : <Icon mr="4" fontSize="16" as={icon} />}
            {children}
        </Flex>
    );
};

const MobileNav = ({ onLeftOpen, onRightOpen, ...rest }) => {
    return (
        <Flex
            ml={{ base: 0, md: 60 }}
            px={{ base: 4, md: 24 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue("gray.50", "gray.900")}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue("gray.200", "gray.700")}
            justifyContent="space-between"
            {...rest}
        >
            <IconButton variant="outline" onClick={onLeftOpen} aria-label="open left menu" icon={<FiMenu />} />
            <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
                {appName}
            </Text>
            <IconButton variant="outline" onClick={onRightOpen} aria-label="open right menu" icon={<FiMenu />} />
        </Flex>
    );
};
