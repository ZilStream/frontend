import { Popover, Transition } from '@headlessui/react'
import { Copy, ExternalLink } from 'react-feather'
import React, { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import { AccountActionTypes } from 'store/account/actions'

const WalletPopover = () => {
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const dispatch = useDispatch()

  const logout = () => {
    dispatch({ type: AccountActionTypes.WALLET_UPDATE, payload: '' })
    localStorage.removeItem('zilpay')
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2">
            <span className="sr-only">Open account menu</span>
            {accountState.address.substr(0, 5) + '...' + accountState.address.substr(accountState.address.length-4,4)}
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
            <Popover.Panel className="origin-top-right absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-80">
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-3">Your wallet</div>
                <div className="text-xs text-gray-500">{accountState.address}</div>
                <div className="flex items-center text-xs mt-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(accountState.address)
                    }}
                    className="flex items-center px-2 py-1 rounded mr-2 focus:outline-none font-medium">
                    Copy address 
                    <Copy size={12} className="ml-2 text-gray-700 dark:text-gray-300" />
                  </button>
                  <a 
                    href={`https://viewblock.io/zilliqa/address/${accountState.address}`} 
                    target="_blank" 
                    className="flex items-center px-2 py-1 rounded mr-2 font-medium">
                    ViewBlock 
                    <ExternalLink size={12} className="ml-2 text-gray-700 dark:text-gray-300" />
                  </a>
                </div>
              </div>
              <div className="mt-4 text-sm flex items-center justify-center">
                <button
                  className="py-2 px-4 rounded-full font-medium text-gray-500 text-sm focus:outline-none"
                  onClick={() => logout()}
                >Logout</button>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default WalletPopover