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

    // Find first track with a preview URL
    const trackWithPreview = data.tracks.find((track: any) => track.preview_url);

    if (!trackWithPreview) {
      return NextResponse.json({ error: "No preview available" }, { status: 404 });
    }

    return NextResponse.json({
      previewUrl: trackWithPreview.preview_url,
      trackName: trackWithPreview.name,
    });
  } catch (error) {
    console.error("Error fetching artist top track:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist top track" },
      { status: 500 }
    );
  }
}
