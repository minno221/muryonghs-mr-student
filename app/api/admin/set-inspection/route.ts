import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function isAdmin(req:Request){
  const admin = process.env.ADMIN_CODE || '3587'
  const code = req.headers.get('x-admin-code') || ''
  return code === admin
}

export async function POST(req:Request){
  if(!isAdmin(req)) return NextResponse.json({message:'admin only'},{status:403})
  const body = await req.json()
  const { umbrellaId, setInspection } = body
  const u = await prisma.umbrella.findUnique({where:{id:umbrellaId}, include:{reservations:true}})
  if(!u) return NextResponse.json({message:'우산 없음'},{status:404})
  // if setInspection true -> force return any CONFIRMED
  if(setInspection){
    const confirmed = await prisma.reservation.findMany({where:{umbrellaId, status:'CONFIRMED'}})
    for(const c of confirmed){
      await prisma.reservation.update({where:{id:c.id}, data:{status:'RETURNED', returnedAt:new Date()}})
    }
    await prisma.umbrella.update({where:{id:umbrellaId}, data:{status:'INSPECTION'}})
    return NextResponse.json({message:'점검모드 설정됨, 기존 대여는 반납 처리됨'})
  } else {
    await prisma.umbrella.update({where:{id:umbrellaId}, data:{status:'AVAILABLE'}})
    return NextResponse.json({message:'점검모드 해제됨'})
  }
}
