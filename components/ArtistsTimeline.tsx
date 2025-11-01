"use client";

import TimelineArtistCard from "./TimelineArtistCard";

interface Artist {
  id?: string;
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
          <TimelineArtistCard
            key={item.timeRange}
            artist={item.artist}
            timeRange={item.timeRange}
            timeRangeLabel={getTimeRangeLabel(item.timeRange)}
            timeRangeDescription={getTimeRangeDescription(item.timeRange)}
            isLast={index === timeline.length - 1}
          />
        );
      })}
    </div>
  );
}
