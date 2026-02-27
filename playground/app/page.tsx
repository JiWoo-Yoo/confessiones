import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <h1 className="text-2xl font-bold sticky top-0 bg-white text-center">Test Playground</h1>
      <hr />
      <div className="flex justify-center items-center gap-4 p-4">      
        {/* write here to test */}
        <Link href="/zindex-stacking" className="text-blue-500">01. z-index 쌓임 맥락 테스트</Link>
        <Link href="/svg-ghost-click" className="text-blue-500">02. svg 버튼 클릭 테스트</Link>
      </div>
    </div>
  );
}