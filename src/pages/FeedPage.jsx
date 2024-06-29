import React, { useEffect, useState } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Flex, Text, Wrap, WrapItem, Tag } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import FeedItems from "../components/FeedItems.jsx";
import AuthStore from "../stores/AuthStore";
import apiService from "../utils/ApiService.js";
import { BASE_URL } from "../utils/Constants.js";
import {shuffle} from "../utils/UtilsHelper.js";

export default function FeedPage() {
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [artists, setArtists] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isAuth = AuthStore.useState(s => s.isAuth);

    useEffect(() => {
        async function fetchGenres() {
            try {
                const response = await apiService('GET', `${BASE_URL}music-data/genres`);
                setGenres(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching genres:", error);
                setError("Failed to fetch genres.");
            }
        }

        fetchGenres();
    }, []);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            if (selectedGenres.length > 0) {
                await setInfoByGenres();
            } else {
                await setInfoWithoutGenres();
            }
        }

        fetchData();
    }, [isAuth, selectedGenres]);

    const handleGenreChange = (genre) => {
        setSelectedGenres((prev) => {
            if (prev.includes(genre)) {
                return prev.filter((g) => g !== genre);
            } else {
                return [...prev, genre];
            }
        });
    };

    const setInfoByGenres = async () => {
        const genreIds = shuffle(selectedGenres.map(genre => genre.id));
        console.log("Selected genres:", genreIds);

        let path_songs = `${BASE_URL}music-data/songs/genres`;
        let path_albums = `${BASE_URL}music-data/albums/genres`;
        let path_artists = `${BASE_URL}music-data/artists/genres`;

        const response_albums = await apiService('POST', path_albums, { GenresIds: genreIds }, { count: 150 });
        const response_songs = await apiService('POST', path_songs, { GenresIds: genreIds }, { count: 150 });
        const response_artists = await apiService('POST', path_artists, { GenresIds: genreIds }, { count: 150 });

        console.log("Fetched albums:", response_albums);
        console.log("Fetched songs:", response_songs);
        console.log("Fetched artists:", response_artists);

        if (response_albums) {
            setAlbums(shuffle(response_albums));
        } else {
            throw new Error("Invalid albums response structure");
        }

        if (response_songs) {
            setSongs(shuffle(response_songs));
        } else {
            throw new Error("Invalid songs response structure");
        }

        if (response_artists) {
            setArtists(shuffle(response_artists));
        } else {
            throw new Error("Invalid artists response structure");
        }
        setLoading(false);
    };

    const setInfoWithoutGenres = async () => {
        try {
            const nr_albums = 100;
            const nr_songs = 100;
            let path_songs = `${BASE_URL}music-data/songs/auth/random`;
            let path_albums = `${BASE_URL}music-data/albums/auth/random`;

            const response_albums = await apiService('GET', path_albums, null, { count: nr_albums });
            const response_songs = await apiService('GET', path_songs, null, { count: nr_songs });


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
    };

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
                Select Music Genres
            </Heading>
            <Flex overflowX="auto" mb={8} py={2}>
                {genres.map((genre) => (
                    <Box key={genre.id} mx={2} >
                        <Tag
                            size="md"
                            borderRadius="md"
                            variant={selectedGenres.includes(genre) ? "solid" : "outline"}
                            colorScheme={selectedGenres.includes(genre) ? "blue" : "gray"}
                            onClick={() => handleGenreChange(genre)}
                            cursor="pointer"

                        >
                            <Text p={2}>{genre.name}</Text>
                        </Tag>
                    </Box>
                ))}
            </Flex>
            <Heading as="h2" size="md" mb={4}>
                Albums
            </Heading>
            <FeedItems items={albums.slice(0,albums.length/2-1)} type="album" />
            <FeedItems items={albums.slice(albums.length/2,albums.length-1)} type="album" />
            <Heading as="h2" size="md" mt={8} mb={4}>
                Songs
            </Heading>
            <FeedItems items={songs.slice(0,songs.length/2-1)} type="song" />
            <FeedItems items={songs.slice(songs.length/2,songs.length-1)} type="song" />
        </Box>
    );
}
