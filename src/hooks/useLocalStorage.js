import { useEffect, useRef, useState } from "react";

/**
 * useLocalStorage — useState와 동일한 API이지만 값을 localStorage에 동기화.
 * JSON 직렬화로 객체/배열도 저장 가능.
 *
 * @param {string} key      localStorage 키
 * @param {*} initialValue  최초 기본값 (값이 없을 때)
 * @returns {[value, setValue]} useState 호환 튜플
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // 값이 바뀔 때마다 localStorage에 저장 (디바운스는 생략, 값이 작으므로)
  const keyRef = useRef(key);
  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(keyRef.current, JSON.stringify(value));
    } catch {
      /* 스토리지 가득 참 / 프라이빗 모드 등 — 무시 */
    }
  }, [value]);

  return [value, setValue];
}
