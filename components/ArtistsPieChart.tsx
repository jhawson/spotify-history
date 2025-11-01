"use client";

import { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Artist {
  name: string;
  images: { url: string }[];
  followers: { total: number };
  popularity: number;
}

interface ArtistsPieChartProps {
  artists: Artist[];
}

export default function ArtistsPieChart({ artists }: ArtistsPieChartProps) {
  const topArtists = artists.slice(0, 20);

  const generateColors = (count: number) => {
    const colors = [
      "#FF6B6B", // Coral Red
      "#4ECDC4", // Turquoise
      "#FFE66D", // Golden Yellow
      "#A8E6CF", // Mint Green
      "#FF8B94", // Pink
      "#C7CEEA", // Lavender
      "#FFA07A", // Light Salmon
      "#98D8C8", // Seafoam
      "#F7DC6F", // Bright Yellow
      "#BB8FCE", // Purple
      "#FF6F91", // Bright Pink
      "#5DADE2", // Sky Blue
      "#F8B88B", // Peach
      "#85C1E2", // Light Blue
      "#FFB6B9", // Baby Pink
      "#95E1D3", // Aquamarine
      "#F9ED69", // Lemon Yellow
      "#B983FF", // Violet
      "#FDA7DF", // Orchid
      "#AAF683", // Lime Green
    ];
    return colors.slice(0, count);
  };

  const data = {
    labels: topArtists.map((artist) => artist.name),
    datasets: [
      {
        label: "Popularity",
        data: topArtists.map((artist) => artist.popularity),
        backgroundColor: generateColors(topArtists.length),
        borderColor: "#121212",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: "#FFFFFF",
          font: {
            size: 12,
          },
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "#282828",
        titleColor: "#FFFFFF",
        bodyColor: "#B3B3B3",
        borderColor: "#1DB954",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: ${value} popularity`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[500px]">
      <Pie data={data} options={options} />
    </div>
  );
}
