import { Link } from "react-router-dom";
import FeedAlbumItems from "../components/FeedAlbumItems.jsx";
import FeedItems from "../components/FeedItems.jsx";
import AuthStore from "../stores/AuthStore";
import apiService from "../utils/ApiService.js";
import { useEffect, useState } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading } from "@chakra-ui/react";
import { BASE_URL } from "../utils/Constants.js";

export default function HomePage() {
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuth = AuthStore.useState(s => s.isAuth);

    useEffect(() => {
        async function fetchData() {
            try {
                const nr_albums = 100;
                const nr_songs = 100;
                let path_songs = isAuth ? `${BASE_URL}music-data/songs/auth/random` : `${BASE_URL}music-data/songs/random`;
                let path_albums = isAuth ? `${BASE_URL}music-data/albums/auth/random` : `${BASE_URL}music-data/albums/random`;
                
                const response_albums = await apiService('GET', path_albums, null, { count: nr_albums });
                const response_songs = await apiService('GET', path_songs, null, { count: nr_songs});

                console.log("Fetched albums:", response_albums);
                console.log("Fetched songs:", response_songs);

                if (response_albums) {
                    setAlbums(response_albums);
                } else {
                    throw new Error("Invalid albums response structure");
                }

                if (response_songs) {
                    setSongs(response_songs);
                } else {
                    throw new Error("Invalid songs response structure");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch albums or songs.");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [isAuth]);

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    return (
        <Box p={4}>
            <Heading as="h2" size="lg" mb={4}>
                Album Recommendations
            </Heading>
            <FeedItems items={albums} type = "album" />
            <Heading as="h2" size="lg" mt={8} mb={4}>
                Song Recommendations
            </Heading>
            <FeedItems items={songs} type = "song"/>
        </Box>
    );
}
