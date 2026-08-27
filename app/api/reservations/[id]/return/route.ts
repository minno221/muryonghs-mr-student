import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function isAdmin(req:Request){
  const admin = process.env.ADMIN_CODE || '3587'
  try{
    const body = (req as any).json ? null : null
  }catch(e){}
  const code = (req.headers.get('x-admin-code')) || ''
  return code === admin
}

export async function POST(req:Request,{params}:{params:{id:string}}){
  if(!isAdmin(req)) return NextResponse.json({message:'admin only'},{status:403})
  const id = Number(params.id)
  const resv = await prisma.reservation.findUnique({where:{id}})
  if(!resv) return NextResponse.json({message:'예약 없음'},{status:404})
  if(resv.status !== 'CONFIRMED') return NextResponse.json({message:'대여중인 상태가 아닙니다.'},{status:409})
  await prisma.reservation.update({where:{id}, data:{status:'RETURNED', returnedAt:new Date()}})
  await prisma.umbrella.update({where:{id:resv.umbrellaId}, data:{status:'AVAILABLE'}})
  return NextResponse.json({message:'반납 처리 완료'})
}
