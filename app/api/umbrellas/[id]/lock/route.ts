import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()
const HOLD_MINUTES = 5

export async function POST(req:Request,{params}:{params:{id:string}}){
  const id = Number(params.id)

  // check eventActive
  const setting = await prisma.setting.findUnique({where:{key:'eventActive'}})
  if(setting?.value !== 'true') return NextResponse.json({message:'현재 우산 대여 행사가 진행중이 아닙니다.'},{status:403})

  // check umbrella status
  const umbrella = await prisma.umbrella.findUnique({where:{id}})
  if(!umbrella) return NextResponse.json({message:'우산을 찾을 수 없습니다.'},{status:404})
  if(umbrella.status === 'INSPECTION') return NextResponse.json({message:'우산 점검중입니다.'},{status:403})

  // check student active reservations not possible here because no auth - we will allow but check studentId later on confirm
  const token = randomUUID()
  const holdUntil = new Date(Date.now() + HOLD_MINUTES*60_000)

  try{
    // ensure no active reservation for this umbrella
    // using transaction: check for active reservation
    const existing = await prisma.reservation.findFirst({where:{umbrellaId:id, status:{in:['INPUTTING','CONFIRMED']}}})
    if(existing) return NextResponse.json({message:'이미 다른 학생이 정보입력중입니다.'},{status:409})

    const r = await prisma.reservation.create({data:{umbrellaId:id, token, status:'INPUTTING', holdUntil}})
    return NextResponse.json({reservationId:r.id, token:r.token, holdUntil:r.holdUntil},{status:201})
  } catch(e:any){
    return NextResponse.json({message:'오류 발생'},{status:500})
  }
}
