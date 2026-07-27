# Lo-Fi Focus

유튜브 Lofi 음악 재생과 뽀모도로 타이머가 결합된 집중력 관리 웹앱.
좋아하는 노동요를 들으며 25분 집중 / 5분 휴식 사이클을 관리할 수 있는 아늑한 감성의 타이머.

백엔드 없이 순수 프론트엔드(React + Vite + Tailwind)로 동작하며, 모든 설정은 브라우저 localStorage에 저장됩니다.

## 주요 기능

- **뽀모도로 타이머** — 25분 집중 / 5분 휴식 기본 사이클, 시작·일시정지·초기화, 세션 종료 시 자동 전환
- **알림** — 세션 전환 시 브라우저 Notification + Web Audio 차임벨(별도 음원 없음)
- **유튜브 백그라운드 플레이어** — Lofi Girl 라이브 기본 재생, 링크/ID 입력으로 영상 교체, 재생·일시정지·볼륨 조절
- **설정 영속화** — 집중/휴식 시간, 목표 사이클, 마지막 재생 영상, 볼륨을 localStorage에 저장
- **Lofi 감성 UI** — 다크 인디고 + 따뜻한 파스텔, 글래스모피즘, 떠다니는 글로우/먼지 입자

## 기술 스택

- React 19 + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite`)
- YouTube IFrame Player API
- Web Audio API / Notification API / localStorage

## 로컬 실행

```bash
npm install
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (dist/)
npm run preview    # 빌드 결과 미리보기
npm run lint       # oxlint
```

## 배포 (Vercel)

1. 이 리포를 GitHub에 푸시
2. [Vercel 대시보드](https://vercel.com/new)에서 리포 import
3. Framework Preset: **Vite** (자동 감지)
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy 클릭

## 프로젝트 구조

```
src/
├─ App.jsx                     # 레이아웃 + 상태/훅 와이어링
├─ index.css                   # Tailwind 테마(Lofi 색상·애니메이션)
├─ components/
│  ├─ AmbientBackground.jsx    # 배경(글로우 오브 + 먼지 입자)
│  ├─ TimerDisplay.jsx         # 타이머(SVG 진행 링 + 컨트롤)
│  ├─ MusicPlayer.jsx          # 유튜브 컨트롤 바
│  ├─ SettingsModal.jsx        # 타이머 설정 모달
│  └─ icons.jsx                # 인라인 SVG 아이콘
├─ hooks/
│  ├─ useLocalStorage.js       # localStorage 동기화
│  ├─ usePomodoroTimer.js      # 타이머 카운트다운 로직
│  └─ useYouTubePlayer.js      # YouTube IFrame API 연동
└─ utils/
   ├─ notify.js                # Notification API
   └─ sound.js                 # Web Audio 차임벨
```

## 참고 사항

- 브라우저 자동재생 정책으로 인해 첫 로딩 시 음악이 바로 재생되지 않을 수 있습니다. 하단 재생 버튼을 한 번 누르면 정상 재생됩니다.
- 백그라운드 탭에서는 타이머 알림음이 탭 복귀 시점에 재생될 수 있습니다.
