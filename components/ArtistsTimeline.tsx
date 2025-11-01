"use client";

interface Artist {
  name: string;
  images: { url: string }[];
  external_urls: {
    spotify: string;
  };
  popularity: number;
}

interface TimelineItem {
  timeRange: string;
  artist: Artist | null;
}

interface ArtistsTimelineProps {
  timeline: TimelineItem[];
}

const getTimeRangeLabel = (timeRange: string) => {
  switch (timeRange) {
    case "short_term":
      return "Last 4 Weeks";
    case "medium_term":
      return "Last 6 Months";
    case "long_term":
      return "Last Year";
    default:
      return timeRange;
  }
};

const getTimeRangeDescription = (timeRange: string) => {
  switch (timeRange) {
    case "short_term":
      return "Your most recent favorite";
    case "medium_term":
      return "Your seasonal obsession";
    case "long_term":
      return "Your all-time top artist";
    default:
      return "";
  }
};

export default function ArtistsTimeline({ timeline }: ArtistsTimelineProps) {
  return (
    <div className="space-y-6">
      {timeline.map((item, index) => {
        if (!item.artist) return null;

        return (
          <div key={item.timeRange} className="relative">
            {/* Timeline connector */}
            {index < timeline.length - 1 && (
              <div className="absolute left-16 top-24 w-0.5 h-16 bg-gradient-to-b from-gray-600 to-transparent" />
            )}

            <a
              href={item.artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start space-x-6 bg-gray-800/30 rounded-xl p-6 hover:bg-gray-700/40 transition-all duration-300 group"
            >
              {/* Artist Image */}
              <div className="relative flex-shrink-0">
                <div className="w-32 h-32 rounded-lg overflow-hidden ring-2 ring-gray-700 group-hover:ring-gray-500 transition-all duration-300">
                  {item.artist.images[0] && (
                    <img
                      src={item.artist.images[0].url}
                      alt={item.artist.name}
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
                      {item.artist.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {getTimeRangeDescription(item.timeRange)}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {getTimeRangeLabel(item.timeRange)}
                    </span>
                  </div>
                </div>

                {/* Popularity Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                    <span>Popularity</span>
                    <span className="font-semibold">{item.artist.popularity}/100</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${item.artist.popularity}%` }}
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
      })}
    </div>
  );
}
