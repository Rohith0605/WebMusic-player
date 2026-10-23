import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Track } from "../types";
import SongCard from "../components/SongCard";
import { usePlayer } from "../context/PlayerContext";
import { Heart } from "lucide-react";
import { motion } from "motion/react";

const Favorites: React.FC = () => {
  const { favoriteTracks, setQueue, toggleFavorite } = usePlayer();

  useEffect(() => {
    if (favoriteTracks.length > 0) {
      setQueue(favoriteTracks);
    }
  }, [favoriteTracks, setQueue]);

  return (
    <div className="pb-32">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-6 mb-10"
      >
        <div className="w-52 h-52 bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-2xl flex items-center justify-center shadow-2xl">
          <Heart size={80} fill="white" className="text-white" />
        </div>
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Playlist</span>
          <h1 className="text-7xl font-black text-white mb-2 tracking-tighter">Your Favorites</h1>
          <p className="text-zinc-400 font-bold">{favoriteTracks.length} songs</p>
        </div>
      </motion.div>

      {favoriteTracks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favoriteTracks.map((track) => (
            <SongCard 
              key={track.id} 
              track={track} 
              onRemove={() => toggleFavorite(track)}
              removeLabel="Remove from Favorites"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4">
          <Heart size={48} className="opacity-20" />
          <p className="font-medium text-lg">Your favorites will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default Favorites;
