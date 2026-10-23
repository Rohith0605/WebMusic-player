export interface Track {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  audio: string;
  duration: number;
  releasedate?: string;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Track[];
}
