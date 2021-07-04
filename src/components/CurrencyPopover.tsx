import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { ChevronDown } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState, TokenState } from 'store/types'
import { Currency } from 'types/currency.interface'
import { cryptoFormat } from 'utils/format'
import useBalances from 'utils/useBalances'
import useMoneyFormatter from 'utils/useMoneyFormatter'

const CurrencyPopover = () => {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const { totalBalance, membership } = useBalances()

  var totalBalanceUSD = totalBalance.times(tokenState.zilRate)

  const availableCurrencies: Currency[] = [
    {
      name: 'United States Dollar',
      code: 'USD',
      symbol: '$',
    },
    {
      name: 'Euro',
      code: 'EUR',
      symbol: '€',
    },
    {
      name: 'Singapore Dollar',
      code: 'SGD',
      symbol: 'S$',
    },
    {
      name: 'Pound Sterling',
      code: 'GBP',
      symbol: '£',
    },
    {
      name: 'Bitcoin',
      code: 'BTC',
      symbol: '฿',
    },
  ]

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="mr-2 flex items-center focus:outline-none">
            <span className="font-semibold mr-1">USD</span>
            <ChevronDown size={14} />
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
              <div className="font-semibold text-center mb-3">Select your currency</div>
              <div className="w-full flex flex-col items-stretch">
                {availableCurrencies.map(currency => {
                  return (
                    <div className="flex items-center hover:bg-gray-200 rounded cursor-pointer py-1 px-2">
                      <div className="flex-shrink-0 flex-grow-0 mr-2">
                        <img src={`/images/currency-flags/${currency.code}.svg`} className="w-5 h-5 bg-gray-200 border border-gray-100 rounded-full" />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium">{currency.name}</div>
                        <div className="flex items-center text-gray-500">
                          <div>{currency.code}</div>
                          <div className="mx-1">·</div>
                          <div>{currency.symbol}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default CurrencyPopover