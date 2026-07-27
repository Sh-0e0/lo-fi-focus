import { useCallback, useEffect, useState } from "react";
import AmbientBackground from "./components/AmbientBackground";
import TimerDisplay from "./components/TimerDisplay";
import MusicPlayer from "./components/MusicPlayer";
import SettingsModal from "./components/SettingsModal";
import { SettingsIcon } from "./components/icons";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { usePomodoroTimer } from "./hooks/usePomodoroTimer";
import { useYouTubePlayer, parseYouTubeId } from "./hooks/useYouTubePlayer";
import { notify, requestNotificationPermission } from "./utils/notify";
import { playChime } from "./utils/sound";

const DEFAULT_LOFI_ID = "jfKfPfyJRdk"; // Lofi Girl 라이브 스트림
const STORAGE_KEYS = {
  focusMinutes: "lofi-focus.minutes",
  breakMinutes: "lofi-break.minutes",
  targetSessions: "lofi-target.sessions",
  lastVideoId: "lofi-youtube.lastId",
  volume: "lofi-youtube.volume",
};

export default function App() {
  // --- 사용자 설정 (localStorage 영속화) ---
  const [focusMinutes, setFocusMinutes] = useLocalStorage(STORAGE_KEYS.focusMinutes, 25);
  const [breakMinutes, setBreakMinutes] = useLocalStorage(STORAGE_KEYS.breakMinutes, 5);
  const [targetSessions, setTargetSessions] = useLocalStorage(STORAGE_KEYS.targetSessions, 4);
  const [lastVideoId, setLastVideoId] = useLocalStorage(STORAGE_KEYS.lastVideoId, DEFAULT_LOFI_ID);
  const [volume, setVolume] = useLocalStorage(STORAGE_KEYS.volume, 60);

  const [settingsOpen, setSettingsOpen] = useState(false);

  // --- 타이머 로직 ---
  const handleSessionComplete = useCallback(({ from, completed }) => {
    if (from === "focus") {
      notify("집중 완료!", `${completed}번째 뽀모도로를 마쳤어요. 잠시 휴식하세요.`);
    } else {
      notify("휴식 끝!", "다시 집중할 시간이에요.");
    }
    playChime();
  }, []);

  const timer = usePomodoroTimer({
    focusSeconds: focusMinutes * 60,
    breakSeconds: breakMinutes * 60,
    targetSessions,
    onSessionComplete: handleSessionComplete,
  });

  // --- 유튜브 플레이어 ---
  const player = useYouTubePlayer({
    initialVideoId: lastVideoId,
    initialVolume: volume,
  });

  // 플레이어 준비되면 / 볼륨 변경 시 동기화
  useEffect(() => {
    if (player.isReady) player.setVolume(volume);
  }, [player.isReady, volume, player]);

  // 세션 전환 알림음은 사용자 제스처 이후에만 AudioContext가 동작하므로
  // 첫 시작 클릭에서 알림 권한도 함께 요청
  const handleToggleStart = useCallback(() => {
    if (!timer.isRunning) requestNotificationPermission();
    timer.toggle();
  }, [timer]);

  const handleUrlSubmit = useCallback(
    (url) => {
      const id = parseYouTubeId(url);
      if (!id) return null;
      player.loadVideo(id);
      setLastVideoId(id);
      return id;
    },
    [player, setLastVideoId],
  );

  const trackTitle =
    player.title ||
    (lastVideoId === DEFAULT_LOFI_ID
      ? "Lofi Girl · chill beats to study/relax to"
      : "커스텀 재생");

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />

      {/* 헤더 */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-night-950 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--color-peach-400), var(--color-lavender-400))",
            }}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M9 17V5l10-2v12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="6" cy="17" r="3" />
              <circle cx="16" cy="15" r="3" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-cream">Lo-Fi Focus</h1>
            <p className="text-xs text-mist">음악과 함께하는 뽀모도로</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full glass px-4 py-1.5 sm:flex">
            <span
              className="h-2 w-2 rounded-full bg-mint-400"
              style={{ boxShadow: "0 0 8px var(--color-mint-400)" }}
            />
            <span className="text-xs font-medium text-mist">
              오늘 {timer.completedSessions}번 집중했어요
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full glass text-mist transition hover:text-cream hover:bg-white/10"
            aria-label="설정 열기"
          >
            <SettingsIcon />
          </button>
        </div>
      </header>

      {/* 메인 — 타이머 중앙 배치 */}
      <main className="relative z-10 flex min-h-[calc(100vh-180px)] items-center justify-center px-6 pb-40">
        <TimerDisplay
          mode={timer.mode}
          timeLeft={timer.formatted}
          progress={timer.progress}
          isRunning={timer.isRunning}
          completedSessions={timer.completedSessions}
          targetSessions={targetSessions}
          onToggleStart={handleToggleStart}
          onReset={timer.reset}
          onModeChange={timer.switchMode}
        />
      </main>

      {/* 하단 뮤직 플레이어 */}
      <MusicPlayer
        containerRef={player.containerRef}
        trackTitle={trackTitle}
        isPlaying={player.isPlaying}
        isReady={player.isReady}
        volume={volume}
        onTogglePlay={player.toggle}
        onVolumeChange={setVolume}
        onUrlSubmit={handleUrlSubmit}
      />

      {/* 설정 모달 */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        focusMinutes={focusMinutes}
        breakMinutes={breakMinutes}
        targetSessions={targetSessions}
        onFocusChange={setFocusMinutes}
        onBreakChange={setBreakMinutes}
        onTargetChange={setTargetSessions}
        onResetSessions={timer.resetCompleted}
      />
    </div>
  );
}
