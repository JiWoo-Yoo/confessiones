# 02. svg아이콘이 버튼 클릭을 방해하는 현상 (원인 불명 이슈)

[playground 페이지 보기](https://confessiones.vercel.app/svg-ghost-click)

### 💥 사건 발생

- 모바일 화면에서, x나 검색버튼같은 svg 아이콘을 누르면 인식(클릭)이 안되고 살짝 옆을 눌렀을 때만 인식(클릭)이 되는 문제가 있었음
- 컨테이너와 x버튼 부분만 playground에 옮겨서 테스트했을 때는 제대로 인식 됨.

### 🔍 원인 분석 (The Void)

- **이유 & 현상 추측**:
  - 추측1(CASE1): 가상 요소 히트박스 침범
  - 추측2(CASE2): Absolute 타이틀의 영역 침범
  - 추측3(CASE3): svg 내부 좌표 불일치
    (실제 서비스 코드에서는 정확한 root cause를 찾지 못해, 유사 상황을 playground에서 세 가지 패턴으로 재현해보았다.)

### 🛡️ 해결책 (Resolution)

- '침범하는 쪽'이 단순 디자인이나 껍데기일 때: pointer-events:none
- '침범하는 쪽'도 클릭 필요할 때: width, height를 svg크기와 맞추고, 여백은 padding보다는 margin으로 하여 불필요한 클릭공간 줄이기

### 📝 실무 팁

- pointer-events: none;을 부여한 요소는 클릭해도 해당 요소를 통과하여 뒤의 요소부터 클릭에 반응한다.
