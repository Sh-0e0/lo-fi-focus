import { useEffect } from "react";
import { CloseIcon } from "./icons";
import { THEMES } from "../themes";

/**
 * SettingsModal — 타이머 설정 모달.
 * 설정값은 App의 localStorage 상태와 직결됨.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {number} props.focusMinutes
 * @param {number} props.breakMinutes
 * @param {number} props.targetSessions
 * @param {(v: number) => void} props.onFocusChange
 * @param {(v: number) => void} props.onBreakChange
 * @param {(v: number) => void} props.onTargetChange
 * @param {() => void} props.onResetSessions
 */
export default function SettingsModal({
  open,
  onClose,
  focusMinutes,
  breakMinutes,
  targetSessions,
  theme,
  onThemeChange,
  onFocusChange,
  onBreakChange,
  onTargetChange,
  onResetSessions,
  onShowTutorial,
}) {
  // Esc로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="타이머 설정"
    >
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 카드 */}
      <div className="glass relative w-full max-w-sm rounded-3xl border border-white/10 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-bold text-cream">타이머 설정</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-mist transition hover:bg-white/10 hover:text-cream"
            aria-label="설정 닫기"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-5">
          <Stepper
            label="집중 시간"
            suffix="분"
            value={focusMinutes}
            min={5}
            max={90}
            step={5}
            accent="var(--color-peach-400)"
            onChange={onFocusChange}
          />
          <Stepper
            label="휴식 시간"
            suffix="분"
            value={breakMinutes}
            min={1}
            max={30}
            step={1}
            accent="var(--color-mint-400)"
            onChange={onBreakChange}
          />
          <Stepper
            label="목표 사이클"
            suffix="회"
            value={targetSessions}
            min={1}
            max={8}
            step={1}
            accent="var(--color-lavender-400)"
            onChange={onTargetChange}
          />
        </div>

        {/* 테마 선택 */}
        <div className="mt-5">
          <span className="text-sm font-medium text-cream">테마</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onThemeChange(t.id)}
                className={`flex items-center gap-2.5 rounded-xl p-2.5 ring-1 transition ${
                  theme === t.id
                    ? "ring-cream/70 bg-white/5"
                    : "ring-white/10 hover:bg-white/5 hover:ring-white/20"
                }`}
                aria-label={`${t.name} 테마 적용`}
              >
                <span
                  className="flex h-9 w-9 shrink-0 items-end gap-0.5 overflow-hidden rounded-lg p-1"
                  style={{ background: t.swatch[0] }}
                >
                  {t.swatch.slice(1).map((c, i) => (
                    <span key={i} className="h-2 flex-1 rounded-full" style={{ background: c }} />
                  ))}
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-xs font-semibold text-cream">{t.name}</span>
                  <span className="block truncate text-[10px] text-mist">{t.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-2 border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={onShowTutorial}
            className="w-full rounded-xl bg-night-800/60 px-4 py-2.5 text-sm font-medium text-mist transition hover:bg-night-700 hover:text-cream"
          >
            사용법 다시 보기
          </button>
          <button
            type="button"
            onClick={onResetSessions}
            className="w-full rounded-xl bg-night-800/60 px-4 py-2.5 text-sm font-medium text-mist transition hover:bg-night-700 hover:text-cream"
          >
            오늘의 집중 기록 초기화
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-mist/70">
          설정은 이 브라우저에 자동 저장돼요
        </p>
      </div>
    </div>
  );
}

function Stepper({ label, suffix, value, min, max, step, accent, onChange }) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-cream">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="flex h-8 w-8 items-center justify-center rounded-full glass text-mist transition hover:text-cream disabled:opacity-30"
          aria-label={`${label} 감소`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <span className="w-16 text-center tabular-nums text-lg font-bold" style={{ color: accent }}>
          {value}
          <span className="ml-0.5 text-xs font-medium text-mist">{suffix}</span>
        </span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="flex h-8 w-8 items-center justify-center rounded-full glass text-mist transition hover:text-cream disabled:opacity-30"
          aria-label={`${label} 증가`}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
