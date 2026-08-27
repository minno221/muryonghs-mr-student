import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(req:Request,{params}:{params:{id:string}}){
  const id = Number(params.id)
  const body = await req.json()
  const { token, studentId, name, phone } = body
  if(!token) return NextResponse.json({message:'missing token'},{status:400})

  const resv = await prisma.reservation.findUnique({where:{id}})
  if(!resv || resv.token !== token) return NextResponse.json({message:'예약을 찾을 수 없거나 토큰이 일치하지 않습니다.'},{status:404})
  if(resv.status !== 'INPUTTING') return NextResponse.json({message:'예약 상태가 유효하지 않습니다.'},{status:409})
  if(resv.holdUntil && new Date(resv.holdUntil) < new Date()){
    await prisma.reservation.update({where:{id}, data:{status:'EXPIRED'}})
    return NextResponse.json({message:'선점 시간이 만료되었습니다.'},{status:410})
  }

  // check student active reservation
  if(studentId){
    const conflict = await prisma.reservation.findFirst({where:{studentId, status:{in:['INPUTTING','CONFIRMED']}}})
    if(conflict) return NextResponse.json({message:'이미 선점하거나 대여 중입니다.'},{status:409})
  }

  // confirm
  await prisma.reservation.update({where:{id}, data:{studentId, name, phone, status:'CONFIRMED', confirmedAt:new Date()}})
  await prisma.umbrella.update({where:{id:resv.umbrellaId}, data:{status:'IN_USE'}})
  return NextResponse.json({message:'확정되었습니다.'})
}
