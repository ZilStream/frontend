import { Popover, Transition } from '@headlessui/react'
import React, { Fragment } from 'react'
import { ChevronDown } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Currency, CurrencyState } from 'store/currency/types'
import { RootState } from 'store/types'
import actions from 'store/actions'

const CurrencyPopover = () => {
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const dispatch = useDispatch()

  async function selectCurrency(currency: Currency) {
    dispatch(actions.Currency.select({currency: currency.code}))
    localStorage.setItem('selectedCurrency', currency.code)
  }

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="mr-2 flex items-center focus:outline-none">
            <span className="font-semibold mr-1">{currencyState.selectedCurrency}</span>
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
            <Popover.Panel className="origin-top-right absolute right-5 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72">
              <div className="font-semibold text-center mb-3">Select your currency</div>
              <div className="w-full flex flex-col items-stretch">
                {currencyState.currencies.map(currency => {
                  return (
                    <button key={currency.code} onClick={() => selectCurrency(currency)} className={`flex items-center hover:bg-gray-200 rounded cursor-pointer focus:outline-none py-1 px-2 ${currency.code === currencyState.selectedCurrency ? 'bg-gray-200' : ''}`}>
                      <div className="flex-shrink-0 flex-grow-0 mr-2">
                        <img src={`/images/currency-flags/${currency.code}.svg`} className="w-5 h-5 bg-gray-200 border border-gray-100 rounded-full" />
                      </div>
                      <div className="flex-grow text-left">
                        <div className="font-medium">{currency.name}</div>
                        <div className="flex items-center text-gray-500">
                          <div>{currency.code}</div>
                          <div className="mx-1">·</div>
                          <div>{currency.symbol}</div>
                        </div>
                      </div>
                    </button>
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