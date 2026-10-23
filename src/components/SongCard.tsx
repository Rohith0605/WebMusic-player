import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Heart, ListPlus } from "lucide-react";
import { Track } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { motion, AnimatePresence } from "motion/react";
import PlaylistMenu from "./PlaylistMenu";

interface SongCardProps {
  track: Track;
  onPlay?: () => void;
  onRemove?: () => void;
  removeLabel?: string;
}

const SongCard: React.FC<SongCardProps> = ({ track, onPlay, onRemove, removeLabel = "Remove from Playlist" }) => {
  const { 
    currentTrack, isPlaying, togglePlay, play, 
    favorites, toggleFavorite
  } = usePlayer();
  
  const [showPlaylists, setShowPlaylists] = useState(false);

  const isCurrent = currentTrack?.id === track.id;
  const isThisPlaying = isCurrent && isPlaying;
  const isFavorite = favorites.includes(track.id);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlay();
    } else {
      if (onPlay) onPlay();
      play(track);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(track);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPlaylists(!showPlaylists);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-4 standard-card group relative"
      onClick={() => play(track)}
    >
      <div className="relative aspect-square mb-4 shadow-2xl">
        <img 
          src={track.album_image} 
          alt={track.name} 
          className="w-full h-full object-cover rounded-md"
          referrerPolicy="no-referrer"
        />
        <div className={ `absolute inset-0 bg-black/40 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'opacity-100' : ''}` }>
          <button 
            onClick={handlePlay}
            className="w-12 h-12 bg-brand-green rounded-full shadow-lg flex items-center justify-center translate-y-0 group-hover:translate-y-[-8px] transition-all duration-300"
          >
            {isThisPlaying ? <Pause className="text-black" size={24} fill="currentColor" /> : <Play className="text-black ml-1" size={24} fill="currentColor" />}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-start gap-2">
        <div className="overflow-hidden">
          <h3 className={`text-white font-bold text-base truncate mb-1 ${isCurrent ? 'text-brand-green' : ''}`}>
            {track.name}
          </h3>
          <p className="text-zinc-400 text-sm line-clamp-2">{track.artist_name}</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={handleFavorite}
            className={`hover:scale-110 transition-transform ${isFavorite ? 'text-brand-green' : 'text-zinc-400 opacity-0 group-hover:opacity-100'}`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={toggleMenu}
            className="text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all p-1"
            title="Add to playlist"
          >
            <ListPlus size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showPlaylists && (
          <PlaylistMenu 
            track={track} 
            onClose={() => setShowPlaylists(false)} 
            onRemove={onRemove}
            removeLabel={removeLabel}
            className="bottom-full right-0 mb-2"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SongCard;
