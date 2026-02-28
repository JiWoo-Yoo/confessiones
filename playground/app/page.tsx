"use client"

import { useState } from "react"
import Link from "next/link";

export default function Home() {
  const [isPaused, setIsPaused] = useState(false)

  return (
    <div className="">
      <h1 className="text-2xl font-bold sticky top-0 bg-white text-center">Test Playground</h1>
      <hr />
      <div className="relative flex flex-col items-center">
        <div
          className={`w-fit flex flex-col justify-center items-center gap-4 p-4 m-50 rounded-lg border-2 border-dashed `}
          style={{
            animation: 'spin 2s linear infinite',
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        {/* write here to test */}
        <Link href="/zindex-stacking" className="text-blue-500 hover:text-blue-700 transition-colors">01. z-index 쌓임 맥락 테스트</Link>
        <Link href="/svg-ghost-click" className="text-blue-500 hover:text-blue-700 transition-colors">02. svg 버튼 클릭 테스트</Link>
        <Link href="/video-codec-chaos" className="text-blue-500 hover:text-blue-700 transition-colors">03. 브라우저에 따른 코덱 지원 차이</Link>
        </div>
      </div>
    </div>
  );
}