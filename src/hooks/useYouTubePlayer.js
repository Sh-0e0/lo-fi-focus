import { useCallback, useEffect, useRef, useState } from "react";

/**
 * YouTube IFrame Player API 로더 (싱글톤).
 * 스크립트 중복 로드 방지 + onYouTubeIframeAPIReady 콜백 체이닝.
 */
let apiPromise = null;
function loadYouTubeAPI() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve) => {
    if (typeof window === "undefined") return;
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === "function") prev();
      resolve(window.YT);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return apiPromise;
}

/**
 * 유튜브 URL/ID에서 11자리 영상 ID 추출.
 * 지원 형태: raw ID, youtu.be/, watch?v=, /embed/, /shorts/, live/
 */
export function parseYouTubeId(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }
  return null;
}

/**
 * useYouTubePlayer — 숨겨진 유튜브 플레이어를 제어.
 *
 * @param {object} opts
 * @param {string} opts.initialVideoId   최초 재생할 영상 ID
 * @param {number} opts.initialVolume    0~100
 * @returns containerRef(숨겨진 div에 부착), isReady, isPlaying, title, 제어 함수들
 */
export function useYouTubePlayer({ initialVideoId, initialVolume = 60 } = {}) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState("");
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadYouTubeAPI().then((YT) => {
      if (cancelled || !containerRef.current || playerRef.current) return;
      playerRef.current = new YT.Player(containerRef.current, {
        videoId: initialVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (e) => {
            setIsReady(true);
            try {
              e.target.setVolume(initialVolume);
            } catch {
              /* ignore */
            }
            // 자동재생이 차단될 수 있음 — 시도만 하고 UI는 상태를 따라감
            try {
              e.target.playVideo();
            } catch {
              /* ignore */
            }
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === YT.PlayerState.PLAYING);
            if (e.data === YT.PlayerState.PLAYING || e.data === YT.PlayerState.VIDEO_CUED) {
              try {
                const data = e.target.getVideoData?.();
                if (data?.title) setTitle(data.title);
              } catch {
                /* ignore */
              }
            }
          },
        },
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback(() => {
    try {
      playerRef.current?.playVideo?.();
    } catch {
      /* ignore */
    }
  }, []);

  const pause = useCallback(() => {
    try {
      playerRef.current?.pauseVideo?.();
    } catch {
      /* ignore */
    }
  }, []);

  const setVolume = useCallback((v) => {
    try {
      playerRef.current?.setVolume?.(v);
    } catch {
      /* ignore */
    }
  }, []);

  const loadVideo = useCallback((videoId) => {
    try {
      playerRef.current?.loadVideoById?.(videoId);
      setTitle("");
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  return {
    containerRef,
    isReady,
    isPlaying,
    title,
    play,
    pause,
    toggle,
    setVolume,
    loadVideo,
  };
}
