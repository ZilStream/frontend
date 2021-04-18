import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon } from 'react-feather'
import { useTheme } from 'next-themes'

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme, resolvedTheme} = useTheme()

  useEffect(() => setMounted(true), [])

  if(!mounted) return null
  
  return (
    <div className="flex-shrink-0 flex-grow-0 bg-white dark:bg-gray-800">
      <div className="container flex items-center py-3 px-4 text-black dark:text-white">
        <div className="flex-grow flex items-center justify-start">
          <Link href="/">
            <a className="flex items-center justify-center">
              {resolvedTheme === 'dark' ? (
                <img src="/logo-dark.svg" style={{width: '110px', height: '30px'}} />
              ) : (
                <img src="/logo.svg" style={{width: '110px', height: '30px'}} />
              )}
            </a>
          </Link>
          
          <nav className="ml-8 text-sm">
            <Link href="/">
              <a>Rankings</a>
            </Link>

            <Link href="/portfolio">
              <a className="ml-5">Portfolio</a>
            </Link>
          </nav>
        </div>
        <div className="flex items-center">
          <button  
            onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
            className="focus:outline-none">
            <Moon size={18} />
          </button>

          <button className="font-semibold ml-4 text-sm">
            Connect wallet
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header