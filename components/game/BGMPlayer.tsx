"use client";

import { useEffect, useRef, useState } from "react";
import YouTube from "react-youtube";
import { useGameStore } from "@/lib/store";
import { Volume2, VolumeX } from "lucide-react";

// Global dispatcher to trigger the SFX player from other components
export const triggerColorTimerSFX = {
  play: () => {},
  stop: () => {},
};

export function BGMPlayer() {
  const { isMusicPlaying, setMusicPlaying } = useGameStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sfxRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onReady = (event: any) => {
    playerRef.current = event.target;
    setIsReady(true);
    event.target.setVolume(20);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSfxReady = (event: any) => {
    sfxRef.current = event.target;
    event.target.setVolume(100);
    
    // Wire up global SFX trigger
    triggerColorTimerSFX.play = () => {
      // Use useGameStore.getState() to avoid React closure trap on the initial boolean value
      if (sfxRef.current && useGameStore.getState().isMusicPlaying) {
        sfxRef.current.seekTo(0, true); // true forces seeking even unstarted
        sfxRef.current.playVideo();
      }
    };
    
    triggerColorTimerSFX.stop = () => {
      if (sfxRef.current) {
        sfxRef.current.pauseVideo();
        sfxRef.current.seekTo(0, true);
      }
    };
  };

  useEffect(() => {
    if (playerRef.current && isReady) {
      try {
        const state = playerRef.current.getPlayerState();
        if (isMusicPlaying) {
          if (state !== 1) playerRef.current.playVideo();
        } else {
          if (state === 1 || state === 3) playerRef.current.pauseVideo();
        }
      } catch (err) {
        console.warn("YouTube playback state error", err);
      }
    }
  }, [isMusicPlaying, isReady]);

  // =========================================================================
  // 🎵 HOW TO CHANGE THE BACKGROUND MUSIC 🎵
  // 1. Go to YouTube and find the video/song you want.
  // 2. Look at the URL. For example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
  // 3. Copy the Video ID (the part after "v=", e.g., "dQw4w9WgXcQ")
  // 4. Paste that ID into the VIDEO_ID variable below!
  // =========================================================================
  const VIDEO_ID = "eGeqr6XmkXo"; // <-- CHANGE THIS TO YOUR YOUTUBE VIDEO ID

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none">
        <YouTube
          videoId={VIDEO_ID}
          opts={{
            height: "1",
            width: "1",
            playerVars: {
              autoplay: 0,
              loop: 1,
              playlist: VIDEO_ID, // Required for loop to work
              controls: 0,
              start: 28, // Starts the video at 0:28
            },
          }}
          onReady={onReady}
        />
      </div>

      {/* Warning Sound Effect Player */}
      <div className="absolute w-0 h-0 opacity-0 overflow-hidden pointer-events-none">
        <YouTube
          videoId="OmF_BUbE444"
          opts={{
            height: "1",
            width: "1",
            playerVars: {
              autoplay: 0,
              controls: 0,
            },
          }}
          onReady={onSfxReady}
        />
      </div>

      <button
        onClick={() => setMusicPlaying(!isMusicPlaying)}
        className="bg-black/80 p-3 rounded-full border border-blue-500/50 hover:bg-zinc-800 text-white transition-all backdrop-blur-md shadow-[0_0_15px_rgba(59,130,246,0.5)]"
      >
        {isMusicPlaying ? <Volume2 className="w-6 h-6 text-blue-400" /> : <VolumeX className="w-6 h-6 text-red-500" />}
      </button>
    </div>
  );
}