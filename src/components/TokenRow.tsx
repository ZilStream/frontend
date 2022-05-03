import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { cryptoFormat, currencyFormat, numberFormat } from 'utils/format'
import TokenIcon from './TokenIcon'
import FlashChange from './FlashChange'
import Link from 'next/link'
import { Currency, CurrencyState, RootState, SettingsState, Token } from 'store/types'
import { useDispatch, useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { Star } from 'react-feather'
import { TokenActionTypes } from 'store/token/actions'
import { useTheme } from 'next-themes'
import InlineChange from './InlineChange'

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
  const { token } = props
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const settingsState = useSelector<RootState, SettingsState>(state => state.settings)
  const [isFavorited, setIsFavorited] = useState<boolean>(token.isFavorited)
  const dispatch = useDispatch()
  const { resolvedTheme } = useTheme()

  const onFavorited = () => {
    const favoritesString = localStorage.getItem('favorites') ?? ''
    var favorites = favoritesString.split(',')

    if (isFavorited) {
      favorites = favorites.filter(address => address != token.address)
    } else {
      favorites.push(token.address)
    }

    localStorage.setItem('favorites', favorites.join(','))
    
    dispatch({type: TokenActionTypes.TOKEN_UPDATE, payload: {
      address: token.address,
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
        <Link href={`/tokens/${token.address}`}>
          <a className="flex items-center">
            <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-1 sm:mr-3">
              <TokenIcon url={token.icon} />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="hidden lg:inline whitespace-nowrap">{token.name}</span>
                  <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">{token.symbol}</span>
                </div>
                {token.tags.includes('cft') &&
                  <span className="text-xs font-normal text-gray-500 whitespace-nowrap" style={{marginTop: 1}}>Compound token</span>
                }
              </div>

              {dayjs(token.last_vote_start).isBefore(dayjs()) && dayjs(token.last_vote_end).isAfter(dayjs()) &&
                <Link href={`/vote/${token.symbol.toLowerCase()}/${token.last_vote_hash}`}>
                  <span className="text-xs bg-primary rounded-full px-2 ml-2 font-medium cursor-pointer" style={{paddingTop: 1, paddingBottom: 1}}>Vote</span>
                </Link>
              }
            </div>
          </a>
        </Link>
      </td>

      {settingsState.columns.priceFiat &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.market_data.rate_zil * selectedCurrency.rate, selectedCurrency.symbol)}</td>
      }

      {settingsState.columns.priceZIL &&
        <td className="px-2 py-2 font-normal text-right"><FlashChange value={token.market_data.rate_zil}>{cryptoFormat(token.market_data.rate_zil)}</FlashChange></td>
      }

      {settingsState.columns.ath &&
        <td className="px-2 py-2 font-normal text-right">{cryptoFormat(token.market_data.ath)}</td>
      }

      {settingsState.columns.atl &&
        <td className="px-2 py-2 font-normal text-right">{cryptoFormat(token.market_data.atl)}</td>
      }
      
      {settingsState.columns.change24H &&
        <td className="px-2 py-2 font-normal text-right text-gray-500 dark:text-gray-400">
          <InlineChange num={token.market_data.change_percentage_24h} />
        </td>
      }

      {settingsState.columns.change7D &&
        <td className="px-2 py-2 font-normal text-right text-gray-500 dark:text-gray-400">
          <InlineChange num={token.market_data.change_percentage_7d} />
        </td>
      }

      {settingsState.columns.change24HZIL &&
        <td className="px-2 py-2 font-normal text-right text-gray-500 dark:text-gray-400">
          <InlineChange num={token.market_data.change_percentage_24h_zil} />
        </td>
      }

      {settingsState.columns.change7DZIL &&
        <td className="px-2 py-2 font-normal text-right text-gray-500 dark:text-gray-400">
          <InlineChange num={token.market_data.change_percentage_7d_zil} />
        </td>
      }
      
      {settingsState.columns.marketCap &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol)}</td>
      }

      {settingsState.columns.marketCapDiluted &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.market_data.fully_diluted_valuation_zil * selectedCurrency.rate, selectedCurrency.symbol)}</td>
      }

      {settingsState.columns.circSupply &&
        <td className="px-2 py-2 font-normal text-right">{numberFormat(token.market_data.current_supply, 0)}</td>
      }

      {settingsState.columns.totalSupply &&
        <td className="px-2 py-2 font-normal text-right">{numberFormat(token.market_data.total_supply, 0)}</td>
      }

      {settingsState.columns.maxSupply &&
        <td className="px-2 py-2 font-normal text-right">{numberFormat(token.market_data.max_supply, 0)}</td>
      }

      {settingsState.columns.liquidity &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.market_data.current_liquidity_zil * selectedCurrency.rate, selectedCurrency.symbol)}</td>
      }

      {settingsState.columns.volume &&
        <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol)}</td>
      }

      {settingsState.columns.apr &&
        <td className="px-2 py-2 font-normal text-right">
          {token.apr?.isZero() ? (
            <span className="text-gray-500 dark:text-gray-400">-</span>
          ) : (
            <>{token.apr?.toNumber()}%</>
          )}
        </td>
      }

      {settingsState.columns.apy &&
        <td className="px-2 py-2 font-normal text-right">
          {!token.apr || token.apr?.isZero() ? (
            <span className="text-gray-500 dark:text-gray-400">-</span>
          ) : (
            <>{token.apr.dividedBy(52).plus(1).times(52).minus(1).toNumber()}%</>
          )}
        </td>
      }
      
      {settingsState.columns.graph24H &&
        <td className={`px-2 py-2 justify-end ${props.index == 0 && !settingsState.columns.graph24HZIL ? 'rounded-tr-lg' : ''} ${props.isLast && !settingsState.columns.graph24HZIL ? 'rounded-br-lg' : ''}`}>
          <div className="flex justify-end">
            <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a className="inline-block w-28" style={{height: '52px'}}>
                <Chart data={props.rates} isUserInteractionEnabled={false} isScalesEnabled={false} />
              </a>
            </Link>
          </div>
        </td>
      }

      {settingsState.columns.graph24HZIL &&
        <td className={`px-2 py-2 justify-end ${props.index == 0 ? 'rounded-tr-lg' : ''} ${props.isLast ? 'rounded-br-lg' : ''}`}>
          <div className="flex justify-end">
            <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a className="inline-block w-28" style={{height: '52px'}}>
                <Chart data={props.rates} isZilValue={true} isUserInteractionEnabled={false} isScalesEnabled={false} />
              </a>
            </Link>
          </div>
        </td>
      }
    </tr>
  )
}

export default TokenRow