import { useTheme } from 'next-themes'
import React from 'react'
import { Moon } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState, TokenState } from 'store/types'
import { currencyFormat } from 'utils/format'

const MarketBar = () => {
  const {theme, setTheme, resolvedTheme} = useTheme()
  const tokenState = useSelector<RootState, TokenState>(state => state.token)

  const marketCap = tokenState.tokens.reduce((sum, current) => {
    return sum + (current.current_supply * (tokenState.zilRate * current.rate))
  }, 0)

  const liquidity = tokenState.tokens.reduce((sum, current) => {
    return sum + current.current_liquidity
  }, 0)

  const volume = tokenState.tokens.reduce((sum, current) => {
    return sum + current.daily_volume
  }, 0)

  return (
    <div className="flex items-center text-xs bg-white dark:bg-gray-800 border-t dark:border-gray-900">
      <div className="container px-3 md:px-4 py-2 flex items-center">
        <div className="flex items-center flex-grow">
          <div className="flex items-center mr-4">
            <span className="text-gray-400 mr-2">ZIL:</span>
            <span>{currencyFormat(tokenState.zilRate)}</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="text-gray-400 mr-2">Market Cap:</span>
            <span>{currencyFormat(marketCap)}</span>
          </div>
          <div className="flex items-center mr-4">
            <span className="text-gray-400 mr-2">TVL:</span>
            <span>{currencyFormat(liquidity * tokenState.zilRate)}</span>
            <span className="mx-1">-</span>
            <span>{currencyFormat(liquidity, '')} ZIL</span>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-2">Volume (24h):</span>
            <span>{currencyFormat(volume * tokenState.zilRate)}</span>
          </div>
        </div>
        <div className="items-center hidden sm:flex">
          <button  
            onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
            className="rounded-full text-gray-400 hover:text-black dark:hover:text-white focus:outline-none">
            <Moon size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default MarketBar