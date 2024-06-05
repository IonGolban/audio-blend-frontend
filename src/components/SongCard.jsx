import React from 'react';
import { Box, Image, Text, VStack, Card, CardHeader, CardFooter, CardBody, Flex,useColorModeValue, } from '@chakra-ui/react';
import { msToHumanReadable } from '../utils/UtilsHelper.js';
import { addToQueue, playSong } from '../utils/AudioHelper.js';
import { PiQueue } from "react-icons/pi";
import { Link } from 'react-router-dom';
export default function SongCard ({ song }) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
            bg={bgColor}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            borderColor={borderColor}
            key={song.id}
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
            onClick={() => playSong(song)}
            
        >
            <Image src={song.coverUrl} alt={song.title} />

            <Box p="4">
                <VStack spacing={1} align="start">
                    <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                        {song.title}
                    </Text>
                    <Text as = {Link} to = {`/artists/${song.artistId}`}fontSize="sm" color="gray.500" noOfLines={1}>
                        {song.artistName}
                    </Text>
                    <PiQueue onClick={(e) => {
                        e.stopPropagation();
                        addToQueue(song);
                    }} />
                </VStack>
            </Box>
        </Box>
  );

};
 
