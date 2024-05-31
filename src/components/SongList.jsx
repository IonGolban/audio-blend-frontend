import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Image,
    Box,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from "@chakra-ui/react";
import { FiMusic } from "react-icons/fi";
import { format, parseISO } from 'date-fns';
import { Link } from "react-router-dom";
import MusicStore from '../stores/MusicStore.js';
import { FaList } from 'react-icons/fa';
import {msToHumanReadable} from '../utils/UtilsHelper.js';

export default function SongList({ items, imgUrl, releaseDate }) {

    const handleClickSong = (item) => {
        console.log("aud_url", item.audioUrl);
            MusicStore.update(s => {
                s.currentSong = item.audioUrl;
                s.isPlaying = true;
                s.songInfo = item;
            });
    }

    const handleAddToQueue = (item) => {
        console.log("add to queue", item);
        MusicStore.update(s => {
            s.queue.push(item);
        });
    };

    console.log("items", items);
    return (
        <Box overflowX="auto" padding={4} w='100vh'>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Title</Th>
                        <Th>Duration</Th>
                        <Th>Artist</Th>
                        <Th>Genre</Th>
                        <Th>Popularity</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {items.map((item) => (
                        <Tr
                            key={item.id}
                            _hover={{ backgroundColor: "gray.100", transform: "scale(1.01)", transition: "all 0.1s ease" }}
                            onDoubleClick={()=>handleClickSong(item)}
                        >
                            <Td>
                                <Box fontWeight="bold" fontSize="13">{item.title}</Box>
                            </Td>
                            <Td>{msToHumanReadable(item.duration)}</Td>
                            <Td>{item.artistName}</Td>
                            <Td>{item.genres}</Td>
                            <Td>{item.popularity ? item.popularity : "0"}</Td>
                            <Td>
                                <Menu>
                                    <MenuButton as={Button} rightIcon={<FaList />} />
                                    <MenuList>
                                        <MenuItem onClick={() => handleAddToQueue(item)}>Add to Queue</MenuItem>
                                        <MenuItem>Add to Playlist</MenuItem>
                                        <MenuItem>Share</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
}
