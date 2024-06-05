"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Flex,
    Avatar,
    Heading,
    Text,
    Button,
    useColorModeValue,
} from "@chakra-ui/react";
import apiService from "../utils/ApiService.js";
import { BASE_URL } from "../utils/Constants.js";
import FeedAlbumItems from "../components/FeedAlbumItems.jsx";
import FeedItems from "../components/FeedItems.jsx";
import AuthStore from "../stores/AuthStore.js";
const ArtistPage = () => {
    const { artistid } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [songs, setSongs] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const isAuth = AuthStore.useState(s => s.isAuth);
    useEffect(() => {
        const fetchArtistData = async () => {
            try {
                const artistData = await apiService('GET', `${BASE_URL}music-data/artists/${artistid}`);
                const topSongsData = await apiService('GET', `${BASE_URL}music-data/songs/artist/${artistid}`);
                const albumsData = await apiService('GET', `${BASE_URL}music-data/albums/artist/${artistid}`);
                if(isAuth){
                    const followingData = await apiService('GET', `${BASE_URL}music-data/likes/artists/${artistid}/check`);
                    if (followingData) {
                        setIsFollowing(true);
                    }
                }
                
                setArtist(artistData);
                setSongs(topSongsData);
                setAlbums(albumsData);

                console.log("Fetched artist data:", artistData);
                console.log("Fetched top songs:", topSongsData);
                console.log("Fetched albums:", albumsData);
                console.log("Fetched following status:", followingData);
            } catch (error) {
                console.error("Failed to fetch artist data", error);
            }
        };

        fetchArtistData();
    }, [artistid]);

    const handleFollowToggle = async () => {
        try {
            const followUrl = `${BASE_URL}music-data/likes/artists/add/${artistid}`;
            const unfollowUrl = `${BASE_URL}music-data/likes/artists/remove/${artistid}`;
            const url = isFollowing ? unfollowUrl : followUrl;

            await apiService('POST', url);

            setIsFollowing(!isFollowing);
        } catch (error) {
            console.error("Failed to toggle follow status", error);
        }
    };

    if (!artist) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box px={4} py={6}>
            <Flex alignItems="center" mb={6}>
                <Avatar size="2xl" src={artist.imageUrl} />
                <Box ml={4}>
                    <Heading as="h2" size="xl">{artist.name}</Heading>
                    <Text fontSize="lg">{artist.genres}</Text>
                    <Text mt={2}>{artist.description}</Text>
                    <Text mt={2} fontSize={"sm"}>{artist.followers} followers</Text>
                    <Button
                        mt={4}
                        onClick={handleFollowToggle}
                        colorScheme={isFollowing ? "blue" : "gray"}
                        variant="ghost"
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Button>
                </Box>
            </Flex>

            <Heading as="h3" size="lg" mb={4}>Top Songs</Heading>
            <FeedItems items={songs} type="song" />

            <Heading as="h3" size="lg" mb={4}>Albums</Heading>
            <FeedItems items={albums} type = "album"/>
        </Box>
    );
};

export default ArtistPage;
