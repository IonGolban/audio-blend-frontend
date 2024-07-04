import {
    InputGroup,
    InputLeftElement,
    Icon,
    Box,
    FormControl,
    FormLabel,
    Flex,
    Heading,
    Input,
    Button,
    List,
    ListItem,
    Text,
    HStack,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { CiMusicNote1 } from "react-icons/ci";
import { useState, useRef, useEffect } from 'react';
import { FiFile } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import Select from 'react-select';
import apiService from '../utils/ApiService';
import { BASE_URL } from '../utils/Constants';
import { GiToaster } from 'react-icons/gi';

const AddAlbumPage = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [photoName, setFileName] = useState('');
    const [songName, setSongName] = useState('');
    const [songNameInput, setSongNameInput] = useState('');
    const [albumSongs, setAlbumSongs] = useState([]);
    const photoInputRef = useRef(null);
    const songInputRef = useRef(null);

    useEffect(() => {
        const fetchGenres = async () => {
            const response = await apiService('GET', 'https://localhost:7195/api/v1/music-data/genres');
            setGenres(response.map(genre => ({ value: genre.name, label: genre.name })));
        };
        fetchGenres();
    }, []);

    const handleFileChange = (files) => {
        if (files.length > 0) {
            setFileName(files[0].name);
        }
    };

    const handleSongFileChange = (files) => {
        if (files.length > 0) {
            setSongName(files[0].name);
        }
    };

    const addSongToList = () => {
        if (songName) {
            const newSongRef = songInputRef.current;
            const songNameInput = document.getElementById('song-name').value.length > 0 ? document.getElementById('song-name').value : newSongRef.files[0].name;
            
            setAlbumSongs([...albumSongs, { song: newSongRef.files[0], name: songNameInput }]);
            setSongName('');
            setSongNameInput('');
            songInputRef.current.value = null;
        }
    };

    const removeSongFromList = (song) => {
        const newSongs = albumSongs.filter((s) => s !== song);
        setAlbumSongs(newSongs);
    }

    const handleCreateAlbum = async () => {
        const albumName = document.getElementById('album-name').value;
        const albumDescription = document.getElementById('album-description').value;
        const albumPhoto = photoInputRef.current.files[0];
        
        const formData = new FormData();
        formData.append('title', albumName);
        formData.append('description', albumDescription);
        selectedGenres.forEach((genre) => formData.append('genres', genre.value));
        formData.append('coverImage', albumPhoto);

        albumSongs.forEach((item, index) => {
            const renamedFile = new File([item.song], item.name, { type: item.song.type });
            formData.append(`songs`, renamedFile);
        });

        console.log('Album data:', formData);
        try {
            const response = await fetch(`${BASE_URL}music-data/albums/add-album`, {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Album created:', data);
                navigate(-1);
                return data;
            } else {
                console.error('Failed to create album:', response.statusText);
                
            }
        } catch (error) {
            console.error('Error creating album:', error);
        }
    }

    return (
        <Box p={8}>
            <Flex direction="column" align="center" maxW="600px" mx="auto">
                <Heading mb={6}>Create Album</Heading>
                <FormControl>
                    <Input id="album-name" placeholder="Enter album name" variant={'flushed'} focusBorderColor='gray.500' />
                </FormControl>
                <FormControl mt={4}>
                    <Input id="album-description" placeholder="Enter description" variant={'flushed'} focusBorderColor='gray.500' />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Genres</FormLabel>
                    <Select
                        isMulti
                        name="genres"
                        options={genres}
                        value={selectedGenres}
                        onChange={setSelectedGenres}
                        placeholder="Select genres"
                        closeMenuOnSelect={false}
                        variant={'flushed'}
                    />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Photo</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={FiFile} />
                        </InputLeftElement>
                        <Input
                            placeholder="Select a cover image..."
                            value={photoName}
                            readOnly
                            onClick={() => photoInputRef.current.click()}
                        />
                        <input
                            id="album-photo"
                            type="file"
                            accept="image/png, image/gif, image/jpeg"
                            ref={photoInputRef}
                            onChange={(e) => handleFileChange(e.target.files)}
                            style={{ display: 'none' }}
                        />
                    </InputGroup>
                </FormControl>
                <Box mt={4} w="full">
                    <Heading size="md" mb={2}>Add Songs</Heading>
                </Box>
                <FormControl mt={4}>
                    <FormLabel>Song</FormLabel>
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <Icon as={CiMusicNote1} />
                        </InputLeftElement>
                        <Input
                            placeholder="Select a song..."
                            value={songName}
                            readOnly
                            onClick={() => songInputRef.current.click()}
                        />
                        <input
                            id="song-file"
                            type="file"
                            accept=".mp3,audio/*"
                            ref={songInputRef}
                            onChange={(e) => handleSongFileChange(e.target.files)}
                            style={{ display: 'none' }}
                        />
                    </InputGroup>
                    <Input
                        id="song-name"
                        value={songNameInput}
                        onChange={(e) => setSongNameInput(e.target.value)}
                        placeholder="Song name"
                        variant={'flushed'}
                        focusBorderColor='gray.500'
                        mt={2}
                    />
                    <Button mt={2} leftIcon={<AiOutlinePlus />} onClick={addSongToList}>
                        Add Song
                    </Button>
                </FormControl>
                <Box mt={4} w="full">
                    <Heading size="md" mb={2}>Songs List</Heading>
                    <List spacing={3}>
                        {albumSongs.map((song, index) => (
                            <ListItem key={index} bg="gray.100" p={2} borderRadius="md">
                                <HStack justifyContent={'space-between'}>
                                    <Text>{index + 1}</Text>
                                    <Text>{song.name}</Text>
                                    <Button onClick={() => removeSongFromList(song)} colorScheme="red" size="sm" ml={2}>
                                        Remove
                                    </Button>
                                </HStack>
                            </ListItem>
                        ))}
                    </List>
                </Box>
                <Flex mt={6} justify="space-between" w="full">
                    <Button colorScheme="gray" variant="ghost" onClick={handleCreateAlbum}>
                        Create
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default AddAlbumPage;
