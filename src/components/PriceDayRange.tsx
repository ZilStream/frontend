import { lchown } from 'fs'
import React from 'react'
import { ChevronUp } from 'react-feather'
import { cryptoFormat, currencyFormat, numberFormat } from 'utils/format'

interface Props {
  price: number
  low: number
  high: number
}

const PriceDayRange = (props: Props) => {
  const { price, low, high } = props
  const range = high - low
  const filledPercentage = (price - low) / range * 100

  return (
    <div className="flex items-center text-xs whitespace-nowrap">
      <div>
        <span className="text-gray-500 dark:text-gray-400">Low:</span> {currencyFormat(low)}
      </div>
      <div className="w-full mx-2 h-2 rounded-full overflowx-hidden bg-gray-300 dark:bg-gray-700" style={{maxWidth: 200}}>
        <div className="h-full relative bg-gray-500 rounded-full" style={{width: numberFormat(filledPercentage, 0) + '%'}}>
          <div className="absolute -right-2 top-2 text-gray-500"><ChevronUp size={14} strokeWidth={3} /></div>
        </div>
      </div>
      <div>
      <span className="text-gray-500 dark:text-gray-400">High:</span> {currencyFormat(high)}
      </div>
    </div>
  )
}

export default PriceDayRange