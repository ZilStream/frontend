import React from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Rate } from 'types/rate.interface'
import { currencyFormat, numberFormat, cryptoFormat } from 'utils/format'
import { Link, FileText, Box, ExternalLink, AlertCircle } from 'react-feather'
import CopyableAddress from 'components/CopyableAddress'
import Supply from 'components/Supply'
import Head from 'next/head'
import getToken from 'lib/zilstream/getToken'
import getRatesForToken from 'lib/zilstream/getRatesForToken'
import TokenIcon from 'components/TokenIcon'
import Score from 'components/Score'

const Candles = dynamic(
  () => import('components/Candles'),
  { ssr: false }
)

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { symbol } = context.query

  const [zilRatesRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rates?symbol=ZIL`)
  ])

  const token = await getToken(symbol as string).catch(error => {
    return
  })
  if(!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  
  const rates = await getRatesForToken(symbol as string)
  const zilRates: Rate[] = await zilRatesRes.json()

  return {
    props: {
      token,
      rates,
      zilRates,
    },
  }
}

function TokenDetail({ token, rates, zilRates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const zilRate = zilRates.sort((a: Rate, b: Rate) => (a.time < b.time) ? 1 : -1)[0]

  return (
    <>
      <Head>
        <title>{token.symbol} price and info | ZilStream</title>
        <meta property="og:title" content={`${token.symbol} price and info | ZilStream`} />
        <meta name="description" content={`Get the latest ${token.symbol} price, market capitalization, volume, supply in circulation and more.`} />
        <meta property="og:description" content={`Get the latest ${token.symbol} price, market capitalization, volume, supply in circulation and more.`} />
      </Head>
      {!token.listed &&
        <div className="bg-gray-400 dark:bg-gray-600 rounded-lg p-4 flex flex-col sm:flex-row">
          <AlertCircle className="mb-2 sm:mr-3" />
          <div>
            <div className="font-medium">This token is unlisted, be extra cautious</div>
            <div className="text-sm">{token.name} is not screened or audited by ZilStream. Please verify the legitimacy of this token yourself.</div>
          </div>
        </div>
      }
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        <div className="flex-grow flex flex-col sm:flex-row items-center mb-1 pt-6 sm:pt-8 pb-2">
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-300 dark:bg-gray-800 w-12 sm:w-16 h-12 sm:h-16 p-2 rounded-lg mr-0 sm:mr-3 mb-2 sm:mb-0">
            <TokenIcon url={token.icon} />
          </div>
          <div>
            <h2 className="text-center sm:text-left">{token.name}</h2>
            <div className="flex flex-col sm:flex-row items-center">
              <span className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg sm:mr-3 mb-1 sm:mb-0 font-medium">${token.symbol}</span>
              <CopyableAddress address={token.address_bech32} />
            </div>
          </div>
        </div>
        <div className="text-center md:text-right font-medium flex flex-col md:flex-row items-center md:block mb-2 md:mb-0">
          <div className="flex-grow font-bold text-2xl">{cryptoFormat(token.rate)} ZIL</div>
          <div className="text-gray-500 flex items-center justify-end">
            {currencyFormat(token.rate_usd)}
            <div className="bg-gray-300 dark:bg-gray-800 text-sm rounded px-2 py-1 ml-2">
              <div className={`font-medium ${token.market_data.change_24h >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_24h)} %
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-stretch sm:flex-row sm:items-center text-gray-800 dark:text-gray-400 mb-2">
        <div className="flex items-center justify-center mt-2 sm:mt-0">
          <Score value={token.viewblock_score} />
        </div>
        <div className="flex-grow flex items-center justify-center sm:justify-start text-sm mt-2 sm:mt-0">
          

          {token.website &&
            <a href={token.website} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded mr-2">
              <Link size={12} className="mr-1" />
              Website 
              <ExternalLink size={10} className="ml-1 text-gray-600" />
            </a>
          }
          
          {token.whitepaper &&
            <a href={token.whitepaper} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded mr-2">
              <FileText size={12} className="mr-1" />
              Whitepaper
              <ExternalLink size={10} className="ml-1 text-gray-600" />
            </a>
          }
          
          <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded mr-2">
            <Box size={12} className="mr-1" />
            ViewBlock 
            <ExternalLink size={10} className="ml-1 text-gray-600" />
          </a>
        </div>

        <div className="flex items-center justify-center sm:justify-end text-sm">
          {token.market_data.change_percentage_7d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium ml-3">
              <div className="mr-2 text-gray-500">7D</div>
              <div className={`${token.market_data.change_percentage_7d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_7d)} %
              </div>
            </div>
          }

          {token.market_data.change_percentage_14d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium ml-3">
              <div className="mr-2 text-gray-500">14D</div>
              <div className={`${token.market_data.change_percentage_14d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_14d)} %
              </div>
            </div>
          }

          {token.market_data.change_percentage_30d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium">
              <div className="mr-2 text-gray-500">30D</div>
              <div className={`${token.market_data.change_percentage_30d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_30d)} %
              </div>
            </div>
          }
        </div>
      </div>
      <div className="py-2 -mx-4 mb-6 grid grid-cols-2 md:grid-cols-4">
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Market Cap</div>
          <div className="font-medium">{currencyFormat(token.market_data.market_cap)}</div>
          
          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Fully Diluted Market Cap</div>
          <div className="font-medium">{currencyFormat(token.market_data.fully_diluted_valuation)}</div>
        </div>
        <div className="px-4 py-2 border-r-0 md:border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Volume (24h)</div>
          <div className="font-medium">{currencyFormat(token.market_data.daily_volume)}</div>

          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Volume / Market Cap</div>
          <div className="font-medium">{numberFormat(token.market_data.daily_volume / token.market_data.market_cap, 3)}</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">All Time High</div>
          <div className="font-medium">{currencyFormat(token.market_data.ath, '')} ZIL</div>

          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Liquidity</div>
          <div className="font-medium">{currencyFormat(token.market_data.current_liquidity)}</div>
          
        </div>
        <div className="px-4 py-2">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Circulating Supply</div>
          <Supply token={token} />
        </div>
      </div>
      
      <Candles token={token} data={rates} zilRate={zilRate} />
    </>
  )
}

export default TokenDetail
