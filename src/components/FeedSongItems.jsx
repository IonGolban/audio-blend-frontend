import React from 'react';
import { SimpleGrid, Box } from '@chakra-ui/react';
import SongCard from './SongCard';


const FeedSongItems= ({songs}) => {
  return (
    <SimpleGrid columns={[1, null, 10]} spacing="20px" p='3'>
      {songs.map((item) => (
        <SongCard key={item.id} song={item} />
      ))}
    </SimpleGrid>
  );
};

export default FeedSongItems;
