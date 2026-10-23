import React, { useState } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Volume2, Volume1, VolumeX, Heart, ListMusic, Maximize2 
} from "lucide-react";
import { usePlayer } from "../context/PlayerContext";
import { motion, AnimatePresence } from "motion/react";
import PlaylistMenu from "./PlaylistMenu";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const PlayerBar: React.FC = () => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { 
    currentTrack, isPlaying, togglePlay, next, prev, 
    volume, setVolume, progress, duration, seek,
    shuffle, setShuffle, repeat, setRepeat, favorites, toggleFavorite
  } = usePlayer();

  if (!currentTrack) return null;

  const isFavorite = favorites.includes(currentTrack.id);

  return (
    <footer className="h-24 bg-black border-t border-zinc-800 px-4 flex items-center justify-between fixed bottom-0 left-0 right-0 z-50">
      {/* Current Track Info */}
      <div className="flex items-center gap-4 w-[30%]">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-14 h-14 bg-zinc-700 rounded overflow-hidden shadow-lg"
        >
          <img 
            src={currentTrack.album_image} 
            alt={currentTrack.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="flex flex-col">
          <h4 className="text-sm font-bold truncate hover:underline cursor-pointer">{currentTrack.name}</h4>
          <p className="text-[11px] text-zinc-400 truncate hover:underline cursor-pointer hover:text-white">{currentTrack.artist_name}</p>
        </div>
        <button 
          onClick={() => toggleFavorite(currentTrack)}
          className={`ml-2 hover:scale-110 transition-transform ${isFavorite ? 'text-brand-green' : 'text-zinc-400 hover:text-white'}`}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col items-center flex-1 max-w-[40%] gap-2">
        <div className="flex items-center gap-6 text-zinc-400">
          <button 
            onClick={() => setShuffle(!shuffle)}
            className={`hover:text-white transition-colors ${shuffle ? 'text-brand-green' : ''}`}
          >
            <Shuffle size={18} />
          </button>
          <button onClick={prev} className="hover:text-white transition-colors">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play className="ml-1" size={24} fill="currentColor" />}
          </button>
          <button onClick={next} className="hover:text-white transition-colors">
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => setRepeat(!repeat)}
            className={`hover:text-white transition-colors ${repeat ? 'text-brand-green' : ''}`}
          >
            <Repeat size={18} />
          </button>
        </div>

        <div className="w-full flex items-center gap-2 group">
          <span className="text-[11px] text-zinc-400 min-w-[30px] text-right">{formatTime(progress)}</span>
          <div className="flex-1 h-1 bg-zinc-800 rounded-full relative cursor-pointer group">
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-brand-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-colors"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max={duration || 100} 
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
          <span className="text-[11px] text-zinc-400 min-w-[30px]">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="flex items-center justify-end gap-3 w-[30%] text-zinc-400 relative">
        <button 
          onClick={() => setShowPlaylists(!showPlaylists)}
          className={`hover:text-white transition-colors ${showPlaylists ? 'text-brand-green' : ''}`}
          title="Add to playlist"
        >
          <ListMusic size={20} />
        </button>

        <AnimatePresence>
          {showPlaylists && (
            <PlaylistMenu 
              track={currentTrack}
              onClose={() => setShowPlaylists(false)}
              className="bottom-full right-0 mb-4"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 group w-24">
          {volume === 0 ? <VolumeX size={18} /> : volume < 0.5 ? <Volume1 size={18} /> : <Volume2 size={18} />}
          <div className="flex-1 h-1 bg-zinc-800 rounded-full relative cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-white group-hover:bg-brand-green rounded-full transition-colors"
              style={{ width: `${volume * 100}%` }}
            />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
        <button className="hover:text-white transition-colors">
          <Maximize2 size={18} />
        </button>
      </div>
    </footer>
  );
};

export default PlayerBar;
