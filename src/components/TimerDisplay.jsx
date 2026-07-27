import { PlayIcon, PauseIcon, ResetIcon } from "./icons";

/**
 * TimerDisplay — 뽀모도로 타이머의 메인 비주얼.
 * 현재는 정적 UI(mockup). 실제 타이머 로직은 props로 주입하면 됨.
 *
 * @param {object}  props
 * @param {"focus"|"break"} props.mode       - 현재 모드
 * @param {string}  props.timeLeft            - "MM:SS" 형태 남은 시간
 * @param {number}  props.progress            - 0~1 진행률
 * @param {boolean} props.isRunning           - 실행 중 여부
 * @param {number}  props.completedSessions   - 완료한 뽀모도로 수
 * @param {number}  props.targetSessions      - 목표 사이클 수
 * @param {() => void} props.onToggleStart
 * @param {() => void} props.onReset
 * @param {(m: "focus"|"break") => void} props.onModeChange
 */
export default function TimerDisplay({
  mode = "focus",
  timeLeft = "25:00",
  progress = 0,
  isRunning = false,
  completedSessions = 1,
  targetSessions = 4,
  onToggleStart = () => {},
  onReset = () => {},
  onModeChange = () => {},
}) {
  const isFocus = mode === "focus";

  // 진행 링 수치
  const RADIUS = 132;
  const CIRC = 2 * Math.PI * RADIUS;
  const dashOffset = CIRC * (1 - progress);

  const accent = isFocus ? "var(--color-peach-400)" : "var(--color-mint-400)";

  return (
    <div className="relative flex flex-col items-center">
      {/* 뒤에 은은하게 숨쉬는 글로우 */}
      <div
        className="absolute -inset-10 rounded-full blur-3xl animate-pulse-glow"
        style={{ background: `radial-gradient(circle, ${accent}33, transparent 70%)` }}
      />

      {/* 모드 토글 */}
      <div className="relative z-10 mb-8 flex gap-1 rounded-full glass p-1">
        <ModeTab
          active={isFocus}
          onClick={() => onModeChange("focus")}
          label="집중"
          sub="25분"
        />
        <ModeTab
          active={!isFocus}
          onClick={() => onModeChange("break")}
          label="휴식"
          sub="5분"
        />
      </div>

      {/* 진행 링 + 시계 */}
      <div className="relative z-10 flex h-80 w-80 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 300 300">
          {/* 트랙 */}
          <circle
            cx="150"
            cy="150"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          {/* 진행률 */}
          <circle
            cx="150"
            cy="150"
            r={RADIUS}
            fill="none"
            stroke={accent}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 8px ${accent}66)`, transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* 중앙 시계 텍스트 */}
        <div className="relative flex flex-col items-center">
          <span
            className="text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {isFocus ? "Focus" : "Break"}
          </span>
          <span className="mt-2 tabular-nums text-7xl font-bold tracking-tight text-cream drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            {timeLeft}
          </span>
          <span className="mt-2 text-sm text-mist">
            {isRunning ? "진행 중…" : "시작할 준비가 됐어요"}
          </span>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="relative z-10 mt-8 flex items-center gap-5">
        <button
          type="button"
          onClick={onReset}
          className="flex h-12 w-12 items-center justify-center rounded-full glass text-mist transition hover:text-cream hover:bg-white/10 active:scale-95"
          aria-label="타이머 초기화"
        >
          <ResetIcon />
        </button>

        <button
          type="button"
          onClick={onToggleStart}
          className="flex h-16 w-16 items-center justify-center rounded-full text-night-950 shadow-lg transition hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${accent}, var(--color-lavender-400))`,
            boxShadow: `0 8px 30px ${accent}55`,
          }}
          aria-label={isRunning ? "일시정지" : "시작"}
        >
          {isRunning ? <PauseIcon className="h-7 w-7" /> : <PlayIcon className="h-7 w-7" />}
        </button>

        {/* 자리 맞춤용 스페이서 — 건너뛰기 자리 (추후 확장) */}
        <div className="h-12 w-12" />
      </div>

      {/* 세션 진행 점 */}
      <div className="relative z-10 mt-8 flex items-center gap-2">
        {Array.from({ length: targetSessions }).map((_, i) => (
          <span
            key={i}
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: i === completedSessions - 1 ? "1.75rem" : "0.5rem",
              background:
                i < completedSessions
                  ? accent
                  : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
        <span className="ml-3 text-xs text-mist">
          {completedSessions} / {targetSessions} 뽀모도로
        </span>
      </div>
    </div>
  );
}

function ModeTab({ active, onClick, label, sub }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-full px-6 py-2 text-sm font-semibold transition ${
        active ? "text-night-950" : "text-mist hover:text-cream"
      }`}
      style={active ? { background: "color-mix(in srgb, var(--color-cream) 92%, transparent)" } : undefined}
    >
      {label}
      <span className={`ml-1.5 text-xs ${active ? "opacity-60" : "opacity-50"}`}>
        {sub}
      </span>
    </button>
  );
}
