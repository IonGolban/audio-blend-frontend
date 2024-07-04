import React, { useState, useEffect } from 'react';
import { Spinner, Box, Text, Heading, SimpleGrid, Avatar, Flex, Button, Tabs, TabList, TabPanels, Tab, TabPanel, Switch, FormControl, FormLabel } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import apiService from '../utils/ApiService.js';
import { BASE_URL } from '../utils/Constants.js';
import AuthStore from '../stores/AuthStore.js';
import FeedItems from '../components/FeedItems.jsx';
import AddItemCard from '../components/AddItemCard';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [artistInfo, setArtistInfo] = useState(false);
    const [playlists, setPlaylists] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [likedAlbums, setLikedAlbums] = useState([]);
    const [followedArtists, setFollowedArtists] = useState([]);
    const [recommendedSongs, setRecommendedSongs] = useState([]);
    const [isArtistMode, setIsArtistMode] = useState(false);
    const [tabIndex, setTabIndex] = useState(0)

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
                    const artistSongsreq =  apiService('GET', `${BASE_URL}music-data/songs/artist/${artist.id}`);
                    const artistAlbumsreq =  apiService('GET', `${BASE_URL}music-data/albums/artist/${artist.id}`);
                    const [artistSongs, artistAlbums] = await Promise.all([artistSongsreq, artistAlbumsreq]);
                    setSongs(artistSongs);
                    setAlbums(artistAlbums);
                }

                const userDatareq =  apiService('GET', `${BASE_URL}music-data/users`);
                const likedSongsreq =  apiService('GET', `${BASE_URL}music-data/songs/liked`);
                const userPlaylistsreq =  apiService('GET', `${BASE_URL}music-data/playlists/user`);
                const likedPlaylistsreq =  apiService('GET', `${BASE_URL}music-data/playlists/liked`);
                const likedAlbumsreq =  apiService('GET', `${BASE_URL}music-data/albums/liked`);
                const artistsFollowedreq =  apiService('GET', `${BASE_URL}music-data/artists/followed/user`);
                const recommendedSongsreq =  apiService('GET', `${BASE_URL}music-data/songs/auth/random`, null, { count: 50 });

                const [userData, likedSongs, userPlaylists, likedPlaylists, likedAlbums, artistsFollowed, recommendedSongs] = await Promise.all([userDatareq, likedSongsreq, userPlaylistsreq, likedPlaylistsreq, likedAlbumsreq, artistsFollowedreq, recommendedSongsreq]);

                setLikedSongs(likedSongs);
                setPlaylists(userPlaylists);
                setLikedPlaylists(likedPlaylists);
                setLikedAlbums(likedAlbums);
                setFollowedArtists(artistsFollowed);
                setRecommendedSongs(recommendedSongs);

                setUser(userData);


            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        };

        fetchUserData();
    }, []);

    if (!user) {
        return (<Flex justifyContent="center" alignItems="center" height="100vh">
            <Spinner size="xl" />
        </Flex>);
    }

    console.log(tabIndex);

    return (
        <Box px={4} py={6}>
            <Flex alignItems="center" mb={6}>
                <Avatar size="2xl" src={isArtistMode ? artistInfo.imageUrl : user.imgUrl} />
                <Box ml={4}>
                    <Heading as="h2" size="xl" variant={'outline'}>{isArtistMode ? artistInfo.name : user.username}</Heading>
                    <Text fontSize="lg">{user.bio}</Text>
                </Box>

                <FormControl display="flex" alignItems="center" ml={6}>
                    <FormLabel htmlFor="artist-mode" mb="0">
                        Artist Mode
                    </FormLabel>
                    <Switch id="artist-mode" isChecked={isArtistMode} onChange={() => setIsArtistMode(!isArtistMode)} />
                </FormControl>

            </Flex>

            {isArtistMode ? artistContent(artistInfo, songs, albums) : userContent(likedSongs, likedPlaylists, likedAlbums, playlists, followedArtists)}

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
    return (
        <Tabs variant="soft-rounded" colorScheme="teal">
            <TabList>
                <Tab>Uploaded Songs</Tab>
                <Tab>Uploaded Albums</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Heading as="h3" size="lg" mb={4}>Uploaded Songs</Heading>
                    <Flex>
                        <AddItemCard type="song" />
                        <FeedItems items={songs} type="song" />
                    </Flex>
                </TabPanel>
                <TabPanel>
                    <Heading as="h3" size="lg" mb={4}>Uploaded Albums</Heading>
                    <Flex>
                        <AddItemCard type="album" />
                        <FeedItems items={albums} type="album" />
                    </Flex>
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

const userContent = (likedSongs, likedPlaylists, likedAlbums, playlists, followedArtists) => {
    return (
        <Tabs onChange={(index) => setTabIndex(index)} variant="soft-rounded" colorScheme="teal">
            <TabList>
                <Tab>Liked Songs</Tab>
                <Tab>Liked Playlists</Tab>
                <Tab>Liked Albums</Tab>
                <Tab>Playlists</Tab>
                <Tab>Followed Artists</Tab>
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
                <TabPanel>
                    <Heading as="h3" size="lg" mb={4}>Followed Artists</Heading>
                    <FeedItems items={followedArtists} type="artist" />
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default ProfilePage;
