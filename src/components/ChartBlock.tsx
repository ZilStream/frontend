import React from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { Token } from 'types/token.interface'
import { currencyFormat } from 'utils/format'
import FlashChange from './FlashChange'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  token: Token,
  rates: Rate[],
  zilRate: Rate,
}

const RatesBlock = (props: Props) => {
  const sortedRates = props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const usdRate = lastRate * props.zilRate.value

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100
  
  return (
    <div className="h-64 rounded-lg overflow-hidden p-2 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="pt-2 px-2">
        <div className="flex items-center text-xl">
          <div className="flex-grow flex items-center">
            <span className="font-semibold mr-2">{props.token.symbol}</span>
            <span className="mr-2"><FlashChange value={lastRateRounded}>{lastRateRounded}</FlashChange></span>
          </div>
          <div className={change >= 0 ? 'positive-change' : 'negative-change'}>
            {changeRounded} %
          </div>
        </div>
        <div>
          <span className="text-gray-400">{currencyFormat(usdRate, '')} USD</span>
        </div>
      </div>
      <Chart data={props.rates} isIncrease={change >= 0} isUserInteractionEnabled={false} isScalesEnabled={false} />
    </div>
  )
}

export default RatesBlock