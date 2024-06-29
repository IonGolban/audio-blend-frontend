import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, VStack, Spinner, Text } from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiService from '../utils/ApiService';
import { BASE_URL } from '../utils/Constants';
import FeedItems from '../components/FeedItems';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const query = new URLSearchParams(location.search).get('query' || '');
    const [searchQuery, setSearchQuery] = useState(query);
    console.log("searchQuery", searchQuery);


    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        setSearchQuery(query);
    }, [query]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchQuery) return;

            setLoading(true);
            setError(null);

            try {
                const data = await apiService('GET', `${BASE_URL}music-data/search`, null, { query: searchQuery, count: 30 });
                console.log("Data:", data);
                const users = await apiService('GET', `${BASE_URL}music-data/search/users`, null, { query: searchQuery, count: 30 });
                console.log("Users:", users);

                setAlbums(data.albums);
                setArtists(data.artists);
                setSongs(data.songs);
                setUsers(users);

                console.log("Search albums:", albums);
                console.log("Search artists:", artists);
                console.log("Search songs:", songs);
                console.log("Search users:", users);
                


                console.log("Search results:", );
            } catch (err) {
                setError('Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchQuery]);

    const handleSearch = () => {
        
        navigate(`/search?query=${searchQuery}`);
    };

    return (
        <Box p={4}>
            {loading && <Spinner size="xl" />}
            {error && <Text color="red.500">{error}</Text>}
            {songs?.length >0 && <Box>
                <Heading as="h2" size="lg" mb={4}>Songs</Heading>
                <FeedItems items={songs} type="song" />
            </Box>}
            {albums?.length >0 &&<Box mt={8}>
                <Heading as="h2" size="lg" mb={4}>Albums</Heading>
                <FeedItems items={albums} type="album" />
            </Box>}
            {artists?.length >0 && <Box mt={8}>
                <Heading as="h2" size="lg" mb={4}>Artists</Heading>
                <FeedItems items={artists} type="artist" />
            </Box>}
            {users?.length >0 && <Box mt={8}>
                <Heading as="h2" size="lg" mb={4}>Users</Heading>
                <FeedItems items={users} type="user" />
            </Box>}
        </Box>
    );
};

export default SearchPage;
