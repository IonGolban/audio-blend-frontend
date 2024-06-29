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
    Text,
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import { CiMusicNote1 } from "react-icons/ci";
import { useState, useRef, useEffect } from 'react';
import { FiFile } from 'react-icons/fi';
import apiService from '../utils/ApiService';
import Select from 'react-select';
import { BASE_URL } from '../utils/Constants';


const AddSongPage = () => {
    const navigate = useNavigate();
    const [genres, setGenres] = useState([]);
    const [photoName, setFileName] = useState('');
    const [songName, setSongName] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const photoInputRef = useRef(null);
    const songInputRef = useRef(null);
    const [songNameInput, setSongNameInput] = useState('');

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

    const handleAddSong = async () => {


        const songName = document.getElementById('song-name').value;
        const songDescription = document.getElementById('song-description').value;
        const songGenres = selectedGenres.map(genre => genre.value);
        const songPhoto = photoInputRef.current.files[0];
        const songFile = songInputRef.current.files[0];

        const formData = new FormData();
        formData.append('title', songName);
        formData.append('description', songDescription);
        songGenres.forEach(genre => {
            formData.append('genres', genre);
        });
        formData.append('coverImage', songPhoto);
        formData.append('song', songFile);

        console.log('Album data:', formData);
        try {
            const response = await fetch(`${BASE_URL}music-data/albums/add-single`, {
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
            } else {
                console.error('Failed to create album:', response.statusText);
            }
        } catch (error) {
            console.error('Error creating album:', error);
        } 


    };

    return (
        <Box p={8}>
            <Flex direction="column" align="center" maxW="600px" mx="auto">
                <Heading mb={1}>Upload Song</Heading>
                <Text mb={6}>Single realease album</Text>
                <FormControl>
                    <Input id="song-name" placeholder="Enter song name" variant={'flushed'} focusBorderColor='gray.500' />
                </FormControl>
                <FormControl mt={4}>
                    <Input id="song-description" placeholder="Enter description" variant={'flushed'} focusBorderColor='gray.500' />
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
                            id="song-photo"
                            type="file"
                            ref={photoInputRef}
                            onChange={(e) => handleFileChange(e.target.files)}
                            style={{ display: 'none' }}
                        />
                    </InputGroup>
                </FormControl>
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
                </FormControl>
                <Flex mt={6} justify="space-between" w="full">
                    <Button colorScheme="gray" variant="ghost" onClick={handleAddSong}>
                        Create
                    </Button>
                    <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default AddSongPage;
