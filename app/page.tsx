import Link from 'next/link'
import UmbrellaGrid from '../components/UmbrellaGrid'

export default async function Page(){
  // fetch umbrellas
  return (
    <div>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">학교 양심우산 포털 (프로토타입)</h1>
        <Link href="/admin" className="text-sm text-blue-600">관리자</Link>
      </header>

      <section className="mb-6">
        <p className="text-sm text-gray-600">행사 진행 여부에 따라 접근 권한이 달라집니다. (관리자만 접근 가능하면 우산 대여 불가)</p>
      </section>

      <UmbrellaGrid />
    </div>
  )
}
