export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(){
  // lazy expire
  await prisma.$executeRaw`UPDATE Reservation SET status='EXPIRED' WHERE status='INPUTTING' AND holdUntil <= datetime('now')`

  const setting = await prisma.setting.findUnique({where:{key:'eventActive'}})
  const eventActive = setting?.value === 'true'

  const umbrellas = await prisma.umbrella.findMany({orderBy:{id:'asc'}, include:{reservations:{where:{status:{in:['INPUTTING','CONFIRMED']}}}}})
  const mapped = umbrellas.map((u:any)=>({id:u.id, code:u.code, status:u.status, activeReservations: u.reservations}))
  return NextResponse.json({eventActive, umbrellas:mapped})
}
