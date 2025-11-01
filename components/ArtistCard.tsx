"use client";

import { useState, useRef, useEffect } from "react";

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const fetchPreview = async () => {
    if (!artist.id || previewUrl || isLoading) return;

    console.log(`Fetching preview for ${artist.name} (ID: ${artist.id})`);
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/spotify/artist-top-track?artistId=${artist.id}`
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Preview URL for ${artist.name}:`, data.previewUrl);
        setPreviewUrl(data.previewUrl);

        // Play audio after fetching
        if (data.previewUrl && audioRef.current) {
          audioRef.current.src = data.previewUrl;
          audioRef.current.volume = 0.5; // Increased volume
          console.log(`Attempting to play preview for ${artist.name}`);
          audioRef.current.play()
            .then(() => {
              console.log(`Successfully playing ${artist.name}`);
            })
            .catch((err) => {
              console.error("Audio play failed:", err);
            });
        } else {
          console.log(`No preview URL available for ${artist.name}`);
        }
      } else {
        const errorData = await response.json();
        console.error(`API error for ${artist.name}:`, errorData);
      }
    } catch (err) {
      console.error("Failed to fetch preview:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);

    // Delay preview fetch/play slightly to avoid accidental hovers
    hoverTimeoutRef.current = setTimeout(() => {
      if (previewUrl && audioRef.current) {
        audioRef.current.volume = 0.5;
        console.log(`Playing cached preview for ${artist.name}`);
        audioRef.current.play()
          .then(() => {
            console.log(`Successfully playing cached ${artist.name}`);
          })
          .catch((err) => {
            console.error("Audio play failed:", err);
          });
      } else {
        fetchPreview();
      }
    }, 300);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);

    // Clear timeout if user leaves before preview starts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Pause audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      <a
        href={artist.external_urls.spotify}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-700/50 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-600/50 transition-all duration-200 cursor-pointer relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Playing indicator */}
        {isHovering && (
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
    </>
  );
}
