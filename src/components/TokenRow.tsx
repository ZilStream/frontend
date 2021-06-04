import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { Token } from 'types/token.interface'
import { currencyFormat } from 'utils/format'
import TokenIcon from './TokenIcon'
import FlashChange from './FlashChange'
import Link from 'next/link'
import { TokenInfo } from 'store/types'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  token: TokenInfo,
  rates: Rate[],
  zilRate: number,
  rank: number,
  isLast: boolean
}

const TokenRow = (props: Props) => {
  const sortedRates = props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const usdRate = lastRate * props.zilRate

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  const marketCap = props.token.current_supply * usdRate
  var usdVolume = props.token.daily_volume * props.zilRate

  if(usdVolume < 0) {
    usdVolume = 0
  }

  return (
    <tr role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
      <td className={`pl-5 pr-2 py-2 font-normal text-sm ${props.rank == 1 ? 'rounded-tl-lg' : ''} ${props.isLast ? 'rounded-bl-lg' : ''}`}>{props.rank}</td>
      <td className="px-2 py-2 font-medium">
        <Link href={`/tokens/${props.token.symbol.toLowerCase()}`}>
          <a className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
              <TokenIcon url={props.token.icon} />
            </div>
            <span className="hidden lg:inline">{props.token.name}</span>
            <span className="lg:font-normal ml-2 lg:text-gray-500">{props.token.symbol}</span>
          </a>
        </Link>
      </td>
      <td className="px-2 py-2 font-normal text-right"><FlashChange value={lastRateRounded}>{lastRateRounded}</FlashChange></td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(usdRate)}</td>
      <td className={change >= 0 ? 'positive-change px-2 py-2 font-normal text-right' : 'negative-change px-2 py-2 font-normal text-right'}>
        {changeRounded}%
      </td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(marketCap)}</td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(props.token.current_liquidity * props.zilRate)}</td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(usdVolume)}</td>
      <td className={`px-2 py-2 flex justify-end ${props.rank == 1 ? 'rounded-tr-lg' : ''} ${props.isLast ? 'rounded-br-lg' : ''}`}>
        <Link href={`/tokens/${props.token.symbol.toLowerCase()}`}>
          <a className="inline-block w-28" style={{height: '52px'}}>
            <Chart data={props.rates} isIncrease={change >= 0} isUserInteractionEnabled={false} isScalesEnabled={false} />
          </a>
        </Link>
      </td>
    </tr>
  )
}

export default TokenRow