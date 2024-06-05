import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import AlbumCard from './AlbumCard';

const FeedAlbumItems = ({ items,type }) => {
  
  return (
    <SimpleGrid columns={[1, null, 10]} spacing="4">
      
      {items.map((item) => (
        type == "album" ? <AlbumCard key={item.id} album={item} /> : <SongCard key={item.id} song={item} />
      ))}
    </SimpleGrid>
  );
};



export default FeedAlbumItems;