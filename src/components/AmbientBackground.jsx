import { useMemo } from "react";

/**
 * AmbientBackground
 * Lofi 감성의 정적인 배경 — 깊은 밤 그라데이션 + 떠다니는 글로우 오브 + 먼지 입자
 * 순수 장식 요소이므로 인터랙션 없음.
 */
export default function AmbientBackground() {
  // 입자 위치를 렌더마다 바뀌지 않도록 한 번만 생성
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* 기본 그라데이션 베이스 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#241f38_0%,#15121f_45%,#100d1a_100%)]" />

      {/* 떠다니는 글로우 오브 — 따뜻한 파스텔 */}
      <div className="absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-peach-500/20 blur-[120px] animate-drift" />
      <div className="absolute top-1/3 -right-32 h-[32rem] w-[32rem] rounded-full bg-lavender-500/20 blur-[130px] animate-drift-slow" />
      <div className="absolute -bottom-40 left-1/4 h-[26rem] w-[26rem] rounded-full bg-mint-400/10 blur-[120px] animate-drift" />

      {/* 미세 먼지 입자 — 천천히 위로 떠오름 */}
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-0 rounded-full bg-cream animate-float-up"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}

      {/* 최상단 비네트로 깊이감 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_55%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
}
