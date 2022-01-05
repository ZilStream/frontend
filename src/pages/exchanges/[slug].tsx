import TokenIcon from 'components/TokenIcon'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import { cryptoFormat, currencyFormat, numberFormat } from 'utils/format'
import { Exchange } from 'types/exchange.interface'
import getExchange from 'lib/zilstream/getExchange'
import { Pair } from 'types/pair.interface'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { slug } = context.query
  const exchange = await getExchange(slug as string)

  return {
    props: {
      exchange,
    }
  }
}

const Exchange = ({ exchange }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const [pairs, setPairs] = useState<Pair[]>([])
  const [totalVolume, setTotalVolume] = useState<number>(0)

  useEffect(() => {
    var nTotalVolume = 0
    const filteredPairs = exchange.pairs.filter(pair => {
      const token = tokenState.tokens.filter(token => token.address_bech32 === pair.base_address)?.[0]
      if(token) {
        nTotalVolume += token?.market_data.daily_volume
      }
      return token?.listed
    })
    filteredPairs.sort((a,b) => {
      const aToken = tokenState.tokens.filter(token => token.address_bech32 === a.base_address)?.[0]
      const bToken = tokenState.tokens.filter(token => token.address_bech32 === b.base_address)?.[0]
      return aToken.market_data.daily_volume_zil > bToken.market_data.daily_volume_zil ? -1 : 1
    })
    setPairs(filteredPairs)
    setTotalVolume(nTotalVolume)
  }, [tokenState])

  return (
    <>  
      <Head>
        <title>Exchanges | ZilStream</title>
        <meta property="og:title" content={`Exchanges | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center">
              <TokenIcon url={exchange.icon} />
            </div>
            <h1 className="mb-1">{exchange.name}</h1>
          </div>
        </div>
      </div>      
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '500px', minWidth: 'auto'}} />
            <col style={{width: '180px', minWidth: 'auto'}} />
            <col style={{width: '180px', minWidth: 'auto'}} />
            <col style={{width: '180px', minWidth: 'auto'}} />
            <col style={{width: '180px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-left">Pair</th>
              <th className="px-2 py-2 text-right">Price</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">Volume (24h)</th>
              <th className="px-2 py-2 text-right">Volume %</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair: Pair, index: number) => {
              const baseToken = tokenState.tokens.filter(token => token.address_bech32 === pair.base_address)?.[0]
              const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]

              var liquidity = (pair.reserve?.quote_reserve ?? 0) * 2
              if(!quoteToken.isZil) {
                liquidity = (pair.reserve?.quote_reserve ?? 0) * quoteToken.market_data.rate * 2
              }
              console.log(selectedCurrency.rate)
              return (
                <tr key={pair.base_address} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === exchange.pairs.length-1 ? 'rounded-bl-lg' : ''}`}>
                   <Link href={`/tokens/${pair.base_symbol.toLowerCase()}`}>
                      <a className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                          <TokenIcon address={pair.base_address} />
                        </div>
                        <span className="hidden lg:inline whitespace-nowrap">{baseToken?.name}</span>
                        <span className="lg:font-normal ml-2 lg:text-gray-500 whitespace-nowrap">{pair.base_symbol}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="px-2 py-2 font-normal text-left">
                    {pair.pair}
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div>{cryptoFormat((pair.quote?.price ?? 0) * quoteToken.market_data.rate)} ZIL</div>
                    <div className="text-gray-500 dark:text-gray-400">{cryptoFormat(pair.quote?.price ?? 0)} {pair.quote_symbol}</div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    {currencyFormat((liquidity ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}
                  </td>
                  {exchange.name === 'ZilSwap' ? (
                    <>
                      <td className="px-2 py-2 font-normal text-right">
                        {currencyFormat((baseToken?.market_data.daily_volume_zil ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}
                      </td>
                      <td className={`pl-2 pr-3 py-2 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === exchange.pairs.length-1 ? 'rounded-br-lg' : ''}`}>
                        {numberFormat((baseToken?.market_data.daily_volume ?? 0) / totalVolume * 100)}%
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-2 font-normal text-right">
                      —
                      </td>
                      <td className={`pl-2 pr-3 py-2 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === exchange.pairs.length-1 ? 'rounded-br-lg' : ''}`}>
                      —
                      </td>
                    </>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Exchange