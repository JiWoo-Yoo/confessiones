'use client';

import { useState } from "react";
import { createPortal } from "react-dom";

// 공통 박스 컴포넌트
const Box = ({
  name,
  color,
  zIndex,
  style,
  children,
}: {
  name: string;
  color: string;
  zIndex: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) => {
  return (
    <div
      style={{
        width: 220,
        height: 150,
        backgroundColor: color,
        zIndex,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: 16,
        gap: 8,
        borderRadius: 16,
        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        color: "white",
        ...style,
      }}
    >
      <div className="text-center">
        <b className="text-lg font-bold block">{name}</b>
        <p className="text-sm text-white">{`z-index: ${zIndex}`}</p>
      </div>
      {children}
    </div>
  );
};

export default function ZIndexTestPage() {
    const [usePortal, setUsePortal] = useState(false);
    // 포탈이 붙을 실제 DOM 노드 (컨테이너).
    const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

    const zIndexYellow = 20;
    const zIndexRedParent = 10;
    const zIndex2_child = 9999;

    const blueStyle: React.CSSProperties = {
      position: "absolute",
      top: "70%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };

  return (
    <div className="p-20">
      {/* 포탈 토글 스위치 */}
      <div className="mb-10 text-center">
        <button 
          onClick={() => setUsePortal(!usePortal)}
          className={`px-6 py-2 rounded-full font-bold transition-all shadow-md ${
            usePortal ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
          }`}
        >
          {usePortal ? "Portal 탈출 활성화" : "Portal 미사용 (갇힘)"}
        </button>
      </div>

      {/* 실험장 */}
      <div
        ref={setPortalContainer}
        className="relative flex justify-center items-center border-2 border-dashed border-slate-300 h-[500px] bg-slate-50 rounded-2xl overflow-hidden"
      >
        {/* 노란 박스 - 형제, 더 높은 z-index (텍스트 여유 공간 확보) */}
        <Box
          name="일반 요소"
          color="#FFD700"
          zIndex={zIndexYellow}
          style={{ marginRight: '-32px' }} // 살짝만 겹치도록
        />

        {/* 빨간 부모 - 쌓임 맥락 생성 (transform 사용) */}
        <Box
          name="쌓임맥락 루트"
          color="#FF0000"
          zIndex={zIndexRedParent}
          style={{ marginLeft: '-32px', transform: 'translateZ(0)' }} // 노란 박스와 살짝만 겹치게 배치
        >
          <p style={{ fontSize: 12, marginTop: 8 }}>
            {usePortal
              ? '자식: Portal 사용 (컨테이너로 탈출)'
              : '자식: Portal 미사용 (이 쌓임맥락 안에 갇힘)'}
          </p>

          {/* Portal 미사용: 빨간 부모 쌓임맥락 안에 있는 자식 (같은 위치) */}
          {!usePortal && (
            <Box
              name="파란 자식 (Portal 미사용)"
              color="#0000FF"
              zIndex={zIndex2_child}
              style={blueStyle}
            />
          )}
        </Box>

        {/* Portal 사용: 빨간 부모 쌓임맥락 탈출 */}
        {usePortal && portalContainer &&
          createPortal(
            <Box
              name="파란 자식 (Portal)"
              color="#0000FF"
              zIndex={zIndex2_child}
              style={blueStyle}
            />,
            portalContainer
          )}
      </div>
    </div>
  );
}