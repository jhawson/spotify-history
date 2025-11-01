"use client";

import { useSpotifyPlayer } from "@/contexts/SpotifyPlayerContext";

export default function SpotifyPlayerControls() {
  const { currentTrack, isPaused, isReady, pausePlayback, resumePlayback } = useSpotifyPlayer();

  if (!isReady) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full"></div>
            <span>Initializing Spotify Player...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {currentTrack ? (
            <>
              {currentTrack.album.images[0] && (
                <img
                  src={currentTrack.album.images[0].url}
                  alt={currentTrack.album.name}
                  className="w-14 h-14 rounded shadow-lg"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold truncate">
                  {currentTrack.name}
                </div>
                <div className="text-gray-400 text-sm truncate">
                  {currentTrack.artists.map((artist: { name: string }) => artist.name).join(", ")}
                </div>
              </div>
            </>
          ) : (
            <div className="text-gray-400 text-sm">
              Hover over an artist to start playback
            </div>
          )}
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-4">
          {currentTrack && (
            <button
              onClick={isPaused ? resumePlayback : pausePlayback}
              className="p-3 rounded-full bg-white hover:bg-gray-200 text-black transition-colors"
              aria-label={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Spotify Logo */}
        <div className="flex items-center justify-end flex-1 min-w-0">
          <div className="flex items-center space-x-2 text-gray-400 text-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>Playing on Spotify</span>
          </div>
        </div>
      </div>
    </div>
  );
}
