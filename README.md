# Spotify Listening History Visualizer

A Next.js application that visualizes your Spotify listening history with a beautiful pie chart showing your top artists from the past year.

## Features

- OAuth authentication with Spotify
- Fetches your top 50 artists from the past year
- Interactive pie chart visualization of top 10 artists
- Artist cards displaying artist images and popularity scores
- Responsive design with a dark Spotify-inspired theme

## Prerequisites

- Node.js 18+ installed
- A Spotify account
- Spotify Developer credentials (Client ID and Client Secret)

## Setup Instructions

### 1. Create a Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - App Name: "Spotify History Visualizer" (or any name you prefer)
   - App Description: "Visualize my listening history"
   - Redirect URI: `http://127.0.0.1:3000/api/auth/callback/spotify`
   - Check the agreement boxes
5. Click "Save"
6. You'll see your Client ID on the app page
7. Click "Show Client Secret" to reveal your Client Secret
8. Copy both values for the next step

### 2. Configure Environment Variables

The `.env.local` file has been created for you with your Spotify credentials already added. Make sure the Redirect URI in your Spotify app is set correctly.

**Important:** The Redirect URI in your Spotify app MUST be exactly:
```
http://127.0.0.1:3000/api/auth/callback/spotify
```

### 3. Install Dependencies

Dependencies are already installed, but if needed:

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

## Usage

1. Click "Sign in with Spotify" on the home page
2. Authorize the app to access your Spotify data
3. View your top artists displayed in a pie chart
4. See your top 10 artists with their images and popularity scores

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Authentication:** NextAuth.js with Spotify provider
- **Charts:** Chart.js with react-chartjs-2
- **Styling:** Tailwind CSS
- **API:** Spotify Web API

## API Endpoints

- `GET /api/auth/[...nextauth]` - NextAuth authentication endpoints
- `GET /api/spotify/top-artists` - Fetches user's top 50 artists from Spotify

## Spotify API Scopes

The app requests the following scopes:
- `user-top-read` - Read your top artists and tracks
- `user-read-email` - Read your email address

## Project Structure

```
spotify-viz/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   │   └── route.ts          # NextAuth configuration
│   │   └── spotify/
│   │       └── top-artists/
│   │           └── route.ts      # Spotify API endpoint
│   ├── layout.tsx                # Root layout with SessionProvider
│   └── page.tsx                  # Main page component
├── components/
│   ├── ArtistsPieChart.tsx      # Pie chart component
│   └── Providers.tsx            # Session provider wrapper
├── types/
│   └── next-auth.d.ts          # NextAuth type definitions
└── .env.local                  # Environment variables
```

## Troubleshooting

### "Unauthorized" Error
- Make sure your `.env.local` file has the correct Spotify credentials
- Verify the Redirect URI in your Spotify app matches exactly: `http://127.0.0.1:3000/api/auth/callback/spotify`
- Restart the development server after changing environment variables

### No Data Showing
- Make sure you have listening history on Spotify
- The app fetches data from the `long_term` time range (approximately last year)
- Try listening to more music on Spotify and check back later

### Authentication Loop
- Clear your browser cookies for 127.0.0.1:3000
- Check that `NEXTAUTH_SECRET` is set in `.env.local`
- Verify `NEXTAUTH_URL` is set to `http://127.0.0.1:3000`

## License

MIT
