import React, { useState, useRef, useEffect } from "react";
import { Plus, X, Check } from "lucide-react";
import { Track } from "../types";
import { usePlayer } from "../context/PlayerContext";
import { motion, AnimatePresence } from "motion/react";

interface PlaylistMenuProps {
  track: Track;
  onClose: () => void;
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

const PlaylistMenu: React.FC<PlaylistMenuProps> = ({ track, onClose, onRemove, removeLabel, className }) => {
  const { playlists, addToPlaylist, addPlaylist } = usePlayer();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    addPlaylist(newPlaylistName, track);
    setNewPlaylistName("");
    setIsAddingNew(false);
    onClose();
  };

  const handleAdd = (e: React.MouseEvent, playlistId: number) => {
    e.stopPropagation();
    addToPlaylist(playlistId, track);
    onClose();
  };

  return (
    <motion.div 
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className={`absolute w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden ${className}`}
    >
      <div className="p-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2">Playlist Options</span>
        <button onClick={onClose} className="hover:text-white text-zinc-500 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div className="max-h-64 overflow-y-auto custom-scrollbar">
        {onRemove && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); onClose(); }}
            className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-colors border-b border-white/5 flex items-center gap-2"
          >
            <X size={14} />
            {removeLabel || "Remove"}
          </button>
        )}

        {isAddingNew ? (
          <form onSubmit={handleCreateAndAdd} className="p-3 bg-white/5 border-b border-white/5">
            <input 
              autoFocus
              type="text" 
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-green mb-2"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-brand-green text-black font-bold py-1.5 rounded-md text-[10px] uppercase tracking-wider">Create</button>
              <button type="button" onClick={() => setIsAddingNew(false)} className="flex-1 bg-zinc-700 text-white font-bold py-1.5 rounded-md text-[10px] uppercase tracking-wider">Cancel</button>
            </div>
          </form>
        ) : (
          <button 
            onClick={(e) => { e.stopPropagation(); setIsAddingNew(true); }}
            className="w-full text-left px-4 py-3 text-xs font-black uppercase tracking-widest text-brand-green hover:bg-brand-green/10 transition-colors border-b border-white/5 flex items-center gap-2"
          >
            <Plus size={14} />
            New Playlist
          </button>
        )}

        {playlists.length > 0 ? (
          playlists.map((pl) => {
            const alreadyIn = pl.songs.some((s: Track) => s.id === track.id);
            return (
              <button 
                key={pl.id}
                disabled={alreadyIn}
                onClick={(e) => handleAdd(e, pl.id)}
                className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between transition-colors ${alreadyIn ? 'opacity-50 cursor-default text-zinc-500' : 'hover:bg-white/5'}`}
              >
                <span className="truncate">{pl.name}</span>
                {alreadyIn && <Check size={14} className="text-brand-green" />}
              </button>
            );
          })
        ) : !isAddingNew && (
          <div className="p-4 text-[11px] text-zinc-500 text-center italic">
            No playlists yet.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlaylistMenu;
