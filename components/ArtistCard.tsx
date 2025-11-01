"use client";

import { useState, useRef } from "react";
import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";

interface Artist {
  id?: string;
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export default function ArtistCard({ artist, index }: ArtistCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [trackUri, setTrackUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playTrack, pausePlayback, isReady } = useSpotifyPlayer();

  const fetchTrack = async () => {
    if (!artist.id || trackUri || isLoading) return;

    console.log(`[ArtistCard] Fetching track for ${artist.name} (ID: ${artist.id})`);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/spotify/artist-tracks?artistId=${artist.id}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[ArtistCard] Track URI for ${artist.name}:`, data.uri);
        setTrackUri(data.uri);

        // Play the track
        if (data.uri && isReady) {
          console.log(`[ArtistCard] Playing track: ${data.name} by ${data.artistName}`);
          await playTrack(data.uri);
        } else if (!isReady) {
          console.warn("[ArtistCard] Player not ready yet");
        }
      } else {
        const errorData = await response.json();
        console.error(`[ArtistCard] API error for ${artist.name}:`, errorData);
      }
    } catch (err) {
      console.error("[ArtistCard] Failed to fetch track:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);

    // Delay playback slightly to avoid accidental hovers
    hoverTimeoutRef.current = setTimeout(() => {
      if (trackUri && isReady) {
        console.log(`[ArtistCard] Playing cached track for ${artist.name}`);
        playTrack(trackUri).catch((err) => {
          console.error("[ArtistCard] Playback failed:", err);
        });
      } else {
        fetchTrack();
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    // Clear timeout if user leaves before playback starts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Pause playback
    pausePlayback();
  };

  return (
    <a
      href={artist.external_urls.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-600/50 transition-all duration-200 cursor-pointer relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Playing indicator */}
      {isHovering && isReady && (
        <div className="absolute top-2 right-2 flex items-center space-x-1">
          <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: "0ms" }} />
          <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: "150ms" }} />
          <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {artist.images[0] && (
        <img
          src={artist.images[0].url}
          alt={artist.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-transparent group-hover:ring-green-500/50 transition-all duration-200"
        />
      )}
      <div className="flex-1">
        <div className="text-sm text-gray-400">#{index + 1}</div>
        <div className="text-white font-semibold">{artist.name}</div>
        <div className="text-sm text-gray-400">
          Popularity: {artist.popularity}
        </div>
      </div>
    </a>
  );
}
