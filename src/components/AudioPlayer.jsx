import React, { useRef, useEffect } from 'react';
import { useStoreState } from 'pullstate';
import MusicStore from '../stores/MusicStore.js';
import {
    Box,
    Button,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Flex,
    Text,
    Image,
    Stack,
    Heading,
    IconButton,
    Tooltip,
    Menu,
    MenuButton,
    MenuList,
    MenuItem
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaRedo, FaUndo, FaForward, FaList, FaTrash } from 'react-icons/fa';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef();

    const { songInfo, currentSong, isPlaying, isMuted, volume, isLooping, currentTime, queue } = useStoreState(MusicStore, s => ({
        currentSong: s.currentSong,
        isPlaying: s.isPlaying,
        isMuted: s.isMuted,
        volume: s.volume,
        isLooping: s.isLooping,
        currentTime: s.currentTime,
        songInfo: s.songInfo,
        queue: s.queue
    }));

    useEffect(() => {
        if (currentSong) {
            audioRef.current.src = currentSong;
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentSong, isPlaying]);

    const togglePlay = () => {
        console.log(queue)
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        MusicStore.update(s => { s.isPlaying = !isPlaying; });
    };

    const toggleMute = () => {
        audioRef.current.muted = !isMuted;
        MusicStore.update(s => { s.isMuted = !isMuted; });
    };

    const toggleLoop = () => {
        audioRef.current.loop = !isLooping;
        MusicStore.update(s => { s.isLooping = !isLooping; });
    };

    const handleVolumeChange = (value) => {
        audioRef.current.volume = value;
        MusicStore.update(s => { s.volume = value; });
    };

    const handleTimeUpdate = () => {
        MusicStore.update(s => { s.currentTime = audioRef.current.currentTime; });
    };

    const handleSeek = (value) => {
        audioRef.current.currentTime = value;
        MusicStore.update(s => { s.currentTime = value; });
    };

    const skipTime = (amount) => {
        audioRef.current.currentTime += amount;
        MusicStore.update(s => { s.currentTime = audioRef.current.currentTime; });
    };

    const skipSong = () => {
        console.log("skip song  ")
        const [nextSong, ...newQueue] = queue;
        console.log(queue)
        console.log("next song", nextSong)
        if (nextSong) {

            MusicStore.update(s => {
                s.currentSong = nextSong.audioUrl;
                s.queue = newQueue;
                s.duration = 0;
                s.songInfo = nextSong;
            });

        }
    };

    const removeSongFromQueue = (index) => {
        const newQueue = [...queue];
        newQueue.splice(index, 1);
        MusicStore.update(s => {
            s.queue = newQueue;
        });
    };

    return (
        <Flex justifyContent="space-between" alignItems="center"
            position="fixed"
            bottom="0"
            left="0"
            right="0"
            bg="gray.200"
            borderTop="1px solid"
            borderColor="gray.300"
            p={4}
            zIndex={100}
        >
            <Box flex="1" mr={4} width="20px">
                <Flex alignItems="center">
                    <Image src={`${songInfo.coverUrl ? songInfo.coverUrl : "https://www.teachhub.com/wp-content/uploads/2019/10/Our-Top-10-Songs-About-School.png"}`} boxSize="50px" objectFit="cover" alt="Song cover" />
                    <Stack ml={4} spacing={0}>
                        <Heading as="h2" size="sm" fontSize="16px" isTruncated maxWidth="200px" >{`${songInfo.title ? songInfo.title : 'AudioBlend'}`}</Heading>
                        <Text color="gray.500" fontSize="14px" isTruncated maxWidth="200px">{`${songInfo.artist?.name ? songInfo.artist.name : 'AudioBlend'}`}</Text>
                    </Stack>
                </Flex>
            </Box>
            <Box width="60%">
                <audio
                    ref={audioRef}
                    onTimeUpdate={handleTimeUpdate}
                />
                <Flex align="center">
                    <IconButton onClick={() => skipTime(-10)} icon={<FaUndo />} mr={2} aria-label="Rewind 10 seconds" />
                    <Button onClick={togglePlay} mr={2}>
                        {isPlaying ? <FaPause /> : <FaPlay />}
                    </Button>
                    <IconButton onClick={() => skipTime(10)} icon={<FaRedo />} mr={2} aria-label="Forward 10 seconds" />
                    <IconButton onClick={() =>skipSong()} icon={<FaForward />} mr={2} aria-label="Skip Song" />
                    <Slider
                        aria-label="audio progress"
                        flex="1"
                        value={currentTime}
                        max={audioRef.current ? audioRef.current.duration : 0}
                        onChange={handleSeek}
                    >
                        <SliderTrack bg="gray.200">
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Flex>
            </Box>
            <Box width="20%" textAlign="right" pr='10' pl='10'>
                <Flex align="center" justifyContent="space-between">
                    <Tooltip label="Volume" >
                        <Slider
                            aria-label="Volume"
                            flex="1"
                            value={volume}
                            max={1}
                            min={0}
                            step={0.01}
                            onChange={handleVolumeChange}
                        >
                            <SliderTrack bg="gray.200">
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb boxSize={3}>
                                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                            </SliderThumb>
                        </Slider>
                    </Tooltip>
                    <IconButton onClick={toggleMute} icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />} aria-label="Mute" ml={2} />
                    <IconButton onClick={toggleLoop} icon={<FaRedo />} aria-label="Loop" ml={2} color={isLooping ? 'blue.500' : 'gray.500'} />
                    <Menu>
                        <MenuButton as={Button}>
                            Q
                        </MenuButton>
                        {queue.length > 0 && <MenuList>
                            {queue.map((song, index) => (
                                <MenuItem key={index} onClick={() => removeSongFromQueue(index)}>
                                    {song.title} <IconButton icon={<FaTrash />} aria-label="Remove" ml={2} />
                                </MenuItem>
                            ))}
                        </MenuList>}
                    </Menu>
                </Flex>
            </Box>
        </Flex>
    );
};

export default AudioPlayer;
