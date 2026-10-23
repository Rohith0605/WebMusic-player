import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { Track } from "../types";
import SongCard from "../components/SongCard";
import { usePlayer } from "../context/PlayerContext";
import { Search as SearchIcon, Music2, SearchX, Sparkles, Filter, Mic2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const { setQueue } = usePlayer();

  useEffect(() => {
    if (query) {
      const search = async () => {
        setLoading(true);
        try {
          const tracks = await api.searchTracks(query);
          setResults(tracks);
          setQueue(tracks);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      search();
    }
  }, [query, setQueue]);

  return (
    <div className="pb-32 px-4">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-black mb-2 tracking-tight">
          {query ? (
            <span className="flex items-center gap-3">
              <SearchIcon className="text-brand-green" size={32} />
              Results for "{query}"
            </span>
          ) : "Search"}
        </h1>
        <p className="text-zinc-400 font-medium">Explore millions of tracks instantly with precise search.</p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-80 gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-brand-green/20 rounded-full" />
            <div className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
          </div>
          <p className="text-zinc-400 font-bold animate-pulse">Searching the catalog...</p>
        </div>
      ) : results.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        >
          {results.map((track) => (
            <SongCard key={track.id} track={track} />
          ))}
        </motion.div>
      ) : query ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto py-16 px-8 bg-zinc-900/40 rounded-3xl border border-white/5 text-center"
        >
          <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <SearchX size={48} className="text-rose-500" />
          </div>
          <h2 className="text-3xl font-black mb-4">No matches found</h2>
          <p className="text-zinc-400 mb-10 text-lg">We couldn't find any tracks for "<span className="text-white">{query}</span>". Try adjusting your search criteria.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-brand-green">
                <Sparkles size={18} />
                <h4 className="font-bold text-sm">Be specific</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Search for full artist names or song titles for more accurate results.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-indigo-400">
                <Filter size={18} />
                <h4 className="font-bold text-sm">Check spelling</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Ensure there are no typos in the artist, album, or track name.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-orange-400">
                <Music2 size={18} />
                <h4 className="font-bold text-sm">Genre names</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Try searching for broader genres like "Jazz", "Electronic", or "Pop".</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3 mb-2 text-rose-400">
                <Mic2 size={18} />
                <h4 className="font-bold text-sm">Artist first</h4>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">Try searching by artist name first, then browse their top tracks.</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-32 text-zinc-400 gap-6"
        >
          <div className="bg-zinc-900 p-8 rounded-full shadow-inner border border-white/5">
            <SearchIcon size={64} className="opacity-10" />
          </div>
          <div className="text-center">
            <p className="font-black text-2xl text-white mb-2">Ready to explore?</p>
            <p className="font-medium max-w-xs mx-auto text-sm text-zinc-500 leading-relaxed">
              Use the search bar at the top to find your favorite songs, artists, and albums.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Search;
