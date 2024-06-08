import { Box, Icon, Flex, Text } from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AddItemCard = ({ type }) => {
    return (
        <Box
            as={Link}
            to={`/add-${type}`}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            p={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            minH="200px"
            cursor="pointer"
            _hover={{ borderColor: "gray.500" }}
        >
            <Icon as={FaPlus} w={12} h={12} color="gray.400" />
            <Text mt={4} fontSize="lg" color="gray.600">
                Add {type === 'song' ? 'Song' : 'Album'}
            </Text>
        </Box>
    );
};

export default AddItemCard;
