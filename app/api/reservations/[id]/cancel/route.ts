import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req:Request,{params}:{params:{id:string}}){
  const id = Number(params.id)
  const body = await req.json().catch(()=>({}))
  const { token } = body || {}

  const resv = await prisma.reservation.findUnique({where:{id}})
  if(!resv) return NextResponse.json({message:'예약 없음'},{status:404})
  if(resv.status !== 'INPUTTING') return NextResponse.json({message:'취소되었거나 만료되었습니다.'},{status:409})
  if(token && token !== resv.token) return NextResponse.json({message:'토큰 불일치'},{status:403})

  await prisma.reservation.update({where:{id}, data:{status:'CANCELLED'}})
  return NextResponse.json({message:'선점이 취소되었습니다.'})
}
