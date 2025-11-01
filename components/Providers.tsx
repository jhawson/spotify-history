"use client";

import { SessionProvider } from "next-auth/react";
import { SpotifyPlayerProvider } from "@/contexts/SpotifyPlayerContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SpotifyPlayerProvider>{children}</SpotifyPlayerProvider>
    </SessionProvider>
  );
}
