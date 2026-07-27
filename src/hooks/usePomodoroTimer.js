import { useCallback, useEffect, useRef, useState } from "react";

/**
 * usePomodoroTimer — 뽀모도로 타이머 핵심 로직.
 *
 * - 타임스탬프 기반 카운트다운: setInterval 쓰로틀(백그라운드 탭)에도
 *   복귀 시 정확한 남은 시간으로 보정.
 * - 세션 종료 시 자동으로 다음 모드로 전환(집중 → 휴식 → 집중 …).
 * - onSessionComplete 콜백으로 알림/소리 트리거.
 *
 * @param {object} opts
 * @param {number} opts.focusSeconds       집중 구간 길이(초)
 * @param {number} opts.breakSeconds       휴식 구간 길이(초)
 * @param {number} opts.targetSessions     한 사이클 목표 집중 횟수
 * @param {(info: {from:string,to:string,completed:number}) => void} opts.onSessionComplete
 */
export function usePomodoroTimer({
  focusSeconds = 25 * 60,
  breakSeconds = 5 * 60,
  targetSessions = 4,
  onSessionComplete,
}) {
  const [mode, setMode] = useState("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(focusSeconds);

  // tick 내부에서 최신값을 안전하게 읽기 위한 ref들
  const modeRef = useRef(mode);
  const completedRef = useRef(completedSessions);
  const focusRef = useRef(focusSeconds);
  const breakRef = useRef(breakSeconds);
  const onCompleteRef = useRef(onSessionComplete);
  const endAtRef = useRef(null); // 현재 구간 종료 시각(ms)

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { completedRef.current = completedSessions; }, [completedSessions]);
  useEffect(() => { focusRef.current = focusSeconds; }, [focusSeconds]);
  useEffect(() => { breakRef.current = breakSeconds; }, [breakSeconds]);
  useEffect(() => { onCompleteRef.current = onSessionComplete; }, [onSessionComplete]);

  const fullFor = useCallback((m) => (m === "focus" ? focusRef.current : breakRef.current), []);

  // 설정이 바뀌었을 때(미실행 중) 남은 시간을 새 기본값으로 리셋.
  // 일시정지(pause)는 focusSeconds/breakSeconds/mode를 바꾸지 않으므로 여기서 건드리지 않음.
  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(mode === "focus" ? focusSeconds : breakSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSeconds, breakSeconds, mode]);

  /** 다음 구간으로 자동 전환 */
  const advance = useCallback(() => {
    const current = modeRef.current;
    const next = current === "focus" ? "break" : "focus";
    let nextCompleted = completedRef.current;

    if (current === "focus") {
      nextCompleted = completedRef.current + 1;
      setCompletedSessions(nextCompleted);
      completedRef.current = nextCompleted;
    }

    setMode(next);
    modeRef.current = next;

    const nextSeconds = fullFor(next);
    setSecondsLeft(nextSeconds);
    endAtRef.current = Date.now() + nextSeconds * 1000;

    onCompleteRef.current?.({ from: current, to: next, completed: nextCompleted });
  }, [fullFor]);

  // 카운트다운 인터벌 — isRunning일 때만 동작
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const remaining = Math.round((endAtRef.current - Date.now()) / 1000);
      if (remaining <= 0) {
        advance();
      } else {
        setSecondsLeft(remaining);
      }
    }, 250);
    return () => clearInterval(id);
  }, [isRunning, advance]);

  const start = useCallback(() => {
    setIsRunning((running) => {
      if (running) return running;
      endAtRef.current = Date.now() + secondsLeft * 1000;
      return true;
    });
  }, [secondsLeft]);

  const pause = useCallback(() => setIsRunning(false), []);

  const toggle = useCallback(() => {
    setIsRunning((running) => {
      if (running) return false;
      endAtRef.current = Date.now() + secondsLeft * 1000;
      return true;
    });
  }, [secondsLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    endAtRef.current = null;
    setSecondsLeft(fullFor(modeRef.current));
  }, [fullFor]);

  const switchMode = useCallback((m) => {
    setIsRunning(false);
    endAtRef.current = null;
    setMode(m);
    modeRef.current = m;
    setSecondsLeft(fullFor(m));
  }, [fullFor]);

  const resetCompleted = useCallback(() => setCompletedSessions(0), []);

  const currentFull = mode === "focus" ? focusSeconds : breakSeconds;
  const progress = currentFull > 0 ? 1 - secondsLeft / currentFull : 0;

  return {
    mode,
    isRunning,
    secondsLeft,
    completedSessions,
    targetSessions,
    progress,
    formatted: formatTime(secondsLeft),
    start,
    pause,
    toggle,
    reset,
    switchMode,
    resetCompleted,
  };
}

/** 초 → "MM:SS" (100분 이상이면 "H:MM:SS") */
export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}
