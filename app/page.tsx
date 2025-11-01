"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import ArtistsTimeline from "@/components/ArtistsTimeline";
import ArtistCard from "@/components/ArtistCard";
import SpotifyPlayerControls from "@/components/SpotifyPlayerControls";

interface Artist {
  id?: string;
  external_urls: {
    spotify: string;
  };
  name: string;
  images: { url: string }[];
  followers: { total: number };
  popularity: number;
}

interface TimelineItem {
  timeRange: string;
  artist: Artist | null;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetchTopArtists();
      fetchTimeline();
    }
  }, [session]);

  const fetchTopArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/spotify/top-artists");
      if (!response.ok) {
        throw new Error("Failed to fetch artists");
      }
      const data = await response.json();
      setArtists(data.items);
    } catch (err) {
      setError("Failed to load your top artists. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async () => {
    setTimelineLoading(true);
    try {
      const response = await fetch("/api/spotify/top-artists-timeline");
      if (!response.ok) {
        throw new Error("Failed to fetch timeline");
      }
      const data = await response.json();
      setTimeline(data.timeline);
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setTimelineLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Spotify Listening History
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Visualize your top artists from the past year
          </p>
          <button
            onClick={() => signIn("spotify")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-200"
          >
            Sign in with Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Your Top Artists
              </h1>
              <p className="text-gray-400">
                Based on your listening history from the past year
              </p>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-xl">Loading your top artists...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Timeline Section */}
        {session && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your Top Artist Over Time
            </h2>
            <p className="text-gray-400 mb-8">
              See how your favorite artist has changed over different time periods
            </p>

            {timelineLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-white text-lg">Loading timeline...</div>
              </div>
            )}

            {!timelineLoading && timeline.length > 0 && (
              <ArtistsTimeline timeline={timeline} />
            )}

            {!timelineLoading && timeline.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No timeline data available
              </div>
            )}
          </div>
        )}

        {!loading && !error && artists.length > 0 && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-2">
              Your Top 20 Artists
            </h2>
            <p className="text-gray-400 mb-6">
              Ranked by your listening history from the past year
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {artists.slice(0, 20).map((artist, index) => (
                <ArtistCard key={artist.id || artist.name} artist={artist} index={index} />
              ))}
            </div>
          </div>
        )}

        {!loading && !error && artists.length === 0 && session && (
          <div className="text-center text-gray-400 py-12">
            No listening history found. Start listening to music on Spotify!
          </div>
        )}
        </div>
      </div>
      <SpotifyPlayerControls />
    </>
  );
}
