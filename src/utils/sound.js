/**
 * Web Audio API로 부드러운 차임벨 생성.
 * 외부 오디오 에셋 없이 의존성 0으로 알림음 재생.
 */

let audioCtx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  // 일부 브라우저는 suspended 상태로 시작 — 사용자 제스처 후 resume
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * 부드러운 3음 알페지오 차임 (C5-E5-G5).
 * 타이머 세션 전환 시 호출.
 */
export function playChime() {
  const ctx = getCtx();
  if (!ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    const start = now + i * 0.16;
    const peak = 0.22;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);

    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 1.5);
  });
}
