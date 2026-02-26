# 01. z-index가 무시되는 현상 (Stacking Context)

### 💥 사건 발생

- 분명히 모달(Modal)의 `z-index`를 9999로 줬는데, 그보다 숫자가 훨씬 낮은 일반 컴포넌트 뒤로 숨어버리는 현상 발생.
- "숫자를 더 높이면 되겠지" 하고 999999를 줘봤으나 여전히 해결 안 됨.
- 실무 당시 "쌓임 맥락"을 모르고 구글링해서 React Portal을 사용하게 되었다. 이제는 이 원리에 대해 좀 더 파악하고 사용하자.

### 🔍 원인 분석 (The Void)

- **이유**: 부모 요소가 아래의 쌓임 맥락(Stacking Context) 생성 조건 중 하나에 해당하여 **새로운 쌓임 맥락(Stacking Context)**이 생성됨.
- **현상**: z-index는 같은 '맥락' 안에서만 서열을 다툼. 부모가 새로운 맥락을 만들어버리면, 그 안의 자식들은 아무리 숫자가 높아도 부모의 서열을 벗어날 수 없음. (의도치 않게 자식들을 새로운 세계에 감금)

#### [쌓임 맥락을 만드는 부모의 조건]

- Position: relative / absolute + z-index가 숫자인 경우, fixed / sticky인 경우

- Flex / Grid: 부모가 Flex/Grid이면서 자식의 z-index가 숫자인 경우

- Visual: opacity가 1보다 작을 때, filter가 none이 아닐 때

- Geometry: transform이 none이 아닐 때, clip-path가 적용됐을 때

- Explicit: isolation: isolate가 적용됐을 때

### 🛡️ 해결책 (Resolution)

1. **React Portal 사용**: 요소를 `body` 바로 아래로 렌더링시켜서 부모의 '쌓임 맥락' 영향권에서 완전히 탈출시킴. (가장 확실한 방법)
2. **구조 변경**: 쌓임 맥락을 유발하는 속성(예: `transform`)을 가진 부모 밖으로 요소를 이동시킴.
3. **isolation 속성**: 필요한 경우 부모에게 `isolation: isolate;`를 주어 명시적으로 맥락을 관리함. (의도적으로 자식들을 새로운 세계에 감금)
