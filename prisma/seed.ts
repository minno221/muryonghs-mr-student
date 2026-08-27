import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
  const count = await prisma.umbrella.count()
  if(count === 0){
    const items = Array.from({length:12}).map((_,i)=>({code:`U-${(i+1).toString().padStart(2,'0')}`}))
    await prisma.umbrella.createMany({data:items})
    console.log('Seeded umbrellas')
  }
  // ensure eventActive setting
  const s = await prisma.setting.upsert({where:{key:'eventActive'}, update:{value:process.env.EVENT_ACTIVE ?? 'false'}, create:{key:'eventActive', value:process.env.EVENT_ACTIVE ?? 'false'}})
  console.log('Setting ensured', s)
}

main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>process.exit())
