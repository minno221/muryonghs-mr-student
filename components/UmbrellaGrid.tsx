'use client'
import useSWR from 'swr'
import { useState, useEffect } from 'react'

const fetcher = (url:string)=> fetch(url).then(r=>r.json())

export default function UmbrellaGrid(){
  const {data, error, mutate} = useSWR('/api/umbrellas', fetcher, {refreshInterval: 5000})
  const [message, setMessage] = useState('')

  async function lock(id:number){
    setMessage('')
    const res = await fetch(`/api/umbrellas/${id}/lock`, {method:'POST'})
    if(res.status===201){
      const d = await res.json()
      // open prompt for info
      const studentId = prompt('학번을 입력하세요')
      const name = prompt('이름을 입력하세요')
      const phone = prompt('전화번호를 입력하세요')
      if(!studentId){
        // cancel
        await fetch(`/api/reservations/${d.reservationId}/cancel`, {method:'POST', headers: {'Content-Type':'application/json'}})
        setMessage('선점이 취소되었습니다.')
        mutate()
        return
      }
      const conf = await fetch(`/api/reservations/${d.reservationId}/confirm`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({token:d.token, studentId, name, phone})})
      if(conf.ok){
        setMessage('대여가 완료되었습니다.')
      } else {
        const err = await conf.json()
        setMessage(err.message||'오류')
      }
      mutate()
    } else {
      const err = await res.json()
      setMessage(err.message || '이미 다른 학생이 정보입력중입니다.')
      mutate()
    }
  }

  if(error) return <div>로드 중 오류</div>
  if(!data) return <div>로딩...</div>

  if(data.eventActive === false) {
    return <div className="p-6 bg-yellow-50 border border-yellow-200 rounded">현재 행사가 진행중이 아닙니다. 관리자에게 문의하세요.</div>
  }

  return (
    <div>
      {message && <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded">{message}</div>}
      <div className="grid grid-cols-4 gap-4">
        {data.umbrellas.map((u:any)=> (
        <div key={u.id} className={`p-4 rounded shadow ${u.status === 'AVAILABLE' ? 'bg-white' : u.status === 'INSPECTION' ? 'bg-gray-100' : 'bg-yellow-50'}`}>
            <div className="font-medium">{u.code}</div>
            <div className="text-sm text-gray-500">상태: {u.status}</div>
            <div className="mt-2">
              <button disabled={u.status!=='AVAILABLE'} onClick={()=>lock(u.id)} className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50">선점하기</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
