import {
    Flex,
    Box,
    useBreakpointValue
}from "@chakra-ui/react"
import AuthStore from "../stores/AuthStore";

export default function MainLayout({children}){
    const mobile_mod = useBreakpointValue({ base: false, md: true });
    const isAuth = AuthStore.useState(s => s.isAuth);

    return isAuth ? 
    <Box ml = '240' mb='96' >
        {children}
    </Box> 
    : <Box ml = '120' mb='96' mr='120' >
        {children}
    </Box>

}