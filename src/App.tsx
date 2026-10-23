/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PlayerProvider } from "./context/PlayerContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import PlaylistPage from "./pages/Playlist";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <PlayerProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/playlists" element={<PlaylistPage />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </Router>
    </PlayerProvider>
  );
}
