/**
 * 테마 메타데이터.
 * 실제 색상 값은 index.css의 [data-theme="..."] 블록에 정의됨.
 * 여기서는 UI(스와치 미리보기)용 정보만 제공.
 */
export const THEMES = [
  {
    id: "midnight",
    name: "미드나이트",
    desc: "차분한 인디고 + 피치",
    swatch: ["#15121f", "#f7a8a0", "#9d8ec7", "#7fd3a8"],
  },
  {
    id: "matcha",
    name: "말차 라떼",
    desc: "따뜻한 올리브 + 골드",
    swatch: ["#141810", "#d9b87a", "#9fc08a", "#7fcfa0"],
  },
  {
    id: "dusk",
    name: "선셋 블룸",
    desc: "따뜻한 플럼 + 코랄",
    swatch: ["#1d121b", "#ff9a73", "#d98aae", "#ffb066"],
  },
  {
    id: "tide",
    name: "오션 헤이즈",
    desc: "차가운 블루 + 틸",
    swatch: ["#0e161f", "#5fbfb4", "#7ba5d9", "#6fd4c4"],
  },
];

export const DEFAULT_THEME = "midnight";
