import React, { useState } from 'react';
import { SimpleGrid, Box, Button, Flex } from '@chakra-ui/react';
import SongCard from './SongCard';
import AlbumCard from './AlbumCard';
import PlaylistCard from './PlaylistCard';

const FeedItems = ({ items,type }) => {
  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = items.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box>
      <SimpleGrid columns={[1, null, 8]} spacing="20px" p='3'>
        {currentItems.map((item) => (
        type == "album" ? <AlbumCard key={item.id} album={item} /> : (type=="song" ?<SongCard key={item.id} song={item} /> : <PlaylistCard key={item.id} playlist={item} />)
      ))}
      </SimpleGrid>
      <Flex justifyContent="center" mt={4}>
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 1}>
          Previous
        </Button>
        <Button onClick={handleNextPage} isDisabled={currentPage * itemsPerPage >= items.length} ml={4}>
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default FeedItems;
