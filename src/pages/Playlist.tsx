import React, { useState, useEffect } from "react";
import { ListMusic, Plus, Music, Play, MoreHorizontal, AlertCircle, X, Trash2 } from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { motion, AnimatePresence } from "motion/react";
import SongCard from "../components/SongCard";

const PlaylistPage: React.FC = () => {
  const { playlists, addPlaylist, deletePlaylist, setQueue, removeFromPlaylist, notify } = usePlayer();
  const [activePlaylist, setActivePlaylist] = useState<any>(null);

  const handleSetQueue = (songs: any[]) => {
    if (!songs || songs.length === 0) {
      notify("This playlist has no songs to play.", "error");
      return;
    }
    setQueue(songs);
  };

  const createPlaylist = () => {
    const name = `My Playlist #${playlists.length + 1}`;
    addPlaylist(name);
  };

  const currentActive = playlists.find(p => p.id === activePlaylist?.id);

  return (
    <div className="pb-32 px-4 relative">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black tracking-tight">Your Playlists</h1>
        <button 
          onClick={createPlaylist}
          className="bg-white text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-brand-green transition-colors"
        >
          <Plus size={20} />
          Create Playlist
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
        {playlists.map((pl) => (
          <motion.div 
            key={pl.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setActivePlaylist(pl)}
            className={`p-6 bg-surface-zinc-900/40 rounded-2xl cursor-pointer border border-white/5 hover:bg-surface-zinc-800/80 transition-all ${activePlaylist?.id === pl.id ? 'ring-2 ring-brand-green' : ''}`}
          >
            <div className="w-full aspect-square bg-surface-zinc-700/20 rounded-xl flex items-center justify-center mb-4 shadow-xl">
              <ListMusic size={48} className="text-zinc-400" />
            </div>
            <h3 className="font-bold text-lg mb-1">{pl.name}</h3>
            <p className="text-zinc-400 text-xs font-medium">{pl.songs.length} songs</p>
          </motion.div>
        ))}
      </div>

      {currentActive && (
        <div className="bg-surface-zinc-900/20 rounded-3xl p-8 border border-white/5">
          <div className="flex items-end gap-6 mb-8">
            <div className="w-40 h-40 bg-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl">
              <ListMusic size={60} className="text-zinc-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-5xl font-black mb-4 tracking-tighter">{currentActive.name}</h2>
              <div className="flex items-center gap-4">
                <button 
                  className="bg-brand-green text-black w-14 h-14 rounded-full flex items-center justify-center shadow-xl shadow-brand-green/20 hover:scale-105 transition-transform"
                  onClick={() => handleSetQueue(currentActive.songs)}
                >
                  <Play fill="currentColor" size={28} />
                </button>
                <button 
                  onClick={() => deletePlaylist(currentActive.id)}
                  className="text-rose-500 hover:text-rose-400 transition-colors p-2"
                  title="Delete Playlist"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
          </div>

          {currentActive.songs.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentActive.songs.map((song: any) => (
                <SongCard 
                  key={song.id} 
                  track={song} 
                  onRemove={() => removeFromPlaylist(currentActive.id, song.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-2xl">
              <Music className="mx-auto mb-4 opacity-10" size={60} />
              <p className="text-zinc-400 font-medium">This playlist is empty. Search for songs to add them.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistPage;
