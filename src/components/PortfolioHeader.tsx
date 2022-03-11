import { useTheme } from 'next-themes'
import { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'
import { Clipboard } from 'react-feather'
import { useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import { shortenAddress } from 'utils/shorten'

const PortfolioHeader = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const {resolvedTheme} = useTheme()
  const router = useRouter()

  if(!accountState.selectedWallet) return <></>

  return (
    <>
      <div className="pt-8 pb-6 flex items-center">
        <div className="flex-grow flex items-center">
          <div className="border-2 border-gray-300 dark:border-gray-600 p-px rounded-full mr-3">
            <div className="w-12 h-12 bg-primary rounded-full"></div>
          </div>
          <div>
            <div className="text-xl font-bold">{shortenAddress(accountState.selectedWallet.address)}</div>
            <div className="flex items-center text-gray-500">
              <div className="mr-2">{shortenAddress(accountState.selectedWallet.address)}</div>
              <button onClick={() => navigator.clipboard.writeText(accountState.selectedWallet!.address)} className="focus:outline-none">
                <Clipboard size={14} />
              </button>
            </div>
          </div>
        </div>
        <div>
          <a href={`https://viewblock.io/zilliqa/address/${accountState.selectedWallet.address}`} target="_blank" className="block bg-gray-300 dark:bg-gray-700 rounded-lg w-10 h-10 p-1">
            {resolvedTheme === 'dark' ? (
              <img src="https://cdn.viewblock.io/viewblock-dark.png" />
            ) : (
              <img src="https://cdn.viewblock.io/viewblock-light.png" />
            )}
          </a>
        </div>
      </div>
      <div className="flex items-center border-b border-gray-300 dark:border-gray-700 font-medium mb-8">
        <div className={`py-3 px-5 border-b -mb-px ${router.pathname === '/portfolio' ? 'border-primary' : 'text-gray-500 dark:border-gray-700 border-opacity-0'}`}>
          <Link href="/portfolio">
            <a>Dashboard</a>
          </Link>
        </div>
        <div className={`py-3 px-5 border-b -mb-px ${router.pathname === '/portfolio/transactions' ? 'border-primary' : 'text-gray-500 dark:border-gray-700 border-opacity-0'}`}>
          <Link href="/portfolio/transactions">
            <a>Transactions</a>
          </Link>
        </div>
      </div>
    </>
  )
}

export default PortfolioHeader