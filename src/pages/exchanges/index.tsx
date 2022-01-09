import BigNumber from 'bignumber.js'
import CopyableAddress from 'components/CopyableAddress'
import TokenIcon from 'components/TokenIcon'
import TVLChartBlock from 'components/TVLChartBlock'
import VolumeChartBlock from 'components/VolumeChartBlock'
import getStats from 'lib/zilstream/getStats'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import getExchanges from 'lib/zilstream/getExchanges'
import { currencyFormat } from 'utils/format'

export const getServerSideProps = async () => {
  const exchanges = await getExchanges()

  return {
    props: {
      exchanges,
    }
  }
}

const Exchanges = ({ exchanges }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  exchanges.sort((a,b) => {
    let aliquidity = a.pairs.reduce((sum, pair) => {
      const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
      var liquidity = (pair.reserve?.quote_reserve ?? 0) * 2
      if(!quoteToken?.isZil) {
        liquidity = (pair.reserve?.quote_reserve ?? 0) * (quoteToken?.market_data.rate ?? 0) * 2
      }
      return sum + liquidity
    }, 0)

    let bliquidity = b.pairs.reduce((sum, pair) => {
      const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
      var liquidity = (pair.reserve?.quote_reserve ?? 0) * 2
      if(!quoteToken?.isZil) {
        liquidity = (pair.reserve?.quote_reserve ?? 0) * (quoteToken?.market_data.rate ?? 0) * 2
      }
      return sum + liquidity
    }, 0)

    return aliquidity > bliquidity ? -1 : 1
  })

  return (
    <>  
      <Head>
        <title>Exchanges | ZilStream</title>
        <meta property="og:title" content={`Exchanges | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">Exchanges</h1>
          </div>
        </div>
      </div>      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {exchanges.map(exchange => {
          let volume = exchange.pairs.reduce((sum, pair) => {
            if(pair.volume && pair.volume.volume_24h_quote > 0) {
              const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
              if(quoteToken && quoteToken.isZil) {
                return sum + pair.volume.volume_24h_quote
              } else {
                return sum + (pair.volume.volume_24h_quote * (quoteToken?.market_data.rate ?? 0))
              }
            }
            return sum
          }, 0)

          let liquidity = exchange.pairs.reduce((sum, pair) => {
            const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
            var liquidity = (pair.reserve?.quote_reserve ?? 0) * 2
            if(!quoteToken?.isZil) {
              liquidity = (pair.reserve?.quote_reserve ?? 0) * (quoteToken?.market_data.rate ?? 0) * 2
            }
            return sum + liquidity
          }, 0)

          return (
            <Link href={`/exchanges/${exchange.slug}`}>
              <a className="font-normal">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                      <TokenIcon url={exchange.icon} />
                    </div>
                    <div className="font-semibold text-xl">
                      {exchange.name}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 text-sm mt-4">
                    <div>
                      <div className="text-gray-500 dark:text-gray-400"># of Markets</div>
                      <div>{exchange.pairs.length}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Liquidity</div>
                      <div>{currencyFormat((liquidity ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 dark:text-gray-400">Volume</div>
                      <div>{currencyFormat((volume ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}</div>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )
        })}
      </div>
      {/* <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '250px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Exchange</th>
              <th className="px-2 py-2 text-right">Pairs</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {exchanges.map((exchange: Exchange, index: number) => {
              return (
                <tr key={exchange.address} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === exchanges.length-1 ? 'rounded-bl-lg' : ''}`}>
                   <Link href={`/exchanges/${exchange.slug}`}>
                      <a className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                          <TokenIcon url={exchange.icon} />
                        </div>
                        <span className="">{exchange.name}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    {exchange.pairs.length}
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    —
                  </td>
                  <td className={`pl-2 pr-3 py-2 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === exchanges.length-1 ? 'rounded-br-lg' : ''}`}>
                    —
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div> */}
    </>
  )
}

export default Exchanges