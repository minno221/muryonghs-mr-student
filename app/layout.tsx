import './globals.css'
import React from 'react'

export const metadata = {
  title: '학생 우산 포털(프로토타입)'
}

export default function RootLayout({ children }:{children:React.ReactNode}){
  return (
    <html lang="ko">
      <body>
        <main className="max-w-4xl mx-auto p-6">{children}</main>
      </body>
    </html>
  )
}
