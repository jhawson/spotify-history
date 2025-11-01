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

interface TimelineArtistCardProps {
  artist: Artist;
  timeRange: string;
  timeRangeLabel: string;
  timeRangeDescription: string;
  isLast: boolean;
}

export default function TimelineArtistCard({
  artist,
  timeRange,
  timeRangeLabel,
  timeRangeDescription,
  isLast,
}: TimelineArtistCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [trackUri, setTrackUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { playTrack, pausePlayback, isReady } = useSpotifyPlayer();

  const fetchTrack = async () => {
    if (!artist.id || trackUri || isLoading) return;

    console.log(`[Timeline] Fetching track for ${artist.name} (ID: ${artist.id})`);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/spotify/artist-tracks?artistId=${artist.id}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`[Timeline] Track URI for ${artist.name}:`, data.uri);
        setTrackUri(data.uri);

        // Play the track
        if (data.uri && isReady) {
          console.log(`[Timeline] Playing track: ${data.name} by ${data.artistName}`);
          await playTrack(data.uri);
        } else if (!isReady) {
          console.warn("[Timeline] Player not ready yet");
        }
      } else {
        const errorData = await response.json();
        console.error(`[Timeline] API error for ${artist.name}:`, errorData);
      }
    } catch (err) {
      console.error("[Timeline] Failed to fetch track:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);

    hoverTimeoutRef.current = setTimeout(() => {
      if (trackUri && isReady) {
        console.log(`[Timeline] Playing cached track for ${artist.name}`);
        playTrack(trackUri).catch((err) => {
          console.error("[Timeline] Playback failed:", err);
        });
      } else {
        fetchTrack();
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    pausePlayback();
  };

  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-16 top-24 w-0.5 h-16 bg-gradient-to-b from-gray-600 to-transparent" />
      )}

      <a
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start space-x-6 bg-gray-800/30 rounded-xl p-6 hover:bg-gray-700/40 transition-all duration-300 group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Playing indicator */}
        {isHovering && isReady && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 z-10">
            <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="w-1 h-4 bg-green-500 rounded animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="w-1 h-3 bg-green-500 rounded animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        )}

        {/* Artist Image */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 rounded-lg overflow-hidden ring-2 ring-gray-700 group-hover:ring-green-500 transition-all duration-300">
            {artist.images[0] && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
          {/* Timeline dot */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 ring-4 ring-gray-900" />
        </div>

        {/* Artist Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-400">{timeRangeDescription}</p>
            </div>
            <div className="flex-shrink-0 ml-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {timeRangeLabel}
              </span>
            </div>
          </div>

          {/* Popularity Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span>Popularity</span>
              <span className="font-semibold">{artist.popularity}/100</span>
            </div>
            <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                style={{ width: `${artist.popularity}%` }}
              />
            </div>
          </div>

          {/* External link indicator */}
          <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Open in Spotify
          </div>
        </div>
      </a>
    </div>
  );
}
