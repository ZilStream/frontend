import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="bg-white dark:bg-gray-800 mb-4 py-3 px-4 flex items-center text-black dark:text-white">
      <Link href="/">
        <a className="flex items-center justify-center">
          <picture style={{width: '110px', height: '30px'}}>
            <source srcSet="/logo-dark.svg" media="(prefers-color-scheme: dark)" />
            <img src="/logo.svg" />
          </picture> 
        </a>
      </Link>
    </div>
  )
}