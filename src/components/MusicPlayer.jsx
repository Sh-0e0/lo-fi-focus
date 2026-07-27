import { useState } from "react";
import { PlayIcon, PauseIcon, VolumeIcon, VolumeMuteIcon, HeadphoneIcon } from "./icons";

/**
 * MusicPlayer — 유튜브 백그라운드 재생 컨트롤 바.
 * 실제 플레이어는 containerRef가 가리키는 숨겨진 div에 마운트됨(useYouTubePlayer).
 *
 * @param {object} props
 * @param {import("react").RefObject<HTMLDivElement>} props.containerRef
 * @param {string}  props.trackTitle
 * @param {boolean} props.isPlaying
 * @param {boolean} props.isReady
 * @param {number}  props.volume           - 0~100
 * @param {() => void} props.onTogglePlay
 * @param {(v: number) => void} props.onVolumeChange
 * @param {(url: string) => string | null} props.onUrlSubmit  - 파싱된 videoId 또는 null
 */
export default function MusicPlayer({
  containerRef,
  trackTitle = "Lofi Girl",
  isPlaying = false,
  isReady = true,
  volume = 60,
  onTogglePlay = () => {},
  onVolumeChange = () => {},
  onUrlSubmit = () => null,
}) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [error, setError] = useState("");
  const muted = volume === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = onUrlSubmit(urlValue);
    if (videoId) {
      setUrlValue("");
      setError("");
      setShowUrlInput(false);
    } else {
      setError("유효한 유튜브 링크를 입력해 주세요");
    }
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5">
      <div className="glass pointer-events-auto w-full max-w-xl rounded-2xl border border-white/10 p-3 shadow-2xl">
        {/* 숨겨진 유튜브 플레이어 — 화면 밖에 렌더링(display:none 시 API 응답 불안정 이슈 회피) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0"
        >
          <div ref={containerRef} />
        </div>

        <div className="flex items-center gap-3">
          {/* 돌아가는 레코드판 */}
          <div className="relative h-12 w-12 shrink-0">
            <div
              className="h-full w-full rounded-full ring-1 ring-white/10"
              style={{
                animation: isPlaying ? "spin 4s linear infinite" : undefined,
                backgroundImage:
                  "repeating-radial-gradient(circle at center, #2f2945 0 2px, #241f38 2px 4px)",
              }}
            />
            <div
              className="absolute inset-0 m-auto h-4 w-4 rounded-full"
              style={{ background: "var(--color-peach-400)" }}
            />
            <div className="absolute inset-0 m-auto h-1 w-1 rounded-full bg-night-950" />
          </div>

          {/* 트랙 정보 */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <HeadphoneIcon className="h-3.5 w-3.5 shrink-0 text-lavender-300" />
              <p className="truncate text-sm font-semibold text-cream">{trackTitle}</p>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-mist">
              {!isReady ? (
                "음악 불러오는 중…"
              ) : isPlaying ? (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-mint-400" style={{ boxShadow: "0 0 6px var(--color-mint-400)" }} />
                  재생 중
                </>
              ) : (
                "일시정지됨"
              )}
            </p>
          </div>

          {/* 재생/일시정지 */}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={!isReady}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream text-night-950 transition hover:scale-105 active:scale-95 disabled:opacity-40"
            aria-label={isPlaying ? "음악 일시정지" : "음악 재생"}
          >
            {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
          </button>

          {/* 볼륨 */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => onVolumeChange(muted ? 60 : 0)}
              className="text-mist transition hover:text-cream"
              aria-label={muted ? "음소거 해제" : "음소거"}
            >
              {muted ? <VolumeMuteIcon /> : <VolumeIcon />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="lofi-range w-24"
              aria-label="볼륨"
            />
          </div>

          {/* URL 입력 토글 */}
          <button
            type="button"
            onClick={() => setShowUrlInput((s) => !s)}
            className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-medium text-mist transition hover:bg-white/10 hover:text-cream"
          >
            {showUrlInput ? "닫기" : "링크"}
          </button>
        </div>

        {/* URL 입력 영역 — 토글 시 노출 */}
        {showUrlInput && (
          <form onSubmit={handleSubmit} className="mt-3 border-t border-white/10 pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={urlValue}
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  setError("");
                }}
                placeholder="유튜브 링크 또는 영상 ID 붙여넣기"
                className="min-w-0 flex-1 rounded-lg bg-night-900/60 px-3 py-2 text-sm text-cream placeholder:text-mist/70 outline-none ring-1 ring-white/10 focus:ring-lavender-400/60"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-lavender-400 px-4 py-2 text-sm font-semibold text-night-950 transition hover:bg-lavender-300 active:scale-95"
              >
                재생
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-peach-400">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
