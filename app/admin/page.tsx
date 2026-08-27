import Link from 'next/link'

export default function AdminPage(){
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">관리자 대시보드 (프로토타입)</h2>
      <p className="mb-4">관리자 기능은 API 호출(헤더 x-admin-code: 3587)로 보호되어 있습니다. 간편 구현으로 로그인 폼 대신 헤더 사용을 권장합니다.</p>
      <div className="space-y-2">
        <Link href="/admin/ui" className="inline-block px-3 py-2 bg-blue-600 text-white rounded">관리 UI 열기</Link>
      </div>
    </div>
  )
}
