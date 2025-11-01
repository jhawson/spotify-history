import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Spotify API only supports short_term (4 weeks), medium_term (6 months), and long_term (~1 year)
    // We'll fetch multiple time ranges to simulate a timeline
    const timeRanges = ["short_term", "medium_term", "long_term"];
    const results = await Promise.all(
      timeRanges.map(async (range) => {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/artists?time_range=${range}&limit=1`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch top artists for ${range}`);
        }

        const data = await response.json();
        return {
          timeRange: range,
          artist: data.items[0] || null,
        };
      })
    );

    return NextResponse.json({ timeline: results });
  } catch (error) {
    console.error("Error fetching top artists timeline:", error);
    return NextResponse.json(
      { error: "Failed to fetch top artists timeline" },
      { status: 500 }
    );
  }
}
