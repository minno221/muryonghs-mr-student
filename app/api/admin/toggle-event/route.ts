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
  const { active } = body
  await prisma.setting.upsert({where:{key:'eventActive'}, create:{key:'eventActive', value:active? 'true':'false'}, update:{value: active? 'true':'false'}})
  return NextResponse.json({message:'eventActive set', active})
}
