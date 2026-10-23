import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Heart, ListMusic, Settings, Mic2, PlusSquare, Music } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Search", href: "/search" },
  ];

  const libraryItems = [
    { icon: Heart, label: "Favorites", href: "/favorites" },
    { icon: ListMusic, label: "Playlists", href: "/playlists" },
    { icon: Settings, label: "Admin", href: "/admin" },
  ];

  return (
    <div className="w-64 bg-black flex flex-col h-full p-6 text-text-zinc-400 flex-shrink-0">
      <div className="flex items-center gap-2 text-white mb-8 px-2 group cursor-pointer">
        <Music size={32} className="text-brand-green" />
        <span className="text-2xl font-bold tracking-tight">Web-Music</span>
      </div>

      <nav className="space-y-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={cn(
                  "flex items-center gap-4 py-2 px-3 rounded-lg font-bold nav-item-hover",
                  location.pathname === item.href && "nav-item-active"
                )}
              >
                <item.icon size={24} fill={location.pathname === item.href ? "currentColor" : "none"} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="pt-4">
          <p className="px-3 text-xs uppercase font-bold text-text-zinc-500 tracking-widest mb-4">Library</p>
          <ul className="space-y-1">
            {libraryItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 py-2 px-3 rounded-lg font-bold nav-item-hover",
                    location.pathname === item.href && "nav-item-active"
                  )}
                >
                  <item.icon size={24} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        <p className="px-3 text-xs font-bold text-text-zinc-500 uppercase tracking-widest">Genres</p>
        <div className="flex flex-col gap-3 text-sm text-text-zinc-400 font-medium px-3">
          <Link to="/search?q=Pop" className="hover:text-white transition-colors">Pop</Link>
          <Link to="/search?q=Electronic" className="hover:text-white transition-colors">Electronic</Link>
          <Link to="/search?q=Hip Hop" className="hover:text-white transition-colors">Hip Hop</Link>
          <Link to="/search?q=Rock" className="hover:text-white transition-colors">Rock</Link>
          <Link to="/search?q=Jazz" className="hover:text-white transition-colors">Jazz</Link>
        </div>
        
        <div className="h-[1px] bg-zinc-800 w-full mt-4"></div>

        <p className="px-3 text-xs font-bold text-text-zinc-500 uppercase tracking-widest mt-2">Personal</p>
        <button 
          onClick={() => window.location.href = '/favorites'}
          className="flex items-center gap-4 px-3 text-text-zinc-400 font-bold hover:text-white transition-all group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-700 to-blue-300 flex items-center justify-center rounded-sm">
            <Heart size={16} fill="currentColor" className="text-white" />
          </div>
          <span>Liked Songs</span>
        </button>
        <Link 
          to="/playlists"
          className="flex items-center gap-4 px-3 text-text-zinc-400 font-bold hover:text-white transition-all group"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-brand-green to-emerald-900 flex items-center justify-center rounded-sm">
            <ListMusic size={16} className="text-white" />
          </div>
          <span>Playlists</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
