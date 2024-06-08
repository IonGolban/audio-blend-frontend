import React, { useState, useEffect } from 'react';
import { Box, Text, Heading, SimpleGrid, Avatar, Flex, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';
import FeedItems from '../components/FeedItems.jsx';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [artistInfo, setArtistInfo] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [likedAlbums, setLikedAlbums] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [isArtistMode, setIsArtistMode] = useState(false);

    const isAuth = AuthStore.useState(s => s.isAuth);

    if (!isAuth) {
        return (
            <Box textAlign="center" py={10} px={6}>
                <Heading display="inline-block" as="h2" size="2xl" bgGradient="linear(to-r, teal.400, teal.600)" backgroundClip="text">
                    Unauthorized
                </Heading>
                <Text fontSize="18px" mt={3} mb={2}>
                    Please log in to view this page.
                </Text>
                <Box mt={10}>
                    <Button as={Link} to="/login" colorScheme="teal" variant="solid" mr={3}>
                        Log in
                    </Button>
                    <Button as={Link} to="/register" colorScheme="gray" variant="outline">
                        Sign up
                    </Button>
                </Box>
            </Box>
        );
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const artist = await apiService('GET', `${BASE_URL}music-data/artists/user/isArtist`);
                if (artist) {
                    setArtistInfo(artist);
                    const artistSongs = await apiService('GET', `${BASE_URL}music-data/songs/artist/${artist.id}`);
                    const artistAlbums = await apiService('GET', `${BASE_URL}music-data/albums/artist/${artist.id}`);
                    setSongs(artistSongs);
                    setAlbums(artistAlbums);
                }

                const userData = await apiService('GET', `${BASE_URL}music-data/users`);
                const likedSongs = await apiService('GET', `${BASE_URL}music-data/songs/liked`);
                const userPlaylists = await apiService('GET', `${BASE_URL}music-data/playlists/user`);
                const likedPlaylists = await apiService('GET', `${BASE_URL}music-data/playlists/liked`);
                const likedAlbums = await apiService('GET', `${BASE_URL}music-data/albums/liked`);
                const recommendedSongs = await apiService('GET', `${BASE_URL}music-data/songs/auth/random`, null, { count: 50 });
                

                setLikedSongs(likedSongs);
                setPlaylists(userPlaylists);
                setLikedPlaylists(likedPlaylists);
                setLikedAlbums(likedAlbums);
                setRecommendedSongs(recommendedSongs);

                setUser(userData);

                console.log('likedPlaylists', likedPlaylists);

            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box px={4} py={6}>
            <Flex alignItems="center" mb={6}>
                <Avatar size="2xl" src={user.imgUrl} />
                <Box ml={4}>
                    <Heading as="h2" size="xl">{user.username}</Heading>
                    <Text fontSize="lg">{user.bio}</Text>
                </Box>
                {!artistInfo && (
                    <FormControl display="flex" alignItems="center" ml={6}>
                        <FormLabel htmlFor="artist-mode" mb="0">
                            Artist Mode
                        </FormLabel>
                        <Switch id="artist-mode" isChecked={isArtistMode} onChange={() => setIsArtistMode(!isArtistMode)} />
                    </FormControl>
                )}
            </Flex>

            {isArtistMode ? artistContent(artistInfo, songs, albums) : userContent(likedSongs, likedPlaylists, likedAlbums, playlists)}

            {!isArtistMode && (
                <Box mt={10}>
                    <Heading as="h3" size="lg" mb={4}>Recommended Songs</Heading>
                    <FeedItems items={recommendedSongs} type="song" />
                </Box>
            )}
        </Box>
    );
};


const artistContent = (artist, songs, albums) => {
    return (<Tabs variant="soft-rounded" colorScheme="teal">
        <TabList>
            <Tab>Uploaded Songs</Tab>
            <Tab>Uploaded Albums</Tab>

        </TabList>

        <TabPanels>

            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Uploaded Songs</Heading>
                <FeedItems items={songs} type="song" />
            </TabPanel>
            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Uploaded Albums</Heading>
                <FeedItems items={albums} type="album" />
            </TabPanel>
        </TabPanels>



    </Tabs>

    )
}


const userContent = (likedSongs, likedPlaylists, likedAlbums, playlists) => {
    return (<Tabs variant="soft-rounded" colorScheme="teal">
        <TabList>

            <Tab>Liked Songs</Tab>
            <Tab>Liked Playlists</Tab>
            <Tab>Liked Albums</Tab>
            <Tab>Playlists</Tab>

        </TabList>

        <TabPanels>
            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Liked Songs</Heading>
                <FeedItems items={likedSongs} type="song" />
            </TabPanel>
            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Liked Playlists</Heading>
                <FeedItems items={likedPlaylists} type="playlist" />
            </TabPanel>
            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Liked Albums</Heading>
                <FeedItems items={likedAlbums} type="album" />
            </TabPanel>
            <TabPanel>
                <Heading as="h3" size="lg" mb={4}>Playlists</Heading>
                <FeedItems items={playlists} type="playlist" />
            </TabPanel>
        </TabPanels>
    </Tabs>

    )
}

export default ProfilePage;
