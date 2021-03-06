import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="bg-white dark:bg-gray-800 flex items-center p-4 mb-4 text-black dark:text-white">
      <div className="mr-8">
        <Link href="/">TinyZIl</Link>
      </div>
      <div className="flex-grow">
        <nav>
          <Link href="/">
            <a>Learn</a>
          </Link>
        </nav>
      </div>
      <div className="w-64">
        <input type="text" placeholder="Search blocks, transactions and addresses" className="w-full" />
      </div>
    </div>
  )
}