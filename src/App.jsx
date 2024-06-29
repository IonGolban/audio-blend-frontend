import { useState, useEffect, useCallback } from "react"
import { ChakraProvider } from "@chakra-ui/react"
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LibraryPanel from "./components/LibraryPanel.jsx";
import AudioPlayer from "./components/AudioPlayer.jsx";
import { AudioPlayerProvider } from "./AudioPlayerProvider.jsx";
import NavBar from "./components/NavBar.jsx";
import { checkAuth, setAuthToken } from "./utils/AuthHelper.js";

import MainPage from "./pages/MainPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import RegisterPage from "./pages/RegisterPage.jsx";
import AuthStore from "./stores/AuthStore.js";
import MainLayout from "./pages/MainLayout.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import ArtistPage from "./pages/ArtistPage.jsx";
import PlaylistPage from "./pages/PlaylistPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProfileSettingsPage from "./pages/ProfileSettingsPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import AddSongPage from "./pages/AddSongPage.jsx";
import AddAlbumPage from "./pages/AddAlbumPage.jsx";
import FeedPage from "./pages/FeedPage.jsx";

export default function App() {
  const token = localStorage.getItem("token");
  const isAuth = AuthStore.useState((s) => s.isAuth);

  useEffect(() => {
    checkAuth(token).then(({ isAuth, username, id }) => {
      console.log("id from response", id);

      if (isAuth) {
        AuthStore.update((s) => {
          s.isAuth = isAuth;
          s.username = username;
          s.id = id;
        });



        setAuthToken(token);
        console.log("User is authenticated");
        // window.location.href = "/dashboard";
      }
    });
  }, [isAuth]);

  console.log(isAuth);
  const showPanel = true;
  // console.log(showPanel)

  return (
    <ChakraProvider>
      <AudioPlayer src={"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} />
      <Router>
        <LibraryPanel/>
        <MainLayout>
          <NavBar />

          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/albums/:albumid" element={<AlbumPage />} />
            <Route path="/artist/:artistid" element={<ArtistPage />} />
            <Route path="/playlists/:playlistid" element={<PlaylistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<h1>Not Found</h1>} />
            <Route path="/profile/settings" element={<ProfileSettingsPage />} />
            <Route path="/search"  element={<SearchPage />} />
            <Route path="/add-album" element={<AddAlbumPage/>} />
            <Route path="/add-song" element={<AddSongPage/>} />
            <Route path="/feed" element={<FeedPage/>} />
          </Routes>
        </MainLayout>
      </Router>

    </ChakraProvider>

  )
}
