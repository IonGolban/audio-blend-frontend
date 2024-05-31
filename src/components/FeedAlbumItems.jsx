import React from 'react';
import { SimpleGrid } from '@chakra-ui/react';
import AlbumCard from './AlbumCard';

const FeedAlbumItems = ({ albums }) => {
  return (
    <SimpleGrid columns={[1, null, 10]} spacing="4">
      {albums.map((item) => (
        <AlbumCard key={item.id} album={item} />
      ))}
    </SimpleGrid>
  );
};

export default FeedAlbumItems;