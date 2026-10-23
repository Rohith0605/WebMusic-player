import React, { useState } from "react";
import { Search, Bell, ChevronLeft, ChevronRight, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => navigate(1)} className="w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-black/60 transition-colors opacity-50">
            <ChevronRight size={20} />
          </button>
        </div>

        <form onSubmit={handleSearch} className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for artists, songs, or podcasts" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-black py-2 pl-10 pr-4 rounded-full text-sm font-medium outline-none"
          />
        </form>
      </div>

      <div className="flex items-center gap-4">
        {/* Actions removed as requested */}
      </div>
    </header>
  );
};

export default Header;
