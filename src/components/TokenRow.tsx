import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { Token } from 'types/token.interface'
import { currencyFormat } from 'utils/format'
import TokenIcon from './TokenIcon'
import FlashChange from './FlashChange'
import Link from 'next/link'
import { Currency, CurrencyState, RootState, TokenInfo } from 'store/types'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  token: TokenInfo,
  rates: Rate[],
  rank: number,
  isLast: boolean
}

const TokenRow = (props: Props) => {
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const sortedRates = props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const fiatRate = lastRate * selectedCurrency.rate

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  const marketCap = props.token.current_supply * fiatRate
  const usdVolume = props.token.daily_volume * selectedCurrency.rate
  const currentLiquidity = props.token.current_liquidity * selectedCurrency.rate

  return (
    <tr role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
      <td className={`pl-4 sm:pl-5 pr-1 sm:pr-2 py-2 font-normal text-sm ${props.rank == 1 ? 'rounded-tl-lg' : ''} ${props.isLast ? 'rounded-bl-lg' : ''}`}>{props.rank}</td>
      <td className="px-2 py-2 font-medium">
        <Link href={`/tokens/${props.token.symbol.toLowerCase()}`}>
          <a className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3">
              <TokenIcon url={props.token.icon} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex items-center">
                <span className="hidden lg:inline">{props.token.name}</span>
                <span className="lg:font-normal ml-2 lg:text-gray-500">{props.token.symbol}</span>
              </div>

              {dayjs(props.token.last_vote_start).isBefore(dayjs()) && dayjs(props.token.last_vote_end).isAfter(dayjs()) &&
                <Link href={`/vote/${props.token.symbol.toLowerCase()}/${props.token.last_vote_hash}`}>
                  <a className="text-xs bg-primary rounded-full px-2 ml-2 font-medium" style={{paddingTop: 1, paddingBottom: 1}}>Vote</a>
                </Link>
              }
            </div>
          </a>
        </Link>
      </td>
      <td className="px-2 py-2 font-normal text-right"><FlashChange value={lastRateRounded}>{lastRateRounded}</FlashChange></td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(fiatRate, selectedCurrency.symbol)}</td>
      <td className={change >= 0 ? 'positive-change px-2 py-2 font-normal text-right' : 'negative-change px-2 py-2 font-normal text-right'}>
        {changeRounded}%
      </td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(marketCap, selectedCurrency.symbol)}</td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(currentLiquidity, selectedCurrency.symbol)}</td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(usdVolume, selectedCurrency.symbol)}</td>
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