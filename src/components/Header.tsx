import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="py-20 text-center text-4xl font-bold text-black dark:text-white">
      <Link href="/">ZilStream</Link>
    </div>
  )
}