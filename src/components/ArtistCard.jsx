import React from 'react';
import { Box, Image, Text, VStack, Card, CardHeader, CardFooter, CardBody, Flex, useColorModeValue, } from '@chakra-ui/react';
import { msToHumanReadable } from '../utils/UtilsHelper.js';
import { addToQueue, playSong } from '../utils/AudioHelper.js';
import { PiQueue } from "react-icons/pi";
import { Link } from 'react-router-dom';

export default function AristCard({ artist }) {
    const bgColor = useColorModeValue("white", "gray.800");
    const borderColor = useColorModeValue("gray.200", "gray.700");
    const UNKNOUWN_ARTIST_IMG = "https://thumbs.dreamstime.com/b/default-avatar-profile-flat-icon-social-media-user-vector-portrait-unknown-human-image-default-avatar-profile-flat-icon-184330869.jpg";
    console.log("artistcard", artist);
    return (
        <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={artist.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            as='Link'
            to={`/artists/${artist.id}`}
        >
            <Image src={artist.imgUrl?.length > 0 ? artist.imgUrl : UNKNOUWN_ARTIST_IMG} alt={artist.title} />

            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                        {artist.name}
                    </Text>
                </VStack>
            </Box>
        </Box>
    );

};

