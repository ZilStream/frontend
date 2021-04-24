import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon } from 'react-feather'
import { useTheme } from 'next-themes'
import ConnectWallet from './ConnectWallet'
import useComponentVisible from 'utils/useComponentVisible'
import { useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import Account from './Account'

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme, resolvedTheme} = useTheme()
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false)

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

          {accountState.isConnected ? (
            <button 
              className="bg-gray-900 py-1 px-3 rounded-full font-bold ml-4 text-sm focus:outline-none" 
              onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
              {accountState.address.substr(0, 5) + '...' + accountState.address.substr(accountState.address.length-4,4)}
            </button>
          ) : (
            <button 
              className="bg-gray-900 py-1 px-3 rounded-full font-bold ml-4 text-sm focus:outline-none" 
              onClick={() => setIsComponentVisible(!isComponentVisible)}
            >
              Connect wallet
            </button>
          )
          }
        </div>
      </div>

      {!accountState.isConnected && isComponentVisible &&
        <ConnectWallet innerRef={ref} dismissAction={() => setIsComponentVisible(false)} />
      }

      {accountState.isConnected && isComponentVisible &&
        <Account innerRef={ref} dismissAction={() => setIsComponentVisible(false)} />
      }
    </div>
  )
}

export default Header