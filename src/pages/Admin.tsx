import React, { useState } from "react";
import { Upload, Trash2, Plus, Music, HardDrive, Edit3, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Track } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { usePlayer } from "../context/PlayerContext";

const Admin: React.FC = () => {
  const { localSongs, addLocalSong, removeLocalSong } = usePlayer();
  const [showAdd, setShowAdd] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [newSong, setNewSong] = useState<Partial<Track>>({
    name: "",
    artist_name: "",
    album_name: "",
    audio: "",
    album_image: ""
  });

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'audio' | 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size for audio to 10MB
    if (type === 'audio' && file.size > 10 * 1024 * 1024) {
      showFeedback('error', "Audio file too large. Please use a file smaller than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setFeedback(null);
    
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.onload = (event) => {
      const result = event.target?.result as string;
      
      // Basic check for corrupted or empty result
      if (!result || result.length < 100) {
        showFeedback('error', "The file appears to be corrupted or invalid.");
        setIsUploading(false);
        return;
      }

      if (type === 'audio') {
        setNewSong(prev => ({ ...prev, audio: result }));
        showFeedback('success', "Audio processed. Ready to save!");
      } else {
        setNewSong(prev => ({ ...prev, album_image: result }));
        showFeedback('success', "Artwork processed!");
      }
      setIsUploading(false);
      setUploadProgress(100);
    };

    reader.onerror = () => {
      showFeedback('error', "Browser failed to read the file. Try a different browser or smaller file.");
      setIsUploading(false);
    };

    // Use a small delay to ensure UI updates before heavy reading
    setTimeout(() => {
      reader.readAsDataURL(file);
    }, 100);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.audio) {
      showFeedback('error', "Please select an audio file first.");
      return;
    }

    try {
      const song: Track = {
        id: `local_${Date.now()}`,
        name: newSong.name || "Untitled",
        artist_name: newSong.artist_name || "Unknown Artist",
        album_name: newSong.album_name || "Custom Album",
        audio: newSong.audio || "",
        album_image: newSong.album_image || "https://picsum.photos/300/300",
        duration: 0
      };
      addLocalSong(song);
      setNewSong({ name: "", artist_name: "", album_name: "", audio: "", album_image: "" });
      setShowAdd(false);
      showFeedback('success', "Song added to your library!");
    } catch (err) {
      showFeedback('error', "Storage limit reached. Try a smaller file.");
    }
  };

  return (
    <div className="pb-32 max-w-5xl mx-auto px-4">
      <AnimatePresence>
        {feedback && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl ${
              feedback.type === 'success' ? 'bg-brand-green text-black' : 'bg-rose-500 text-white'
            }`}
          >
            {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-bold">{feedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-10 mt-8">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Music Manager</h1>
          <p className="text-zinc-400 font-medium">Add and manage your personal music collection.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-brand-green text-black px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus size={20} />
          {showAdd ? "Cancel" : "Add Song"}
        </button>
      </div>

      {showAdd && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-zinc-900/40 border border-white/10 rounded-3xl p-8 mb-10 shadow-2xl backdrop-blur-sm"
        >
          <div className="mb-6 p-4 bg-brand-green/10 border border-brand-green/20 rounded-xl text-brand-green text-sm flex items-center gap-3">
            <Upload size={18} />
            <p>Note: We've upgraded storage to <b>IndexedDB</b>! You can now upload many songs up to 10MB each without hitting browser limits (typical capacity is 500MB+).</p>
          </div>

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 ml-1">Song Title</label>
                <input 
                  required
                  type="text" 
                  value={newSong.name}
                  onChange={e => setNewSong({...newSong, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-colors text-white"
                  placeholder="Enter track name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 ml-1">Artist Name</label>
                <input 
                  required
                  type="text" 
                  value={newSong.artist_name}
                  onChange={e => setNewSong({...newSong, artist_name: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-brand-green transition-colors text-white"
                  placeholder="Enter artist name"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 ml-1">Audio File (MP3)</label>
                <div className="flex flex-col gap-3">
                  <label className="cursor-pointer">
                    <div className={`w-full bg-black/40 border rounded-xl px-4 py-4 transition-all flex items-center justify-center gap-3 ${
                      newSong.audio ? 'border-brand-green text-brand-green bg-brand-green/5' : 'border-white/10 text-zinc-400 hover:border-brand-green'
                    }`}>
                      {isUploading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <Music size={20} />
                      )}
                      <span className="text-sm font-bold truncate">
                        {isUploading ? `Reading: ${uploadProgress}%` : newSong.audio ? "Audio Selected ✓" : "Choose MP3 File"}
                      </span>
                    </div>
                    <input 
                      type="file" 
                      accept="audio/mpeg,audio/mp3"
                      onChange={(e) => handleFileChange(e, 'audio')}
                      className="hidden"
                    />
                  </label>
                  {isUploading && (
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-green transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3 ml-1">Album Cover</label>
                <div className="flex flex-col gap-4">
                  <div className="w-full h-52 bg-black/40 border border-dashed border-white/20 rounded-2xl flex items-center justify-center overflow-hidden transition-all hover:border-brand-green/50">
                    {newSong.album_image ? (
                      <img src={newSong.album_image} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <div className="text-center text-zinc-500 px-6">
                        <Upload className="mx-auto mb-3 opacity-30" size={32} />
                        <span className="text-xs font-medium block">Click below to upload artwork</span>
                      </div>
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center text-sm font-black text-white hover:bg-white/10 transition-colors uppercase tracking-wider">
                      Pick Image
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <button 
                disabled={isUploading || !newSong.audio}
                className="w-full bg-brand-green text-black py-4 rounded-xl font-black mt-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                {isUploading ? "Processing..." : "Complete Upload"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-surface-zinc-900/40 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="px-8 py-5 border-b border-white/10 bg-white/5 flex items-center gap-4">
          <div className="p-2 bg-brand-green/20 text-brand-green rounded-lg">
            <HardDrive size={22} />
          </div>
          <div>
            <h2 className="font-bold text-lg">Managed Library</h2>
            <p className="text-xs text-zinc-500 font-medium tracking-wide uppercase">Local Persistence Layer</p>
          </div>
          <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-black rounded-full border border-brand-green/20 ml-auto mr-2">
            Spark Tier
          </span>
        </div>
        
        {localSongs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase font-black text-zinc-500 border-b border-white/5 tracking-widest">
                  <th className="px-8 py-5">Track Information</th>
                  <th className="px-8 py-5">Album</th>
                  <th className="px-8 py-5 text-right w-32">Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {localSongs.map((song) => (
                  <tr key={song.id} className="hover:bg-white/5 group transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden shadow-lg flex-shrink-0">
                          <img src={song.album_image} className="w-full h-full object-cover" alt={song.name} />
                        </div>
                        <div className="min-w-0">
                          <span className="block font-bold text-base text-white truncate">{song.name}</span>
                          <span className="block text-sm text-zinc-500 font-bold truncate">{song.artist_name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors uppercase tracking-tight">
                        {song.album_name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                        <button className="p-2.5 text-zinc-500 hover:text-white bg-white/5 rounded-full transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button 
                          onClick={() => removeLocalSong(song.id)}
                          className="p-2.5 text-zinc-500 hover:text-rose-500 bg-white/5 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-500">
            <div className="mb-6 relative inline-block">
              <Music className="mx-auto opacity-10" size={80} />
              <div className="absolute inset-0 bg-brand-green/20 blur-3xl rounded-full" />
            </div>
            <p className="font-black text-xl text-zinc-400 mb-2">No custom tracks identified.</p>
            <p className="text-sm font-medium opacity-50 px-8">Upload MP3 files to build your persistent local library tier.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
