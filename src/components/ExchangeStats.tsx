import React from 'react'
import { currencyFormat } from 'utils/format'

interface Props {
  total_liquidity: number
  volume: number
  total_liquidity_usd: number
  volume_usd: number
}

const ExchangeStats = (props: Props) => {
  return (
    <div className="mt-4 lg:mt-0 w-full md:w-auto bg-gray-300 dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-100 rounded-lg px-5 py-2 text-gray-600 dark:text-gray-300 flex items-center text-xs sm:text-sm">
      <div className="flex-grow">
        <div className="flex items-center w-20 sm:w-24 mr-4 md:mr-8">
          <a href="https://zilswap.io/" target="_blank" className="block w-full h-full">
            <img src={`https://zilstream.sgp1.cdn.digitaloceanspaces.com/zilswap.svg`} loading="lazy" />
          </a>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-end text-right">
        <div className="mr-5 md:mr-6">
          <div className="truncate">Total Value Locked</div>
          <div className="font-semibold">{currencyFormat(props.total_liquidity_usd)}</div>
          <div className="font-medium text-gray-500">{currencyFormat(props.total_liquidity, '')}</div>
        </div>
        <div>
          <div>Volume (24h)</div>
          <div className="font-semibold">{currencyFormat(props.volume_usd)}</div>
          <div className="font-medium text-gray-500">{currencyFormat(props.volume, '')}</div>
        </div>
      </div>
    </div>
  )
}

export default ExchangeStats