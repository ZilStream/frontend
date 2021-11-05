import React, { useEffect, useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { currencyFormat } from 'utils/format'
import TokenIcon from './TokenIcon'
import FlashChange from './FlashChange'
import Link from 'next/link'
import { Currency, CurrencyState, RootState, Token } from 'store/types'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { getTokenAPR } from 'utils/apr'
import { Star } from 'react-feather'
import { TokenActionTypes } from 'store/token/actions'
import { useTheme } from 'next-themes'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  token: Token,
  rates: Rate[],
  rank: number,
  index: number
  isLast: boolean,
  showAPR: boolean
}

const TokenRow = (props: Props) => {
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const sortedRates = props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const fiatRate = lastRate * selectedCurrency.rate
  const [isFavorited, setIsFavorited] = useState<boolean>(props.token.isFavorited)
  const dispatch = useDispatch()
  const {theme, setTheme, resolvedTheme} = useTheme()

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  const marketCap = props.token.current_supply * fiatRate
  const usdVolume = props.token.market_data.daily_volume_zil * selectedCurrency.rate
  const currentLiquidity = props.token.market_data.current_liquidity_zil * selectedCurrency.rate

  const onFavorited = () => {
    const favoritesString = localStorage.getItem('favorites') ?? ''
    var favorites = favoritesString.split(',')

    if (isFavorited) {
      favorites = favorites.filter(address => address != props.token.address_bech32)
    } else {
      favorites.push(props.token.address_bech32)
    }

    localStorage.setItem('favorites', favorites.join(','))
    
    dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
      address_bech32: props.token.address_bech32,
      isFavorited: !isFavorited
    }})

    setIsFavorited(!isFavorited)
  }

  return (
    <tr role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
      <td className={`pl-4 sm:pl-5 sm:pr-2 py-2 font-normal text-sm sticky ${props.index == 0 ? 'rounded-tl-lg' : ''} ${props.isLast ? 'rounded-bl-lg' : ''}`}>
        <button onClick={() => onFavorited()} className="flex items-center justify-center focus:outline-none">
          {resolvedTheme === 'dark' ? (
            <Star size={13} className="text-gray-500 dark:text-gray-400" fill={isFavorited ? 'rgba(156, 163, 175, 1)' : 'rgba(0,0,0,0)'} />
          ) : (
            <Star size={13} className="text-gray-500 dark:text-gray-400" fill={isFavorited ? 'rgba(107, 114, 128, 1)' : 'rgba(0,0,0,0)'} />
          )}
        </button>
      </td>
      <td className="pl-2 sm:pl-3 pr-1 sm:pr-2 py-2 font-normal text-sm">{props.rank}</td>
      <td className="px-2 py-2 font-medium sticky left-0 z-10">
        <Link href={`/tokens/${props.token.symbol.toLowerCase()}`}>
          <a className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3">
              <TokenIcon url={props.token.icon} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="hidden lg:inline whitespace-nowrap">{props.token.name}</span>
                  <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">{props.token.symbol}</span>
                </div>
                {(props.token.symbol === 'ZILLEX' || props.token.symbol === 'UNIDEX-V2' || props.token.symbol === 'NFTDEX') &&
                  <span className="text-xs font-normal text-gray-500 whitespace-nowrap" style={{marginTop: 1}}>Compound token</span>
                }
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
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(marketCap, selectedCurrency.symbol, 0)}</td>
      <td className="px-2 py-2 font-normal text-right">{currencyFormat(currentLiquidity, selectedCurrency.symbol, 0)}</td>
      {props.showAPR &&
        <td className="px-2 py-2 font-normal text-right">
          {props.token.apr?.isZero() ? (
            <span className="text-gray-500 dark:text-gray-400">-</span>
          ) : (
            <>{props.token.apr?.toNumber()}%</>
          )}
          
        </td>
      }
      {!props.showAPR &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(usdVolume, selectedCurrency.symbol, 0)}</td>
      }
      <td className={`px-2 py-2 flex justify-end ${props.index == 0 ? 'rounded-tr-lg' : ''} ${props.isLast ? 'rounded-br-lg' : ''}`}>
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