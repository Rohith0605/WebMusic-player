import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import PlayerBar from "./PlayerBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-black overflow-hidden selection:bg-brand-green selection:text-black">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 main-gradient">
        <Header />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Layout;
