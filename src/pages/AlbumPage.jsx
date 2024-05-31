import { VStack, Flex, Text, Image, Box, Spinner } from "@chakra-ui/react";
import SongList from "../components/SongList";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/Constants.js";
import apiService from "../utils/ApiService.js";
import { format, parseISO } from 'date-fns';

export default function AlbumPage({ children }) {
    const { albumid } = useParams();
    const [album, setAlbum] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/albums/${albumid}`);
                setAlbum(response);
                console.log(response);
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

    return (
        <Flex p={10} justifyContent="center" flexDirection="column" alignItems="center" maxW="800px" mx="auto">
            <Flex flexDirection={{ base: "column", md: "row" }} alignItems={{ base: "center", md: "flex-start" }} mb={8}>
                <Image src={album.coverUrl} alt={album.title} borderRadius="full" boxSize="150px" mb={{ base: 4, md: 0 }} mr={{ md: 8 }} />
                <Box textAlign={{ base: "center", md: "left" }}>
                    <Text fontSize="4xl" fontWeight="bold" mb={2}>{album.title}</Text>
                    <Text fontSize="2xl" color="gray.600" mb={2}>{album.artistName}</Text>
                    <Text fontSize="lg" color="gray.500">Released on: {format(parseISO(album.releaseDate), 'PP')}</Text>
                </Box>
            </Flex>
            <SongList items={album.songs} imgUrl={album.coverUrl} releaseDate={album.releaseDate} />
        </Flex>
    );
}