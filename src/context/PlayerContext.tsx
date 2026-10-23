import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";
import { Track } from "../types";
import { get, set } from "idb-keyval";
import { motion, AnimatePresence } from "motion/react";

interface PlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  play: (track: Track) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  volume: number;
  setVolume: (v: number) => void;
  progress: number;
  duration: number;
  seek: (p: number) => void;
  queue: Track[];
  setQueue: (q: Track[]) => void;
  shuffle: boolean;
  setShuffle: (s: boolean) => void;
  repeat: boolean;
  setRepeat: (r: boolean) => void;
  favorites: string[];
  favoriteTracks: Track[];
  toggleFavorite: (track: Track) => void;
  history: Track[];
  playlists: any[];
  addPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: number, track: Track) => void;
  removeFromPlaylist: (playlistId: number, trackId: string) => void;
  deletePlaylist: (playlistId: number) => void;
  localSongs: Track[];
  addLocalSong: (song: Track) => void;
  removeLocalSong: (id: string) => void;
  notification: { message: string; type: 'success' | 'error' } | null;
  notify: (message: string, type?: 'success' | 'error') => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [queue, setQueue] = useState<Track[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  
  const safeParse = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return fallback;
    }
  };

  const [favorites, setFavorites] = useState<string[]>(safeParse("favorites", []));
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [history, setHistory] = useState<Track[]>(safeParse("recent_history", []));
  const [localSongs, setLocalSongs] = useState<Track[]>([]); // Initialize empty then load from IDB
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const soundRef = useRef<Howl | null>(null);
  const progressInterval = useRef<any>(null);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadFromIDB = async () => {
      try {
        const storedSongs = await get<Track[]>("local_songs_idb");
        if (storedSongs) setLocalSongs(storedSongs);

        const storedFavorites = await get<Track[]>("favorite_tracks_idb");
        if (storedFavorites) setFavoriteTracks(storedFavorites);

        const storedPlaylists = await get<any[]>("playlists_idb");
        if (storedPlaylists) {
          setPlaylists(storedPlaylists);
        } else {
          // Migration from localStorage
          const legacy = localStorage.getItem("playlists");
          if (legacy) {
            const parsed = JSON.parse(legacy);
            setPlaylists(parsed);
            await set("playlists_idb", parsed);
          }
        }
      } catch (err) {
        console.error("IndexedDB Load Error:", err);
      }
    };
    loadFromIDB();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (e) {
      console.warn("Storage for favorites is full", e);
    }
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem("recent_history", JSON.stringify(history));
    } catch (e) {
      console.warn("Storage for history is full", e);
    }
  }, [history]);

  // Sync to IDB whenever localSongs changes
  useEffect(() => {
    if (localSongs.length > 0) {
      set("local_songs_idb", localSongs).catch(err => console.error("IDB Sync Error:", err));
    }
  }, [localSongs]);

  useEffect(() => {
    if (favoriteTracks.length > 0) {
      set("favorite_tracks_idb", favoriteTracks).catch(err => console.error("IDB Sync Error:", err));
    }
  }, [favoriteTracks]);

  useEffect(() => {
    set("playlists_idb", playlists).catch(err => console.error("IDB Sync Error:", err));
  }, [playlists]);

  const addLocalSong = (song: Track) => {
    setLocalSongs(prev => [...prev, song]);
  };

  const removeLocalSong = (id: string) => {
    setLocalSongs(prev => prev.filter(s => s.id !== id));
  };

  const toggleFavorite = (track: Track) => {
    if (favorites.includes(track.id)) {
      setFavorites(prev => prev.filter(id => id !== track.id));
      setFavoriteTracks(prev => prev.filter(t => t.id !== track.id));
      notify("Removed from favorites");
    } else {
      setFavorites(prev => [...prev, track.id]);
      setFavoriteTracks(prev => [track, ...prev]);
      notify("Added to favorite tracks");
    }
  };

  const addPlaylist = (name: string, initialTrack?: Track) => {
    const newPlaylist = { 
      id: Date.now(), 
      name, 
      songs: initialTrack ? [initialTrack] : [] 
    };
    setPlaylists(prev => [...prev, newPlaylist]);
    
    if (initialTrack) {
      notify(`Created and added to "${name}"`);
    } else {
      notify(`Playlist "${name}" created`);
    }
  };

  const deletePlaylist = (playlistId: number) => {
    const pl = playlists.find(p => p.id === playlistId);
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    if (pl) notify(`Playlist "${pl.name}" deleted`);
  };

  const addToPlaylist = (playlistId: number, track: Track) => {
    let alreadyExists = false;
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        if (p.songs.some((s: Track) => s.id === track.id)) {
          alreadyExists = true;
          return p;
        }
        return { ...p, songs: [...p.songs, track] };
      }
      return p;
    }));

    if (alreadyExists) {
      notify("Song is already in this playlist", "error");
    } else {
      const pl = playlists.find(p => p.id === playlistId);
      notify(`Added to ${pl?.name || 'playlist'}`);
    }
  };

  const removeFromPlaylist = (playlistId: number, trackId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songs: p.songs.filter((s: Track) => s.id !== trackId) };
      }
      return p;
    }));
    notify("Removed from playlist");
  };

  const play = (track: Track) => {
    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.unload();
    }

    setHistory(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 20);
    });

    const isBase64 = track.audio.startsWith('data:');

    const sound = new Howl({
      src: [track.audio],
      html5: !isBase64, // Streaming for URLs, memory for Base64 (more stable)
      volume: volume,
      onplay: () => {
        setIsPlaying(true);
        setDuration(sound.duration());
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => {
        if (repeat) {
          sound.play();
        } else {
          next();
        }
      },
      onload: () => setDuration(sound.duration()),
      onloaderror: (id, err) => {
        console.error("Howl Load Error:", err);
        setIsPlaying(false);
        // Optionally show a notification
      },
      onplayerror: (id, err) => {
        console.error("Howl Play Error:", err);
        setIsPlaying(false);
        sound.unlock();
      }
    });

    soundRef.current = sound;
    setCurrentTrack(track);
    sound.play();
  };

  const togglePlay = () => {
    if (!soundRef.current) return;
    if (isPlaying) {
      soundRef.current.pause();
    } else {
      soundRef.current.play();
    }
  };

  const next = () => {
    if (queue.length === 0) return;
    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    let nextIndex = currentIndex + 1;
    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    }
    if (nextIndex >= queue.length) nextIndex = 0;
    play(queue[nextIndex]);
  };

  const prev = () => {
    if (queue.length === 0) return;
    const currentIndex = currentTrack ? queue.findIndex(t => t.id === currentTrack.id) : -1;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = queue.length - 1;
    play(queue[prevIndex]);
  };

  const seek = (val: number) => {
    if (!soundRef.current) return;
    soundRef.current.seek(val);
    setProgress(val);
  };

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        if (soundRef.current) {
          setProgress(soundRef.current.seek());
        }
      }, 1000);
    } else {
      clearInterval(progressInterval.current);
    }
    return () => clearInterval(progressInterval.current);
  }, [isPlaying]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, play, togglePlay, next, prev, 
      volume, setVolume, progress, duration, seek,
      queue, setQueue, shuffle, setShuffle, repeat, setRepeat,
      favorites, toggleFavorite, history, favoriteTracks,
      playlists, addPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist,
      localSongs, addLocalSong, removeLocalSong,
      notification, notify
    }}>
      {children}
      
      {/* Global Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              notification.type === 'error' 
                ? 'bg-rose-500/90 border-rose-400 text-white' 
                : 'bg-brand-green/90 border-brand-green/50 text-black font-bold'
            }`}
          >
            {notification.type === 'error' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )}
            <span className="text-sm">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error("usePlayer must be used within PlayerProvider");
  return context;
};
