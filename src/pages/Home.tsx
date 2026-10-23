import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { Track } from "../types";
import SongCard from "../components/SongCard";
import { usePlayer } from "../context/PlayerContext";
import { Sparkles, Music, TrendingUp, Play } from "lucide-react";
import { motion } from "motion/react";

const Home: React.FC = () => {
  const [trending, setTrending] = useState<Track[]>([]);
  const [popTracks, setPopTracks] = useState<Track[]>([]);
  const [rockTracks, setRockTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const { setQueue, history, play, localSongs, favorites, playlists } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popData, rockData] = await Promise.all([
          api.getTracks(),
          api.searchTracks("Pop"),
          api.searchTracks("Rock"),
        ]);
        setTrending(trendingData);
        setPopTracks(popData.slice(0, 5));
        setRockTracks(rockData.slice(0, 5));
        setQueue(trendingData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setQueue]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-160px)]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="pb-32">
      <h2 className="text-3xl font-bold mb-6 tracking-tight">Good evening</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 mb-10">
        {trending.slice(0, 6).map((track) => (
          <div 
            key={`stat-${track.id}`}
            onClick={() => play(track)}
            className="stat-card flex items-center rounded overflow-hidden cursor-pointer group"
          >
            <div className="w-20 h-20 bg-zinc-700 shadow-xl flex-shrink-0">
              <img src={track.album_image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="px-4 font-bold flex-1 truncate">{track.name}</span>
            <button className="mr-4 w-12 h-12 bg-brand-green rounded-full shadow-lg items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hidden group-hover:flex">
              <Play className="text-black ml-1" size={24} fill="currentColor" />
            </button>
          </div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-green/20 to-black p-10 mb-12 border border-white/5"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-brand-green mb-4">
            <Sparkles size={18} />
            <span className="text-xs font-black uppercase tracking-widest text-brand-green">Recommended for you</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-6 tracking-tighter leading-none">Your Daily <br/> Rhythm.</h1>
          <button className="bg-brand-green text-black px-8 py-3 rounded-full font-bold hover:scale-105 active:scale-95 transition-transform flex items-center gap-2">
            <TrendingUp size={20} />
            Explore Trending
          </button>
        </div>
        <Music className="absolute -bottom-10 -right-10 w-80 h-80 text-white/5 -rotate-12" />
      </motion.div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold hover:underline cursor-pointer">Pop Hits</h3>
          <span className="text-zinc-400 text-sm font-bold hover:underline cursor-pointer">Show all</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popTracks.map((track) => (
            <SongCard key={`pop-${track.id}`} track={track} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold hover:underline cursor-pointer">Rock Classics</h3>
          <span className="text-zinc-400 text-sm font-bold hover:underline cursor-pointer">Show all</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {rockTracks.map((track) => (
            <SongCard key={`rock-${track.id}`} track={track} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold hover:underline cursor-pointer">Trending Now</h3>
          <span className="text-zinc-400 text-sm font-bold hover:underline cursor-pointer">Show all</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {trending.slice(0, 10).map((track) => (
            <SongCard key={`trend-${track.id}`} track={track} />
          ))}
        </div>
      </section>

      {localSongs.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold hover:underline cursor-pointer text-zinc-500">Your Uploads</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {localSongs.map((track) => (
              <SongCard key={`local-${track.id}`} track={track} />
            ))}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 text-zinc-500">
            <h3 className="text-2xl font-bold hover:underline cursor-pointer">Recently Played</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {history.slice(0, 5).map((track) => (
              <SongCard key={`hist-${track.id}`} track={track} />
            ))}
          </div>
        </section>
      )}

      {playlists.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4 text-zinc-500">
            <h3 className="text-2xl font-bold hover:underline cursor-pointer">From Your Playlists</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 opacity-80">
            {playlists[0].songs.slice(0, 5).map((track: Track) => (
              <SongCard key={`pl-${track.id}`} track={track} />
            ))}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className="mb-32">
          <div className="flex items-center justify-between mb-4 text-zinc-500">
            <h3 className="text-2xl font-bold hover:underline cursor-pointer">Your Favorites</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 opacity-70">
            {trending.filter(t => favorites.includes(t.id)).slice(0, 5).map((track) => (
              <SongCard key={`fav-${track.id}`} track={track} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
