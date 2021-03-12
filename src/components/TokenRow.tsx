import React from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'
import { currencyFormat } from 'utils/format'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  token: Token,
  rates: Rate[],
  zilRate: Rate,
}

const TokenRow = (props: Props) => {
  const sortedRates = props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const usdRate = lastRate * props.zilRate.value

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  const marketCap = props.token.current_supply * usdRate
  var usdVolume = props.token.daily_volume * props.zilRate.value

  if(usdVolume < 0) {
    usdVolume = 0
  }

  return (
    <div className="token-row">
      <div className="w-6 mr-2 md:mr-4"><img src={props.token.icon} loading="lazy" /></div>
      <div className="w-16 sm:w-24 md:w-36">{props.token.symbol}</div>
      <div className="w-20 md:w-28 lg:w-36 font-normal text-right">{lastRateRounded}</div>
      <div className="w-32 lg:w-40 hidden md:block font-normal text-right">{currencyFormat(usdRate)}</div>
      <div className={change >= 0 ? 'text-green-600 dark:text-green-500 font-normal w-20 md:w-32 lg:w-40 text-right' : 'text-red-600 dark:text-red-500 font-normal w-20 md:w-32 lg:w-40 text-right'}>
        {changeRounded} %
      </div>
      <div className="w-36 lg:w-44 xl:w-48 hidden lg:block font-normal text-right">{currencyFormat(marketCap)}</div>
      <div className="w-36 lg:w-44 xl:w-48 hidden xl:block font-normal text-right">{currencyFormat(usdVolume)}</div>
      <div className="flex-grow flex justify-end">
        <div className="w-20 md:w-28 lg:w-36 h-16">
          <Chart data={props.rates} isIncrease={change >= 0} isUserInteractionEnabled={false} isScalesEnabled={false} />
        </div>
      </div>
    </div>
  )
}

export default TokenRow