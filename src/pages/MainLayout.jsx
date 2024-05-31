import {
    Flex,
    Box,
    useBreakpointValue
}from "@chakra-ui/react"

export default function MainLayout({children}){
    const mobile_mod = useBreakpointValue({ base: false, md: true });

    return mobile_mod ? 
    <Box ml = '240' mb='96' >
        {children}
    </Box> :
    <Box mt = '80' mb = '96' >

    </Box>
        

}