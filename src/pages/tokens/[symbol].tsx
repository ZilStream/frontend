import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'
import { currencyFormat, numberFormat, cryptoFormat } from 'utils/format'
import { Link, FileText, Box, ExternalLink } from 'react-feather'
import CopyableAddress from 'components/CopyableAddress'
import Supply from 'components/Supply'
import Head from 'next/head'

const Candles = dynamic(
  () => import('components/Candles'),
  { ssr: false }
)

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { symbol } = context.query

  const [tokenRes, ratesRes, dailyRatesRes, zilRatesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/token?symbol=${symbol}`),
    fetch(`${process.env.BACKEND_URL}/rates/${symbol}?interval=1h`),
    fetch(`${process.env.BACKEND_URL}/rates?symbol=${symbol}`),
    fetch(`${process.env.BACKEND_URL}/rates?symbol=ZIL`)
  ])

  const token: Token = await tokenRes.json()
  const rates: Rate[] = await ratesRes.json()
  const dailyRates: Rate[] = await dailyRatesRes.json()
  const zilRates: Rate[] = await zilRatesRes.json()

  return {
    props: {
      token,
      rates,
      dailyRates,
      zilRates,
    },
  }
}

function TokenDetail({ token, rates, dailyRates, zilRates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sortedRates = dailyRates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000
  const zilRate = zilRates.sort((a,b) => (a.time < b.time) ? 1 : -1)[0]
  const usdRate = lastRate * zilRate.value

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  const marketCap = token.current_supply * usdRate
  const usdVolume = token.daily_volume * zilRate.value

  return (
    <>
      <Head>
        <title>{token.symbol} price and info | ZilStream</title>
      </Head>
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
        <div className="flex-grow flex items-start sm:items-center mb-1 pt-8 pb-2">
          <div className="flex-shrink-0 bg-gray-300 dark:bg-gray-800 w-12 sm:w-16 h-12 sm:h-16 p-2 rounded-lg mr-2 md:mr-3">
            <img src={token.icon} loading="lazy" />
          </div>
          <div>
            <h2 className="">{token.name}</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center">
              <span className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg mr-1 sm:mr-3 mb-1 sm:mb-0 font-medium">${token.symbol}</span>
              <CopyableAddress address={token.address_bech32} />
            </div>
          </div>
        </div>
        <div className="text-left md:text-right font-medium flex items-center md:block mb-2 md:mb-0">
          <div className="flex-grow font-bold text-2xl">{cryptoFormat(lastRateRounded)} ZIL</div>
          <div className={change >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>
            {changeRounded} %
          </div>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-800 dark:text-gray-400 mb-2">
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
      <div className="py-2 -mx-4 mb-6 grid grid-cols-2 md:grid-cols-4">
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Market Cap</div>
          <div className="font-medium">{currencyFormat(marketCap)}</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Volume (24h)</div>
          <div className="font-medium">{currencyFormat(usdVolume)}</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Volume / Market Cap</div>
          <div className="font-medium">{numberFormat(usdVolume / marketCap, 3)}</div>
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
