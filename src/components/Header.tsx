import React from 'react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="flex-shrink-0 flex-grow-0 bg-white dark:bg-gray-800">
      <div className="container flex items-center py-3 px-4 text-black dark:text-white">
        <Link href="/">
          <a className="flex items-center justify-center">
            <picture style={{width: '110px', height: '30px'}}>
              <source srcSet="/logo-dark.svg" media="(prefers-color-scheme: dark)" />
              <img src="/logo.svg" />
            </picture> 
          </a>
        </Link>
      </div>
    </div>
  )
}