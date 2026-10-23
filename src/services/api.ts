import { Track } from "../types";

export const api = {
  getTracks: async (params: any = {}): Promise<Track[]> => {
    try {
      const response = await fetch('/api/tracks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Deezer chart returns tracks in data.tracks.data
      const tracks = data.tracks?.data || [];
      
      return tracks.map((track: any) => ({
        id: track.id.toString(),
        name: track.title,
        artist_name: track.artist.name,
        album_name: track.album.title,
        album_image: track.album.cover_big || track.album.cover_medium || `https://picsum.photos/seed/${track.id}/300/300`,
        audio: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error("Error fetching trending tracks:", error);
      return [];
    }
  },
  
  searchTracks: async (query: string): Promise<Track[]> => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      // Deezer search returns tracks in data.data
      const tracks = data.data || [];
      
      return tracks.map((track: any) => ({
        id: track.id.toString(),
        name: track.title,
        artist_name: track.artist.name,
        album_name: track.album.title,
        album_image: track.album.cover_big || track.album.cover_medium || `https://picsum.photos/seed/${track.id}/300/300`,
        audio: track.preview,
        duration: track.duration,
      }));
    } catch (error) {
      console.error("Error searching tracks:", error);
      return [];
    }
  }
};
