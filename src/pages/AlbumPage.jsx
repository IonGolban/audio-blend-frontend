import { VStack, Flex, Text, Image, Box, Button, Spinner,IconButton } from "@chakra-ui/react";
import SongList from "../components/SongList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Constants.js";
import apiService from "../utils/ApiService.js";
import { format, parseISO } from 'date-fns';
import AuthStore from "../stores/AuthStore.js";
import { FaList, FaHeart, FaRegHeart } from 'react-icons/fa';
import { Link } from "react-router-dom";

export default function AlbumPage({ children }) {
    const { albumid } = useParams();
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState(null);
    const isAuth = AuthStore.useState(s => s.isAuth);
    const [likedAlbum, setLikedAlbum] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/albums/${albumid}`);
                if (isAuth) {
                    const likedAlbum = await apiService('GET', `${BASE_URL}music-data/likes/album/check/${albumid}`);
                    setLikedAlbum(likedAlbum?true:false);
                }
                setAlbum(response);
            } catch (error) {
                console.error("Error fetching albums:", error);
                setError(error);
            }
        };
        fetchData();
    }, [albumid]);

    if (error) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Text fontSize="2xl" color="red.500">Error: {error.message}</Text>
            </Flex>
        );
    }

    if (!album) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }
    const handleToggleLike = async (item) => {
        if (!likedAlbum) {
            const response = await apiService("POST", `${BASE_URL}music-data/likes/add/album/${item.id}`);
            console.log(response);
            setLikedAlbum(true);
        } else {
            const response = await apiService("DELETE", `${BASE_URL}music-data/likes/remove/album/${item.id}`);
            console.log(response);
            setLikedAlbum(false);
        }
    }

    return (
        <Flex p={10} justifyContent="center" flexDirection="column" alignItems="center" maxW="800px" mx="auto">
            <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }} mb={8}>
                <Image src={album.coverUrl} alt={album.title} borderRadius="full" boxSize="150px" mb={{ base: 4, md: 0 }} mr={{ md: 8 }} />
                <Box textAlign={{ base: "center", md: "left" }}>
                    <Text fontSize="4xl" fontWeight="bold" mb={2}>{album.title}</Text>
                    <Text fontSize="2xl" color="gray.600" mb={2} as={Link} to={`/artist/${album.artistId}`} >{album.artistName}</Text>
                    <Text fontSize="lg" color="gray.500">Released on: {format(parseISO(album.releaseDate), 'PP')}</Text>

                    {isAuth && <IconButton
                        icon={likedAlbum ? <FaHeart /> : <FaRegHeart />}
                        colorScheme={likedAlbum ? "red" : "gray"}
                        onClick={() => handleToggleLike(album)}
                        aria-label="Like"
                        variant="ghost"

                    />}
                </Box>
            </Flex>
            <SongList items={album.songs} listId={album.id} type="album" />
        </Flex>
    );
}
