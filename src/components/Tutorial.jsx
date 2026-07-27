import { useEffect, useState } from "react";
import { SparkleIcon, TimerIcon, HeadphoneIcon, PaletteIcon, SettingsIcon } from "./icons";

const STEPS = [
  {
    icon: <SparkleIcon className="h-9 w-9" />,
    title: "환영해요",
    desc: "Lo-Fi Focus와 함께라면 흐트러진 시간을 다시 모을 수 있어요. 1분 안에 사용법을 알려드릴게요.",
  },
  {
    icon: <TimerIcon className="h-9 w-9" />,
    title: "25분 집중, 5분 휴식",
    desc: "가운데 큰 시계가 남은 시간을 알려줘요. 시작 버튼을 누르면 집중이 시작되고, 세션이 끝나면 잠시 휴식으로 자연스럽게 넘어가요. 집중·휴식 탭으로 모드를 직접 바꿀 수도 있어요.",
  },
  {
    icon: <HeadphoneIcon className="h-9 w-9" />,
    title: "좋아하는 음악을 깔고",
    desc: "하단 플레이어에서 Lofi 음악이 흘러나와요. '링크' 버튼으로 유튜브 영상을 바꿀 수 있고, 재생과 볼륨도 자유롭게 조절하세요.",
  },
  {
    icon: <PaletteIcon className="h-9 w-9" />,
    title: "나만의 분위기로",
    desc: "미드나이트·말차·선셋·오션·모노크롬·핑크, 6가지 테마 중 마음에 드는 걸 고르세요. 설정에서 언제든 바꿀 수 있어요.",
  },
  {
    icon: <SettingsIcon className="h-9 w-9" />,
    title: "내 맘대로 설정하고",
    desc: "집중·휴식 시간과 목표 사이클을 내게 맞게 조절하세요. 세션이 끝나면 브라우저 알림과 잔잔한 알림음으로 알려드릴게요. 그럼, 이제 시작해 볼까요?",
  },
];

/**
 * Tutorial — 첫 방문 사용자를 위한 5단계 안내 오버레이.
 * @param {boolean} open
 * @param {() => void} onClose  건너뛰기/완료 시 호출 (App에서 seen 처리)
 */
export default function Tutorial({ open, onClose }) {
  const [step, setStep] = useState(0);

  // 열릴 때 첫 단계로 초기화
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  // 키보드 조작: Esc 건너뛰기, ← → 단계 이동
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setStep((s) => Math.min(STEPS.length - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const isFirst = step === 0;

  const next = () => {
    if (isLast) onClose();
    else setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label="사용법 안내"
    >
      <div className="absolute inset-0 bg-night-950/80 backdrop-blur-md" onClick={onClose} />

      <div className="glass relative w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl">
        {/* 건너뛰기 */}
        {!isLast && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium text-mist transition hover:bg-white/10 hover:text-cream"
          >
            건너뛰기
          </button>
        )}

        {/* 아이콘 뱃지 */}
        <div className="flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl text-night-950 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, var(--color-peach-400), var(--color-lavender-400))",
            }}
          >
            {current.icon}
          </div>
        </div>

        {/* 단계 카운터 */}
        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-mist">
          {step + 1} / {STEPS.length}
        </p>

        {/* 제목 + 설명 */}
        <h2 className="mt-2 text-center text-2xl font-bold text-cream">{current.title}</h2>
        <p className="mt-3 text-center text-sm leading-relaxed text-mist">{current.desc}</p>

        {/* 단계 점 */}
        <div className="mt-7 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === step ? "1.5rem" : "0.5rem",
                background:
                  i === step ? "var(--color-peach-400)" : "rgba(255,255,255,0.15)",
              }}
              aria-label={`${i + 1}번째 단계로 이동`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={prev}
            disabled={isFirst}
            className="rounded-xl px-5 py-2.5 text-sm font-medium text-mist transition hover:text-cream disabled:opacity-30"
          >
            이전
          </button>
          <button
            type="button"
            onClick={next}
            className="flex-1 rounded-xl px-5 py-3 text-sm font-bold text-night-950 shadow-lg transition hover:scale-[1.02] active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, var(--color-peach-400), var(--color-lavender-400))",
              boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            }}
          >
            {isLast ? "시작하기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}
