# 03. 브라우저 환경에 따라 영상이 재생 안되는 경우의 대환장 상황

[playground 페이지 확인](https://confessiones.vercel.app/video-codec-chaos)
(\*playground에서는 ffmpeg.wasm을 활용한 클라이언트 사이드 변환 테스트 예정)

## 📌 Issue Overview

실무 프로젝트 진행 중, 메인 배경 비디오가 환경에 따라 제각각으로 동작하는 '카오스' 상태 발생.

- **현상**: Chrome(PC)에선 정상이나, **Safari 전체 및 일부 저사양 안드로이드**에서 영상 대신 검은 화면(Blackout) 출력.
- **원인 가설**: 처음에는 단순히 '브라우저가 지원하지 않는 포맷'이라 생각했으나, 같은 `.mp4` 파일임에도 기기 사양과 브라우저 엔진에 따라 재생 여부가 갈리는 것을 확인.

## 🔍 분석 및 해결 (내가 이해한 범위)

### 1. 비디오 사양 등급(Profile)과 호환성

- **이해한 내용**: 같은 H.264 코덱이라도 비디오가 요구하는 사양 등급(Profile)이 너무 높으면, 저사양 기기나 사파리 브라우저가 이를 해석하지 못하고 재생을 포기함.
- **해결**: FFmpeg를 사용하여 호환성이 가장 높은 표준 등급(`Main Profile`)으로 사양을 낮추어 재인코딩 수행.

### 2. 메타데이터 위치와 초기 로딩 (Moov Atom)

- **이해한 내용**: 영상의 정보(목차)가 파일 끝에 위치하면, 브라우저가 파일을 끝까지 다 다운로드하기 전까지 첫 화면을 띄우지 못함.
- **해결**: `faststart` 옵션을 통해 메타데이터를 파일 최상단으로 옮겨, 스트리밍 시작과 동시에 즉시 재생되도록 최적화.

### 3. 선제적 방어: 업로드 제한 전략 (Validation)

- **아이디어**: 서버 부하를 줄이기 위해, 호환성이 검증된 특정 규격(MP4, H.264/AVC)만 업로드 가능하도록 프론트엔드에서 1차 검증.
- **구현 방향**: `input` 태그의 `accept` 속성뿐만 아니라, JavaScript를 이용해 파일의 MIME type과 브라우저 재생 가능 여부(`canPlayType`)를 체크하여 유저에게 즉각적인 피드백 제공.

## 🛠️ 적용한 FFmpeg 변환 명령어

```
ffmpeg -i input.mp4 -vcodec libx264 -profile:v main -level 3.0 -pix_fmt yuv420p -movflags +faststart output.mp4
```

- **`-profile:v main -level 3.0`**: 비디오 사양 등급을 낮추어 구형 스마트폰 및 사파리 브라우저까지 아우르는 범용 호환성 확보.
- **`-pix_fmt yuv420p`**: 고사양 색상 포맷을 8-bit 표준 색역으로 강제 변환하여 디코딩 안정성 확보.
- **`-movflags +faststart`**: 메타데이터를 파일 최상단으로 옮겨 스트리밍 시작과 동시에 즉시 재생 유도.

---

## 🚀 Post-Mortem: 실무 최적화 및 미래 아키텍처 제언

이 문제를 해결하며 프론트엔드 지식을 넘어 비디오 엔지니어링과 인프라 설계의 중요성을 체감함. 향후 프로젝트에서 지향할 **비디오 서비스 전략**을 다음과 같이 정리함.

### 1. 상황에 따른 구현 전략 (Strategy)

비디오 변환은 리소스를 많이 사용하는 작업이므로, 서비스 규모에 따라 세 가지 대안을 검토함.

- **Client-side (ffmpeg.wasm)**: 서버 비용은 없으나 유저 기기 부하가 큼. 특수한 로컬 편집 툴에 적합.
- **Backend-centric (Server FFmpeg)**: 제어권이 높으나 대량 업로드 시 서버 자원 고갈 위험. 소규모/사내 시스템에 적합.
- **Infrastructure-centric (S3 + Lambda)**: 가장 확장성이 높고 메인 서버 부하가 없는 설계 방식. 대규모 상용 서비스에 적합.

### 2. 클라우드 기반 서버리스 파이프라인

- **S3 Direct Upload**: 보안을 위해 **Presigned URL**을 발급받아 서버를 거치지 않고 S3로 직접 업로드.
- **Lambda Transcoder**: 파일 업로드 시 이벤트를 트리거하여 자동 변환 수행.

### 3. 비동기 사용자 경험 및 운영 전략

- **UX**: Webhook 또는 폴링을 통해 변환 상태를 실시간으로 유저에게 알리는 UI 구축 지향.
- **Retention**: **Soft Delete**로 데이터 유실을 방지하고, S3 **Lifecycle Policy**를 통해 30일 후 자동 Hard Delete 수행하여 비용 최적화.

### 4. 추가 학습이 필요한 전문 지식 (Deep Dive)

- **Bit Depth**: 10-bit 고화질 영상이 일반 GPU 가속에 미치는 영향 학습.
- **Video Engineering**: 기기별 하드웨어 디코더의 한계와 `YUV 4:2:0` 색상 샘플링 방식의 이해.

## 🔗 Reference

- [Apple Developer: HLS Authoring Specification](https://developer.apple.com/documentation/http-live-streaming/hls-authoring-specification-for-apple-devices) - Apple 기기 호환성을 위한 기술 표준
- [FFmpeg Wiki: H.264 Video Encoding Guide](https://trac.ffmpeg.org/wiki/Encode/H.264) - 웹 최적화 인코딩 옵션 가이드
- [MDN Web Docs: Video Codec Guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs) - 브라우저별 미디어 지원 현황
