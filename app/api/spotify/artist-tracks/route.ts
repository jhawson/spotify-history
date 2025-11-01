import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const artistId = searchParams.get("artistId");

  if (!artistId) {
    return NextResponse.json({ error: "Artist ID required" }, { status: 400 });
  }

  try {
    // Get artist's top tracks
    const response = await fetch(
      `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch artist top tracks");
    }

    const data = await response.json();

    // Return the first track (most popular)
    if (data.tracks && data.tracks.length > 0) {
      const track = data.tracks[0];
      return NextResponse.json({
        uri: track.uri,
        name: track.name,
        album: track.album.name,
        artistName: track.artists[0].name,
      });
    }

    return NextResponse.json({ error: "No tracks available" }, { status: 404 });
  } catch (error) {
    console.error("Error fetching artist tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist tracks" },
      { status: 500 }
    );
  }
}
