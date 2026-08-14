import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Radio,
} from "lucide-react";
import { playlists } from "../data/songsData";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const FALLBACK_DEMO = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
];

let ytApiPromise = null;

function loadYouTubeApi() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.YT && window.YT.Player) return Promise.resolve(true);
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    let finished = false;
    let attempts = 0;

    const finish = () => {
      if (finished) return;
      if (window.YT && window.YT.Player) {
        finished = true;
        resolve(true);
      }
    };

    const check = () => {
      finish();
      if (!finished && attempts++ < 100) {
        setTimeout(check, 100);
      } else if (!finished) {
        finished = true;
        resolve(false);
      }
    };

    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousReady === "function") {
        try { previousReady(); } catch {}
      }
      finish();
      check();
    };

    let script = document.getElementById("yt-iframe-api");

    if (!script) {
      script = document.createElement("script");
      script.id = "yt-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      script.addEventListener("load", check, { once: true });
      document.head.appendChild(script);
    }

    check();
  });

  return ytApiPromise;
}

export default function MusicPlayer({ onPlayerReady }) {
  const audioRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const ytFrameRef = useRef(null);
  const progressRef = useRef(null);
  const timeTickRef = useRef(null);
  const firstUserGestureRef = useRef(false);
  const pendingPlayRef = useRef(null);
  const ytBlacklistRef = useRef(new Set());

  const songKey = (plId, idx) => plId + ":" + idx;

  const [currentPlaylistId, setCurrentPlaylistId] = useState("romantic");
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("off");
  const [isLoading, setIsLoading] = useState(false);
  const [audioMode, setAudioMode] = useState("youtube");
  const [ytReady, setYtReady] = useState(false);

  const stateRef = useRef({ shuffle, repeat, isPlaying, currentPlaylistId, currentSongIndex, audioMode });
  useEffect(() => {
    stateRef.current = { shuffle, repeat, isPlaying, currentPlaylistId, currentSongIndex, audioMode };
  }, [shuffle, repeat, isPlaying, currentPlaylistId, currentSongIndex, audioMode]);

  const getPlaylist = (id) => playlists.find((p) => p.id === id);
  const currentPlaylist = getPlaylist(currentPlaylistId);
  const currentSong = currentPlaylist?.songs[currentSongIndex];

  const usingYouTube =
  audioMode === "youtube" && !!currentSong?.youtubeId;


  const usingAudio = !usingYouTube;

  const stopTimeTick = () => {
    if (timeTickRef.current) {
      clearInterval(timeTickRef.current);
      timeTickRef.current = null;
    }
  };

  const startTimeTick = useCallback(() => {
    stopTimeTick();
    timeTickRef.current = setInterval(() => {
      const { audioMode: mode } = stateRef.current;
      const useYt = mode === "youtube" || (mode === "auto" && currentSong?.youtubeId);
      if (useYt && ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === "function") {
        try {
          const t = ytPlayerRef.current.getCurrentTime();
          const d = ytPlayerRef.current.getDuration();
          setCurrentTime(t || 0);
          if (d) setDuration(d);
        } catch {}
      }
    }, 250);
  }, [currentSong]);

  useEffect(() => {
    return () => stopTimeTick();
  }, []);

  const resolveAudioUrl = useCallback((song, songIndex) => {
    if (!song) return FALLBACK_DEMO[0];
    if (audioMode === "demo") return FALLBACK_DEMO[(songIndex + song.id) % FALLBACK_DEMO.length];
    return song.localUrl || FALLBACK_DEMO[(songIndex + song.id) % FALLBACK_DEMO.length];
  }, [audioMode]);

  const _stopAllEngines = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    const yt = ytPlayerRef.current;
    if (yt && typeof yt.stopVideo === "function") {
      try { yt.stopVideo(); } catch {}
    }
    setIsPlaying(false);
    stopTimeTick();
  };

  const handleNext = useCallback((fromEnded = false) => {
    const { repeat: rep, shuffle: sh, currentPlaylistId: plId, currentSongIndex: idx } = stateRef.current;

    if (rep === "one" && fromEnded) {
      const mode = stateRef.current.audioMode;
      const song = getPlaylist(plId)?.songs[idx];
      const useYt = mode === "youtube" || (mode === "auto" && song?.youtubeId);
      if (useYt && ytPlayerRef.current) {
        try {
          ytPlayerRef.current.seekTo(0, true);
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        } catch {}
      } else {
        const audio = audioRef.current;
        if (audio) {
          audio.currentTime = 0;
          if (fromEnded || stateRef.current.isPlaying) {
            audio.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        }
      }
      return;
    }

    const playlist = getPlaylist(plId);
    const songs = playlist.songs;
    let nextIndex;

    if (sh) {
      if (songs.length <= 1) nextIndex = 0;
      else {
        do {
          nextIndex = Math.floor(Math.random() * songs.length);
        } while (nextIndex === idx);
      }
    } else {
      nextIndex = idx + 1;
      if (nextIndex >= songs.length) {
        if (rep === "all") {
          nextIndex = 0;
        } else {
          if (fromEnded) {
            setIsPlaying(false);
            const mode = stateRef.current.audioMode;
            const song = songs[idx];
            const useYt = mode === "youtube" || (mode === "auto" && song?.youtubeId);
            if (!useYt) {
              const audio = audioRef.current;
              if (audio) audio.currentTime = 0;
            } else if (ytPlayerRef.current) {
              try { ytPlayerRef.current.seekTo(0); } catch {}
            }
            stopTimeTick();
            return;
          }
          nextIndex = 0;
        }
      }
    }

    const shouldAutoPlay = stateRef.current.isPlaying || fromEnded;
    setCurrentSongIndex(nextIndex);
    setCurrentTime(0);

    const nextSong = getPlaylist(stateRef.current.currentPlaylistId)?.songs[nextIndex];
    const mode = stateRef.current.audioMode;
    const useYt = mode === "youtube" || (mode === "auto" && nextSong?.youtubeId);

    if (shouldAutoPlay) {
      if (useYt && nextSong?.youtubeId) {
        if (ytPlayerHasLoadFn()) {
          try {
            ytPlayerRef.current.loadVideoById(nextSong.youtubeId, 0, "default");
            ytPlayerRef.current.playVideo();
            setIsPlaying(true);
          } catch {}
        } else {
          pendingPlayRef.current = { youtubeId: nextSong.youtubeId };
          let retry = 0;
          const check = () => {
            retry++;
            if (ytPlayerHasLoadFn()) {
              pendingPlayRef.current = null;
              try {
                ytPlayerRef.current.loadVideoById(nextSong.youtubeId, 0, "default");
                ytPlayerRef.current.playVideo();
                setIsPlaying(true);
              } catch {}
            } else if (retry < 40) {
              setTimeout(check, 80);
            } else {
              pendingPlayRef.current = null;
            }
          };
          check();
        }
      } else {
        setTimeout(() => {
          const a = audioRef.current;
          if (a) a.play().then(() => setIsPlaying(true)).catch(() => {});
        }, 120);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeApi().then((ready) => {
      if (cancelled || !ready || !ytFrameRef.current) {
        if (!ready) setYtReady(false);
        return;
      }

      if (ytPlayerRef.current) {
        setYtReady(true);
        return;
      }

      try {
        ytPlayerRef.current = new window.YT.Player(ytFrameRef.current, {
          height: "200",
          width: "200",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            showinfo: 0,
            
          },
          events: {
            onReady: (e) => {
              setYtReady(true);
              try {
                e.target.setVolume(volume * 100);
                if (muted) e.target.mute();
              } catch {}
              if (pendingPlayRef.current?.youtubeId) {
                try {
                  e.target.loadVideoById(pendingPlayRef.current.youtubeId, 0, "default");
                  e.target.playVideo();
                  setIsPlaying(true);
                  pendingPlayRef.current = null;
                } catch {}
              }
            },
            onStateChange: (e) => {
              const YT = window.YT;
              if (!YT) return;
              if (e.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setIsLoading(false);
                try {
                  setDuration(e.target.getDuration() || 0);
                } catch {}
                startTimeTick();
              } else if (e.data === YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (e.data === YT.PlayerState.ENDED) {
                stopTimeTick();
                setIsPlaying(false);
                handleNext(true);
              } else if (e.data === YT.PlayerState.BUFFERING) {
                setIsLoading(true);
              } else if (e.data === YT.PlayerState.CUED) {
                setIsLoading(false);
                try {
                  setDuration(e.target.getDuration() || 0);
                } catch {}
              }
            },
            onError: (e) => {
              setIsLoading(false);
              const err = e?.data;
              if (err === 100 || err === 101 || err === 150) {
                const { currentPlaylistId: plId, currentSongIndex: idx } = stateRef.current;
                const song = getPlaylist(plId)?.songs[idx];
                if (song) {
                  const badKey = plId + ":" + idx;
                  if (!ytBlacklistRef.current.has(badKey)) ytBlacklistRef.current.add(badKey);
                  try {
  e.target.stopVideo?.();
} catch {}

setIsPlaying(false);
setIsLoading(false);

console.error("YouTube video cannot be played. Error code:", err);
return;
                }
                handleNext(true);
              }
            },
          },
        });
      } catch (error) {
        console.error("Failed to create YouTube player:", error);
        setYtReady(false);
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ytPlayerRef.current || !ytReady) return;
    try {
      ytPlayerRef.current.setVolume(volume * 100);
      if (muted) ytPlayerRef.current.mute();
      else ytPlayerRef.current.unMute();
    } catch {}
  }, [volume, muted, ytReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onEnded = () => handleNext(true);
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsLoading(false);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("error", onError);
    };
  }, [handleNext]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  useEffect(() => {
    if (!currentSong) return;
    setCurrentTime(0);
    setIsLoading(true);
    stopTimeTick();

    const useYt = usingYouTube;
    const useAudio = usingAudio;

    if (useYt) {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      }
    } else if (useAudio) {
      const audio = audioRef.current;
      if (!audio) return;
      const url = resolveAudioUrl(currentSong, currentSongIndex);
      audio.src = url;
      audio.load();
      if (stateRef.current.isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      } else {
        setIsLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSongIndex, currentPlaylistId, audioMode]);

  const isYtBlacklisted = (plId, idx) => {
  return ytBlacklistRef.current.has(songKey(plId, idx));
};

  const ytPlayerHasLoadFn = () => !!(ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === "function");

  const ytLoadAndPlayNow = (youtubeId, startSeconds = 0) => {
    if (!ytPlayerHasLoadFn()) return false;
    try {
      ytPlayerRef.current.loadVideoById(youtubeId, startSeconds, "default");
      ytPlayerRef.current.playVideo();
      return true;
    } catch {
      return false;
    }
  };

  const playAudioNow = (plId, idx, autoplay = true) => {
    const audio = audioRef.current;
    if (!audio) return false;
    const song = getPlaylist(plId)?.songs[idx];
    if (!song) return false;
    let url;
    if (audioMode === "local") url = resolveAudioUrl(song, idx);
    else url = FALLBACK_DEMO[((song.id || 0) + idx) % FALLBACK_DEMO.length];
    audio.src = url;
    audio.load();
    if (autoplay) {
      const p = audio.play();
      if (p && p.catch) {
        p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      } else {
        setIsPlaying(true);
      }
    }
    return true;
  };

  const ensureYTReady = () => new Promise((resolve) => {
    if (ytPlayerHasLoadFn()) { resolve(true); return; }
    loadYouTubeApi().then(() => {
      let attempts = 0;
      const check = () => {
        attempts++;
        if (ytPlayerHasLoadFn()) resolve(true);
        else if (attempts < 50) setTimeout(check, 80);
        else resolve(false);
      };
      check();
    });
  });

  const togglePlay = () => {
    firstUserGestureRef.current = true;

    if (isYtBlacklisted(currentPlaylistId, currentSongIndex) || !currentSong?.youtubeId || audioMode === "demo" || audioMode === "local") {
      const audio = audioRef.current;
      if (!audio) return;
      if (!audio.src || audio.paused) {
        if (!audio.src) {
          playAudioNow(currentPlaylistId, currentSongIndex, true);
        } else {
          const p = audio.play();
          if (p && p.catch) {
            p.then(() => setIsPlaying(true)).catch(() => {
              playAudioNow(currentPlaylistId, currentSongIndex, true);
            });
          } else {
            setIsPlaying(true);
          }
        }
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (ytPlayerHasLoadFn()) {
      try {
        const YT = window.YT;
        const playerState = ytPlayerRef.current.getPlayerState ? ytPlayerRef.current.getPlayerState() : -1;
        const playing = YT && playerState === YT.PlayerState.PLAYING;

        if (playing) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
        } else {
          const needsLoad =
            !YT ||
            playerState === YT.PlayerState.UNSTARTED ||
            playerState === YT.PlayerState.CUED ||
            playerState === -1;

          if (needsLoad) ytPlayerRef.current.loadVideoById(currentSong.youtubeId, 0, "default");
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      } catch {}
      return;
    }

    pendingPlayRef.current = { youtubeId: currentSong.youtubeId };
    ensureYTReady().then((ready) => {
  if (!ready) {
    setIsPlaying(false);
    setIsLoading(false);
    console.error("YouTube player is not ready");
    return;
  }

  const id =
    pendingPlayRef.current?.youtubeId || currentSong.youtubeId;

  pendingPlayRef.current = null;

  if (!ytLoadAndPlayNow(id)) {
    setIsPlaying(false);
    setIsLoading(false);
    console.error("Could not load YouTube video:", id);
  } else {
    setIsPlaying(true);
  }
});
  };

  const handlePrev = () => {
    if (usingYouTube && ytPlayerHasLoadFn()) {
      try {
        const t = ytPlayerRef.current.getCurrentTime();
        if (t > 3) {
          ytPlayerRef.current.seekTo(0, true);
          setCurrentTime(0);
          return;
        }
      } catch {}
    } else {
      const audio = audioRef.current;
      if (audio && audio.currentTime > 3) {
        audio.currentTime = 0;
        setCurrentTime(0);
        return;
      }
    }

    const { currentPlaylistId: plId, currentSongIndex: idx, isPlaying: playing, audioMode: mode } = stateRef.current;
    const playlist = getPlaylist(plId);
    const songs = playlist.songs;
    let prevIndex = idx - 1;
    if (prevIndex < 0) prevIndex = songs.length - 1;

    setCurrentSongIndex(prevIndex);
    setCurrentTime(0);

    const prevSong = playlist.songs[prevIndex];
    const useYt = mode === "youtube" || (mode === "auto" && prevSong?.youtubeId);

    if (playing) {
      if (useYt && prevSong?.youtubeId) {
        if (!ytLoadAndPlayNow(prevSong.youtubeId, 0)) {
          pendingPlayRef.current = { youtubeId: prevSong.youtubeId };
          ensureYTReady().then(() => {
            pendingPlayRef.current = null;
            ytLoadAndPlayNow(prevSong.youtubeId);
          });
        }
        setIsPlaying(true);
      } else {
        setTimeout(() => {
          const a = audioRef.current;
          if (a) a.play().then(() => setIsPlaying(true)).catch(() => {});
        }, 120);
      }
    }
  };

  const handleSeek = (e) => {
    const bar = progressRef.current;
    if (!bar || !duration) return;

    const rect = bar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    setCurrentTime(newTime);

    if (usingYouTube && ytPlayerRef.current) {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch {}
    } else {
      const audio = audioRef.current;
      if (audio) audio.currentTime = newTime;
    }
  };

  const selectSong = (playlistId, songIndex) => {
    firstUserGestureRef.current = true;
    const mode = stateRef.current.audioMode;
    const pl = getPlaylist(playlistId);
    const song = pl?.songs[songIndex];
    const useYt = mode === "youtube" || (mode === "auto" && song?.youtubeId);

    setCurrentPlaylistId(playlistId);
    setCurrentSongIndex(songIndex);
    setCurrentTime(0);
    stopTimeTick();
    setIsLoading(true);
    setIsPlaying(true);

    if (useYt && song?.youtubeId) {
      // First try immediately: this preserves the user's click gesture.
      if (ytLoadAndPlayNow(song.youtubeId, 0)) {
        setIsPlaying(true);
        return;
      }

      // Player is still initializing. Keep the selected song pending.
      pendingPlayRef.current = { youtubeId: song.youtubeId };

      ensureYTReady().then((ready) => {
        if (!ready || !pendingPlayRef.current) {
          setIsPlaying(false);
          setIsLoading(false);
          return;
        }

        const pendingId = pendingPlayRef.current.youtubeId;
        pendingPlayRef.current = null;

        if (!ytLoadAndPlayNow(pendingId, 0)) {
          setIsPlaying(false);
          setIsLoading(false);
          console.error("Could not start YouTube song:", pendingId);
        } else {
          setIsPlaying(true);
        }
      });
    } else {
      setTimeout(() => {
        const audio = audioRef.current;
        if (!audio) {
          setIsPlaying(false);
          setIsLoading(false);
          return;
        }
        const p = audio.play();
        if (p && p.catch) {
          p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
        } else {
          setIsPlaying(true);
        }
      }, 120);
    }
  };

  useEffect(() => {
  if (onPlayerReady) {
    onPlayerReady({
      selectSong,
    });
  }
}, [onPlayerReady]);

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "200px",
          height: "200px",
          left: "-10000px",
          top: "-10000px",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div ref={ytFrameRef} id="yt-hidden-player" />
      </div>

      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />

      <motion.div
        layout
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed z-50 left-1/2 -translate-x-1/2 bottom-6 w-[min(560px,calc(100vw-1.5rem))]"
      >
        <motion.div
          layout
          className="relative w-full rounded-2xl border border-brass/30 bg-night-2/90 shadow-[0_10px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <div
              className={`absolute -top-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-br ${
                currentPlaylist?.color || "from-maroon to-marigold"
              } blur-3xl opacity-30`}
            />
            <div
              className={`absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gradient-to-br ${
                currentPlaylist?.color || "from-marigold to-maroon"
              } blur-3xl opacity-20`}
            />
          </div>

          <div className="relative z-10 px-4 md:px-5 pt-3 pb-3 border-t border-brass/10">
            <div
              ref={progressRef}
              onClick={handleSeek}
              className="w-full h-1 rounded-full bg-cream/8 cursor-pointer group/progress mb-2"
            >
              <div className="relative h-full rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${
                    currentPlaylist?.color || "from-maroon to-marigold"
                  } rounded-full transition-[width] duration-150`}
                  style={{ width: `${progressPercent}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-cream shadow-lg opacity-0 group-hover/progress:opacity-100 transition"
                  style={{ left: `calc(${progressPercent}% - 7px)` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0 rounded-xl overflow-hidden border border-brass/30 bg-night-2 shadow-lg flex items-center justify-center">
                <span className="text-2xl">🎵</span>
                {isPlaying && <span className="absolute inset-0 bg-black/10" />}
              </div>

              <div className="min-w-0 flex-1 leading-tight max-w-[190px] md:max-w-[220px]">
                <div className="flex items-center gap-1.5">
                  <Music size={12} className="text-marigold-light shrink-0" />
                  <p className="font-devbody text-[0.88rem] text-cream truncate">
                    {currentSong?.titleHi}
                  </p>
                </div>
                <p className="font-body text-[0.6rem] uppercase tracking-[0.15em] text-cream-dim/55 truncate mt-0.5">
                  {currentSong?.movie} · {currentSong?.year}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handlePrev}
                  className="text-cream-dim transition hover:text-cream"
                  aria-label="Previous"
                  title="Previous"
                >
                  <SkipBack size={19} fill="currentColor" />
                </button>

                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  title={isPlaying ? "Pause" : "Play"}
                  className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-marigold to-marigold-light text-night shadow-lg transition hover:scale-105 active:scale-95"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="h-5 w-5 rounded-full border-2 border-night/30 border-t-night"
                    />
                  ) : isPlaying ? (
                    <Pause size={19} fill="currentColor" />
                  ) : (
                    <Play size={19} fill="currentColor" className="ml-0.5" />
                  )}
                </button>

                <button
                  onClick={() => handleNext(false)}
                  className="text-cream-dim transition hover:text-cream"
                  aria-label="Next"
                  title="Next"
                >
                  <SkipForward size={19} fill="currentColor" />
                </button>
              </div>

              <div className="hidden md:flex items-center gap-2 w-28">
                <button
                  onClick={() => setMuted((m) => !m)}
                  className="text-cream-dim/60 hover:text-cream transition shrink-0"
                  aria-label={muted ? "Unmute" : "Mute"}
                  title={muted ? "Unmute" : "Mute"}
                >
                  {muted || volume === 0 ? (
                    <VolumeX size={16} />
                  ) : (
                    <Volume2 size={16} />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (v > 0) setMuted(false);
                  }}
                  className="flex-1 h-1 appearance-none rounded-full bg-cream/10 accent-marigold cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-marigold) 0%, var(--color-marigold) ${
                      (muted ? 0 : volume) * 100
                    }%, rgba(241,228,200,0.08) ${
                      (muted ? 0 : volume) * 100
                    }%, rgba(241,228,200,0.08) 100%)`,
                  }}
                />
              </div>

              <div className="hidden sm:flex items-center gap-1 text-[0.68rem] font-body text-cream-dim/50 tabular-nums shrink-0">
                <Radio
                  size={12}
                  className="mr-0.5 text-marigold-light/70"
                />
                {formatTime(currentTime)}
                <span className="text-cream-dim/25">/</span>
                {formatTime(duration)}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: var(--color-marigold);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(226,137,30,0.4);
        }

        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 999px;
          background: var(--color-marigold);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(226,137,30,0.4);
        }

        @keyframes eq {
          0%, 100% { height: 30%; }
          50% { height: 100%; }
        }
      `}</style>
    </>
  );
}
