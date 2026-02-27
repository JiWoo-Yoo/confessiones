"use client"

import { useState } from "react"

export default function SvgTestPage() {
  const [lastClicked, setLastClicked] = useState<string>('없음')

  const logClick = (name: string) => setLastClicked(name)

  return (
    <div className="p-8 bg-white min-h-screen text-black">
      <h1 className="text-2xl font-bold mb-4">실무 클릭 이슈 실험실</h1>
      <p className="mb-8 text-gray-600">최근 클릭된 버튼: <span className="font-bold text-blue-600">{lastClicked}</span></p>

      <section className="space-y-12">
        {/* CASE 1: 가상 요소(::before)의 침범 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">1. 가상 요소(::before) 히트박스 침범</h2>
          <p className="text-sm text-gray-500 mb-4">닫기 버튼을 눌러보려고 하지만, 우측 검색 버튼의 투명한 확장 영역이 덮고 있음.</p>
          <div className="flex items-center gap-2 bg-gray-100 p-4 w-fit rounded">
            {/* 닫기 버튼 */}
            <button 
              onClick={() => logClick('닫기 버튼')}
              className="w-8 h-8 bg-red-400 flex items-center justify-center text-white relative"
            >
              X
            </button>
            {/* 검색 버튼 (확장 영역이 큼) */}
            <button 
              onClick={() => logClick('검색 버튼 (범인)')}
              className="w-8 h-8 bg-blue-400 flex items-center justify-center text-white relative 
                         before:absolute before:inset-[-20px] before:bg-blue-500/20 before:content-['']"
            >
              🔍
            </button>
          </div>
          <p className="mt-2 text-xs text-red-500">* 연한 파란색 영역이 검색 버튼의 실제 클릭 범위</p>
        </div>

        {/* CASE 2: 절대 위치(Absolute) 요소의 투명한 덮침 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">2. Absolute 타이틀의 영역 침범</h2>
          <p className="text-sm text-gray-500 mb-4">중앙 타이틀의 width가 넓어서 우측 아이콘의 왼쪽 절반을 가리고 있는 상황.</p>
          <div className="relative flex items-center justify-end bg-gray-100 p-4 h-14 w-full max-w-md rounded">
            {/* 중앙 타이틀 (투명하지만 영역을 차지함) */}
            <div className="absolute left-1/2 -translate-x-1/2 w-full text-center pointer-events-auto">
              <span className="bg-green-200/50 px-20 py-2">가운데 긴 타이틀</span>
            </div>
            {/* 우측 아이콘 */}
            <button 
              onClick={() => logClick('우측 아이콘')}
              className="z-0 w-8 h-8 bg-gray-800 text-white rounded flex items-center justify-center"
            >
              ⚙️
            </button>
          </div>
          <p className="mt-2 text-xs text-red-500">* 초록색 박스 영역이 아이콘 위를 덮고 있으면 아이콘 클릭 불가</p>
        </div>

        {/* CASE 3: SVG ViewBox와 실제 Path의 불일치 */}
        <div>
          <h2 className="text-lg font-semibold mb-2">3. SVG 내부 좌표 불일치 (Phantom Area)</h2>
          <p className="text-sm text-gray-500 mb-4">아이콘은 오른쪽 아래에 치우쳐 있는데, SVG 자체는 왼쪽 위부터 영역을 차지함.</p>
          <div className="flex gap-4">
            <div 
              onClick={() => logClick('SVG 전체 영역')}
              className="border-2 border-dashed border-red-300 p-2 cursor-pointer"
            >
              <svg width="100" height="100" viewBox="0 0 100 100" className="bg-yellow-50">
                <circle cx="80" cy="80" r="15" fill="black" onClick={(e) => { e.stopPropagation(); logClick('SVG 원(Path)'); }} />
              </svg>
            </div>
            <div className="text-sm text-gray-600">
              - 노란색 전체가 100x100 SVG 영역<br/>
              - 사용자는 검은 원을 누르려 하지만<br/>
              - 왼쪽 위 빈 공간을 눌러도 SVG 클릭으로 인식됨
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-200">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          초기화
        </button>
      </footer>
    </div>
  )
}
