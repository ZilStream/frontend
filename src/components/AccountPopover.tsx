import { Popover, Transition } from '@headlessui/react'
import { ChevronDown, Copy, Edit2, ExternalLink, LogOut, Plus, Settings } from 'react-feather'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountState, ConnectedWallet, RootState } from 'store/types'
import { AccountActionTypes } from 'store/account/actions'
import { shortenAddress } from 'utils/shorten'
import { ModalActionTypes } from 'store/modal/actions'
import useBalances from 'utils/useBalances'
import Link from 'next/link'

const AccountPopover = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const {membership} = useBalances()
  const dispatch = useDispatch()

  const handleAddWallet = () => {
    dispatch({ type: ModalActionTypes.OPEN_WALLET, payload: true })
  }

  const handleSelectWallet = (wallet: ConnectedWallet) => {
    dispatch({ type: AccountActionTypes.SELECT_WALLET, payload: {wallet} })
  }

  const logout = () => {
    dispatch({ type: AccountActionTypes.LOGOUT, payload: '' })
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center">
            <span className="sr-only">Open account menu</span>
            {accountState.selectedWallet!.label ? accountState.selectedWallet!.label : shortenAddress(accountState.selectedWallet!.address)}
            <ChevronDown size={14} className="ml-2" />
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-top-right absolute mt-1 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-80">
              <div className="flex flex-col items-stretch">
                <div className="font-semibold mb-3 text-gray-500 dark:text-gray-400">Your wallet</div>

                <div className="flex items-center">
                  <div className="flex-grow flex flex-col">
                    <div className="text-sm flex items-center">
                      {accountState.selectedWallet!.label ? accountState.selectedWallet!.label : shortenAddress(accountState.selectedWallet!.address)}
                      {membership.isMember &&
                        <div className="bg-primary h-4 px-1 rounded flex items-center justify-center text-xs font-bold ml-2">Premium</div>
                      }
                    </div>
                    <div className="text-sm text-gray-500">{shortenAddress(accountState.selectedWallet!.address)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <button 
                      onClick={() => {
                        navigator.clipboard.writeText(accountState.selectedWallet!.address)
                      }}
                      className="bg-gray-900 bg-opacity-50 hover:bg-opacity-100 h-8 w-8 flex items-center justify-center rounded-full focus:outline-none font-medium">
                      <Edit2 size={12} className="text-gray-700 dark:text-gray-300" />
                    </button> */}

                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(accountState.selectedWallet!.address)
                      }}
                      className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-50 hover:bg-opacity-100 h-8 w-8 flex items-center justify-center rounded-full focus:outline-none font-medium">
                      <Copy size={12} className="text-gray-700 dark:text-gray-300" />
                    </button>

                    <a 
                      href={`https://viewblock.io/zilliqa/address/${accountState.selectedWallet!.address}`} 
                      target="_blank" 
                      className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-50 hover:bg-opacity-100 h-8 w-8 flex items-center justify-center rounded-full font-medium">
                      <ExternalLink size={12} className="text-gray-700 dark:text-gray-300" />
                    </a>
                  </div>
                </div>
                <div className="flex flex-col items-stretch text-xs mt-2 -mx-2">
                  {accountState.wallets.length > 1 &&
                    <div className="px-2 text-gray-500">Other wallets</div>
                  }
                  {accountState.wallets.filter(wallet => wallet.address !== accountState.selectedWallet?.address).map(wallet => (
                    <button key={wallet.address} className="px-2 mb-1 hover:bg-gray-900 rounded focus:outline-none" onClick={() => handleSelectWallet(wallet)}>
                      <div className="flex items-center justify-start py-2 border-b dark:border-gray-900 last:border-b-0">
                        <span className="mr-2">{wallet.label ? wallet.label : shortenAddress(wallet.address)}</span>
                        <span className="text-gray-500">{shortenAddress(wallet.address)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 text-sm flex flex-col items-stretch">
                {membership.isMember &&
                  <button
                    className="py-2 text-left flex items-center gap-3 rounded-full font-medium text-sm focus:outline-none"
                    onClick={() => handleAddWallet()}
                  >
                    <div className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
                      <Plus size={12} />
                    </div>
                    Add another wallet
                  </button>
                }

                <Link href="/wallets">
                  <a className="py-2 text-left flex items-center gap-3 rounded-full font-medium text-sm focus:outline-none">
                    <div className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
                      <Settings size={12} />
                    </div>
                    Manage wallets
                  </a>
                </Link>
                
                <button
                  className="py-2 text-left flex items-center gap-3 rounded-full font-medium text-sm focus:outline-none"
                  onClick={() => logout()}
                >
                  <div className="bg-gray-200 dark:bg-gray-900 dark:bg-opacity-50 rounded-full h-8 w-8 flex items-center justify-center">
                    <LogOut size={12} />
                  </div>
                  Logout
                </button>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default AccountPopover