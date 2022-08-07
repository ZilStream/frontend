import React, { useEffect, useState, Fragment } from 'react'
import Link from 'next/link'
import { ChevronDown, Moon } from 'react-feather'
import { useTheme } from 'next-themes'
import { useDispatch, useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import { useRouter } from 'next/router'
import StreamPopover from './StreamPopover'
import AccountPopover from './AccountPopover'
import ConnectPopover from './ConnectPopover'
import { ModalActionTypes } from 'store/modal/actions'
import { Menu, Transition } from '@headlessui/react'
import NotificationsPopover from './Notifications/NotificationsPopover'

const Header = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const {theme, setTheme, resolvedTheme} = useTheme()
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  useEffect(() => setMounted(true), [])

  const handleConnect = () => {
    dispatch({ type: ModalActionTypes.OPEN_WALLET, payload: true })
  }

  if(!mounted) return null
  
  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="container px-3 md:px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-10 flex items-center sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center sm:items-stretch justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a>
                  <img className="block lg:hidden h-8 w-auto" src="/logo.svg" alt="ZilStream" />
                  
                  {resolvedTheme === 'dark' ? (
                    <img className="hidden lg:block h-8 w-auto" src="/logo-text-dark.svg" />
                  ) : (
                    <img className="hidden lg:block h-8 w-auto" src="/logo-text.svg" />
                  )}
                </a>
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/">
                  <a className={router.pathname === '/' ? 'menu-item-active' : 'menu-item'} aria-current="page">Rankings</a>
                </Link>

                <Link href="/nft">
                  <a className={router.pathname.includes('/nft') ? 'menu-item-active' : 'menu-item'}>NFT <span className="bg-primary dark:bg-primaryDark dark:text-black text-xs py-1 px-2 rounded font-semibold ml-1">Beta</span></a>
                </Link>

                <Link href="/exchanges">
                  <a className={router.pathname.includes('/exchanges') ? 'menu-item-active' : 'menu-item'}>Exchanges</a>
                </Link>

                <Link href="/portfolio">
                  <a className={router.pathname.includes('/portfolio') ? 'menu-item-active' : 'menu-item'}>Portfolio</a>
                </Link>

                {/* <Link href="/swap">
                  <a className={router.pathname === '/swap' ? 'menu-item-active' : 'menu-item'}>Swap <span className="bg-primary dark:bg-primaryDark dark:text-black text-xs py-1 px-2 rounded font-semibold ml-1">New</span></a>
                </Link> */}

                <Menu as="div" className="inline-block relative">
                  <div>
                    <Menu.Button className="menu-item inline-flex items-center gap-1" onClick={() => setMoreOpen(!moreOpen)}>More <ChevronDown size={14} /></Menu.Button>
                  </div>
                  
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-opacity-20 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                      <div className="py-1" role="none">
                        <Menu.Item>
                          <Link href="/bridge">
                            <a className={router.pathname.includes('/bridge') ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 block px-4 py-2 text-sm' : 'text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700'}>Bridge</a>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link href="/vote">
                            <a className={router.pathname.includes('/vote') ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 block px-4 py-2 text-sm' : 'text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700'}>Vote</a>
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link href="/calendar">
                            <a className={router.pathname === '/calendar' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 block px-4 py-2 text-sm' : 'text-gray-700 dark:text-gray-300 block px-4 py-2 text-sm hover:bg-gray-300 dark:hover:bg-gray-700'}>Calendar</a>
                          </Link>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6">
            <div className="ml-3 relative">
              <div className="flex items-center">
                {accountState.selectedWallet ? (
                  <>
                    {/* <NotificationsPopover /> */}
                    <StreamPopover />
                    <AccountPopover />
                  </>
                ) : (
                  
                  <button className="menu-item-active focus:outline-none flex items-center" onClick={() => handleConnect()}>
                    <span className="sr-only">Connect wallet</span>
                    Connect wallet
                  </button>
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {menuOpen &&
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={router.pathname === '/' ? 'mobile-menu-item-active' : 'mobile-menu-item'} aria-current="page">Rankings</a>
            </Link>

            <Link href="/nft">
              <a className={router.pathname.includes('/nft') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>NFT <span className="bg-primaryDark dark:bg-primaryDark dark:text-black text-xs py-1 px-2 rounded font-semibold ml-1">Beta</span></a>
            </Link>

            <Link href="/exchanges">
              <a className={router.pathname.includes('/exchanges') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Exchanges</a>
            </Link>

            <Link href="/portfolio">
              <a className={router.pathname.includes('/portfolio') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Portfolio</a>
            </Link>

            <Link href="/vote">
              <a className={router.pathname.includes('/vote') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Vote</a>
            </Link>

            <Link href="/calendar">
              <a className={router.pathname.includes('/calendar') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Calendar</a>
            </Link>

            <Link href="/bridge">
              <a className={router.pathname.includes('/bridge') ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Bridge</a>
            </Link>

            <button  
              onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white focus:outline-none">
              <Moon size={22} />
            </button>
          </div>
        </div>
      }
    </nav>
  )
}

export default Header