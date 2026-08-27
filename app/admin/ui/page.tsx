'use client'
import { useState, useEffect } from 'react'

export default function AdminUI(){
  const [eventActive, setEventActive] = useState(false)
  const [code, setCode] = useState('')
  const [auth, setAuth] = useState(false)

  async function login(e:any){
    e.preventDefault()
    if(code==='3587'){ setAuth(true) } else { alert('코드 불일치') }
  }

  async function toggle(){
    const res = await fetch('/api/admin/toggle-event', {method:'POST', headers: {'content-type':'application/json','x-admin-code':code}, body: JSON.stringify({active:!eventActive})})
    if(res.ok){ setEventActive(!eventActive); alert('토글 성공') }
  }

  return (
    <div>
      {!auth ? (
        <form onSubmit={login} className="max-w-sm">
          <label className="block mb-2">관리자 인증번호 입력</label>
          <input value={code} onChange={e=>setCode(e.target.value)} className="border p-2 mb-2 w-full" />
          <button className="px-3 py-2 bg-blue-600 text-white rounded">로그인</button>
        </form>
      ) : (
        <div>
          <div className="mb-4">관리자로 로그인되었습니다.</div>
          <button onClick={toggle} className="px-3 py-2 bg-green-600 text-white rounded">행사 토글</button>
          <p className="text-sm text-gray-500 mt-2">현재 eventActive 값을 서버에서 조회하려면 새로고침 필요</p>
        </div>
      )}
    </div>
  )
}
