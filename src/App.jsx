import { useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Playlists from "./components/Playlists";
import PlaylistPage from "./components/PlaylistPage";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/MusicPlayer";
import Menu from "./components/Menu";
import Story from "./components/Story";
import PaanBuilder from "./components/PaanBuilder";
import Footer from "./components/Footer";

export default function App() {
  const playerRef = useRef(null);

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  const handleSongSelect = (playlistId, songIndex) => {
    if (playerRef.current?.selectSong) {
      playerRef.current.selectSong(playlistId, songIndex);
    }
  };

  return (
    <BrowserRouter>
      <div id="top" className="relative min-h-screen bg-night">
        <div className="grain-overlay" />

        <Navbar />

        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Playlists />
                <Menu />
                <Story />
                <PaanBuilder />
                <Footer />
              </>
            }
          />

          {/* PLAYLIST */}
          <Route
            path="/playlists/:playlistId"
            element={
              <PlaylistPage
                onSongSelect={handleSongSelect}
              />
            }
          />

        </Routes>

        <MusicPlayer
          onPlayerReady={handlePlayerReady}
        />

      </div>
    </BrowserRouter>
  );
}