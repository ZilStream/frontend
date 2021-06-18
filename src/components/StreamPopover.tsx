import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { RootState, TokenState } from 'store/types'
import { cryptoFormat } from 'utils/format'
import useBalances from 'utils/useBalances'
import useMoneyFormatter from 'utils/useMoneyFormatter'

const StreamPopover = () => {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const { totalBalance, membership } = useBalances()

  var totalBalanceUSD = totalBalance.times(tokenState.zilRate)

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2">
            <span className="mr-2">{cryptoFormat(membership.streamBalance.toNumber())}</span>
            <img className="h-4 w-4" src="/stream.svg" alt="STREAM" />
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
            <Popover.Panel className="origin-top-right absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72">
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-3">STREAM balance</div>
                <img className="h-12 w-12" src="/stream.svg" alt="STREAM" />
                <div className="mt-2 font-semibold">{cryptoFormat(membership.streamBalance.toNumber())}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">${moneyFormat(membership.streamBalanceUSD, {maxFractionDigits: 2})}</div>
                {membership.isMember &&
                  <div className="border-2 border-primary rounded-full text-sm font-medium text-primary px-2 mt-2">ZilStream Member</div>
                }
              </div>
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-1">
                  <div className="flex-grow text-gray-600 dark:text-gray-400">
                    Wallet balance
                  </div>
                  <div>${moneyFormat(totalBalanceUSD, {maxFractionDigits: 2})}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow text-gray-600 dark:text-gray-400">
                    Membership
                  </div>
                  <div>${moneyFormat(membership.membershipUSD, {maxFractionDigits: 2})}</div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default StreamPopover