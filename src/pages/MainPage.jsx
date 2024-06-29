import { Box, Button, Flex, Heading, Image, Link, Text, SimpleGrid, Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/Constants.js";
import apiService from "../utils/ApiService.js";
import { msToHumanReadable } from "../utils/UtilsHelper.js";
import AuthStore from "../stores/AuthStore.js";
export default function MainPage() {

  const [topSongs, setTopSongs] = useState([]);
  const isAuth = AuthStore.useState((   s) => s.isAuth);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService('GET', `${BASE_URL}music-data/songs/top/10`);
        setTopSongs(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching top songs:", error);
      }
    };
    fetchData();

  }, []);

  console.log(topSongs);

  return (
    <Box as="main" py={{ base: 12, md: 16, lg: 24 }}>
      <SimpleGrid columns={{ base: 1, md: 2 }} px={{ base: 4, md: 8, lg: 16 }}>
        <Flex direction="column" alignItems="start" gap={6}>
          <Heading as="h1" size="2xl" lineHeight="tight" fontWeight="bold">
            Discover the AudioBlend experience
          </Heading>
          <Text color="gray.500" fontSize={{ base: "md", md: "xl" }}>
            Explore a vast library of albums, curated playlists, and personalized recommendations.
          </Text>
          {!isAuth && <Flex direction={{ base: "column", sm: "row" }} gap={2}>
            <Button size="lg">Sign In</Button>
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </Flex>}
        </Flex>
        <Box position="relative">
          <Image
            alt="Hero Image"
            mx="auto"
            rounded="xl"
            src="https://www.izotope.com/storage-cms/images/_aliases/hero_fallback_1x/0/3/3/7/277330-1-eng-GB/4d79e42ef215-digital-audio-basics-optimized-featured-image-waveform.png"
            height="300px"
            width="500px"
            objectFit="cover"
          />
        </Box>
      </SimpleGrid>


      <Box as="section" px={{ base: 4, md: 8, lg: 16 }} mt={12}>
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
          {topSongs.map(song => (
            <Card
              key={song.id}
              _hover={{ ".hover-info": { opacity: 1 } }}
              position="relative"
            >
              <CardHeader height="100px" display="flex" alignItems="center" justifyContent="center">
                <Flex p={2} flexDirection='column'  >
                  <Text
                    fontSize="20"
                    fontFamily="monospace"
                    fontWeight="bold"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxWidth="200px"

                  >
                    {song.title}
                  </Text>
                  <Text
                    fontSize='15'
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxWidth="200px"
                  >
                    {song.artistName}
                  </Text>
                </Flex>
              </CardHeader>
              <CardBody
                position="relative"
                backgroundImage={`url(${song.coverUrl})`}
                backgroundSize="cover"
                backgroundPosition="center"
                minHeight="200px"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                color="white"
                textAlign="center"
                p={4}
              >
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                  backgroundColor="rgba(0, 0, 0, 0.5)"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                  p={4}
                  className="hover-info"
                  opacity={0}
                  transition="opacity 0.3s"
                >
                  <Text
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxWidth="200px"
                  >
                    {song.genres.join(', ')}
                  </Text>
                  <Text
                    fontSize='12'
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    maxWidth="200px"
                  >
                    {msToHumanReadable(song.duration)}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
