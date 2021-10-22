import { useTheme } from 'next-themes'
import Link from 'next/link'
import React from 'react'
import { Moon } from 'react-feather'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import { currencyFormat } from 'utils/format'
import useBalances from 'utils/useBalances'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import CurrencyPopover from './CurrencyPopover'

const MarketBar = () => {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const {theme, setTheme, resolvedTheme} = useTheme()
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const { membership } = useBalances()

  const marketCap = tokenState.tokens.reduce((sum, current) => {
    if(current.bridged) return sum
    const rate = current.rate ?? 0
    const supply = current.current_supply ?? 0
    return sum + (supply * (selectedCurrency.rate * rate))
  }, 0)

  const liquidity = tokenState.tokens.reduce((sum, current) => {
    return sum + current.current_liquidity
  }, 0)

  const volume = tokenState.tokens.reduce((sum, current) => {
    return sum + current.daily_volume
  }, 0)

  return (
    <div className="flex items-center text-xs bg-white dark:bg-gray-800 border-t border-b border-gray-100 dark:border-gray-900">
      <div className="container relative px-3 md:px-4 py-2 flex items-center">
        <div className="overflow-x-auto flex-grow scrollable-table-container">
          <div className="flex items-center" style={{minWidth: '740px'}}>
            <div className="flex items-center mr-4">
              <span className="text-gray-400 mr-2">ZIL:</span>
              <span>{currencyFormat(selectedCurrency.rate, selectedCurrency.symbol)}</span>
            </div>
            <div className="flex items-center mr-4">
              <span className="text-gray-400 mr-2">Market Cap:</span>
              <span>{currencyFormat(marketCap, selectedCurrency.symbol)}</span>
            </div>
            <div className="flex items-center mr-4">
              <span className="text-gray-400 mr-2">TVL:</span>
              <Link href="/liquidity">
                <a className="font-normal">
                  <span>{currencyFormat(liquidity * selectedCurrency.rate, selectedCurrency.symbol)}</span>
                  <span className="mx-1">-</span>
                  <span>{currencyFormat(liquidity, '')} ZIL</span>
                </a>
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-400 mr-2">Volume (24h):</span>
              <span>{currencyFormat(volume * selectedCurrency.rate, selectedCurrency.symbol)}</span>
            </div>
          </div>
        </div>
        <div className="items-center flex flex-shrink-0 ml-3">
          {membership.isMember &&
            <CurrencyPopover />
          }
          <button  
            onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
            className="rounded-full focus:outline-none">
            <Moon size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketBar