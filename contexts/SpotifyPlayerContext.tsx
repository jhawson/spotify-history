"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";

interface SpotifyPlayerContextType {
  player: Spotify.Player | null;
  deviceId: string | null;
  isReady: boolean;
  currentTrack: Spotify.Track | null;
  isPaused: boolean;
  playTrack: (uri: string) => Promise<void>;
  pausePlayback: () => void;
  resumePlayback: () => void;
}

const SpotifyPlayerContext = createContext<SpotifyPlayerContextType | null>(null);

export function useSpotifyPlayer() {
  const context = useContext(SpotifyPlayerContext);
  if (!context) {
    throw new Error("useSpotifyPlayer must be used within SpotifyPlayerProvider");
  }
  return context;
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: typeof Spotify;
  }
}

export function SpotifyPlayerProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (!session?.accessToken || initializingRef.current) return;

    const initializePlayer = () => {
      if (!window.Spotify) {
        console.log("[Player] Spotify SDK not loaded yet, waiting...");
        return;
      }

      console.log("[Player] Initializing Spotify Web Playback SDK");
      initializingRef.current = true;

      const spotifyPlayer = new window.Spotify.Player({
        name: "Spotify History Visualizer",
        getOAuthToken: (cb) => {
          cb(session.accessToken as string);
        },
        volume: 0.5,
      });

      // Error handling
      spotifyPlayer.addListener("initialization_error", ({ message }) => {
        console.error("[Player] Initialization Error:", message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }) => {
        console.error("[Player] Authentication Error:", message);
      });

      spotifyPlayer.addListener("account_error", ({ message }) => {
        console.error("[Player] Account Error:", message);
      });

      spotifyPlayer.addListener("playback_error", ({ message }) => {
        console.error("[Player] Playback Error:", message);
      });

      // Ready
      spotifyPlayer.addListener("ready", ({ device_id }) => {
        console.log("[Player] Ready with Device ID:", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      // Not Ready
      spotifyPlayer.addListener("not_ready", ({ device_id }) => {
        console.log("[Player] Device ID has gone offline:", device_id);
        setIsReady(false);
      });

      // Player state changed
      spotifyPlayer.addListener("player_state_changed", (state) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);

        console.log("[Player] State changed:", {
          track: state.track_window.current_track.name,
          paused: state.paused,
        });
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    // Wait for Spotify SDK to be ready
    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    return () => {
      if (player) {
        console.log("[Player] Disconnecting player");
        player.disconnect();
      }
    };
  }, [session?.accessToken]);

  const playTrack = async (uri: string) => {
    if (!deviceId || !session?.accessToken) {
      console.error("[Player] Cannot play: missing deviceId or accessToken");
      return;
    }

    try {
      console.log("[Player] Playing track:", uri);
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            uris: [uri],
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Player] Play error:", response.status, errorText);
      }
    } catch (error) {
      console.error("[Player] Failed to play track:", error);
    }
  };

  const pausePlayback = () => {
    if (player) {
      player.pause();
    }
  };

  const resumePlayback = () => {
    if (player) {
      player.resume();
    }
  };

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        deviceId,
        isReady,
        currentTrack,
        isPaused,
        playTrack,
        pausePlayback,
        resumePlayback,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
}
