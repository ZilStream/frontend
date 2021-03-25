import Link from 'next/link'
import React from 'react'

export default function Custom404() {
  return (
    <div className="py-12 text-center">
      <h1 className="mb-8">Couldn't find anything here</h1>
      <Link href="/">
        <a className="bg-gray-300 dark:bg-gray-800 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200">Go back to Tokens</a>
      </Link>
    </div>
  )
}