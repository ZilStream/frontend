import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { Bell } from 'react-feather'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import useBalances from 'utils/useBalances'

const NotificationsPopover = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2">
            <Bell size={20} className="text-gray-800 dark:text-gray-200 p-[2px]" />
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
            <Popover.Panel className="origin-top-right absolute mt-1 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72">
              <div className="flex flex-col">
                <div className="font-semibold mb-2 text-gray-600 dark:text-gray-300">Notifications</div>
                <div className="text-sm italic text-gray-500 dark:text-gray-400">You currently don't have any notifications.</div>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default NotificationsPopover