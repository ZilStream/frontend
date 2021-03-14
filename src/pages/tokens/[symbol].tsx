import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'
import { currencyFormat, numberFormat, cryptoFormat } from 'utils/format'
import { Link, FileText, Box, ExternalLink } from 'react-feather'

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
  const [hoveringAddress, setHoveringAddress] = useState(false);

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
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
        <div className="flex-grow flex flex-col md:flex-row items-start md:items-center mb-1 pt-8 pb-2">
          <div className="bg-gray-300 dark:bg-gray-800 w-16 h-16 p-2 rounded-lg mb-2 md:mb-0 mr-0 md:mr-3">
            <img src={token.icon} loading="lazy" />
          </div>
          <div>
            <h2>{token.name}</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <span className="text-gray-600 dark:text-gray-400 text-lg mr-3">${token.symbol}</span>
              <div className="flex items-center">
                <button 
                  onMouseEnter={() => setHoveringAddress(true)}
                  onMouseLeave={() => setHoveringAddress(false)}
                  onClick={() => navigator.clipboard.writeText(token.address_bech32)}
                  className="text-sm bg-gray-300 dark:bg-gray-800 dark:text-gray-400 rounded px-2 mr-2">
                  {token.address_bech32}
                </button>
                {hoveringAddress &&
                  <span className="text-xs text-gray-600 transition">Click to copy</span>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right font-medium flex items-center md:block mb-2 md:mb-0">
          <div className="flex-grow font-semibold text-2xl">{cryptoFormat(lastRateRounded)} ZIL</div>
          <div className={change >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>
            {changeRounded} %
          </div>
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-400">
        {token.website &&
          <a href={token.website} target="_blank" className="flex items-center bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded mr-2">
            <Link size={12} className="mr-1" />
            Website 
            <ExternalLink size={10} className="ml-1 text-gray-600" />
          </a>
        }
        
        {token.whitepaper &&
          <a href={token.whitepaper} target="_blank" className="flex items-center bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded mr-2">
            <FileText size={12} className="mr-1" />
            Whitepaper
            <ExternalLink size={10} className="ml-1 text-gray-600" />
          </a>
        }
        
        <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} target="_blank" className="flex items-center bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded mr-2">
          <Box size={12} className="mr-1" />
          ViewBlock 
          <ExternalLink size={10} className="ml-1 text-gray-600" />
        </a>
      </div>
      <div className="py-2 mb-6 grid grid-cols-4">
        <div className="pr-4 py-2 border-r border-gray-800">
          <div className="text-gray-400">Market Cap</div>
          <div>{currencyFormat(marketCap)}</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-800">
          <div className="text-gray-400">Volume (24h)</div>
          <div>{currencyFormat(usdVolume)}</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-800">
          <div className="text-gray-400">Circulating Supply</div>
          <div>{numberFormat(token.current_supply, 0)}</div>
        </div>
        <div className="pl-4 py-2">
          <div className="text-gray-400">Max Supply</div>
          <div>{numberFormat(token.max_supply, 0)}</div>
        </div>
      </div>
      <div className="flex items-center justify-end mb-2">
        <span className="uppercase text-xs text-gray-500 mr-3">Currency</span>
        <button className="py-1 px-2 rounded-lg bg-gray-600 text-gray-200 text-sm shadow font-bold">ZIL</button>
        <button className="py-1 px-2 rounded-lg bg-gray-800 text-gray-400 text-sm ml-1 font-medium mr-6">USD</button>

        <span className="uppercase text-xs text-gray-500 mr-3">Time</span>
        <button className="py-1 px-2 rounded-lg bg-gray-800 text-gray-400 text-sm shadow font-medium">1D</button>
        <button className="py-1 px-2 rounded-lg bg-gray-800 text-gray-400 text-sm ml-1 font-medium">4H</button>
        <button className="py-1 px-2 rounded-lg bg-gray-600 text-gray-200 text-sm ml-1 font-bold">1H</button>
        <button className="py-1 px-2 rounded-lg bg-gray-800 text-gray-400 text-sm ml-1 font-medium">15M</button>
      </div>
      <div className="h-80 md:h-96 lg:h-144 rounded-lg overflow-hidden p-2 shadow-md bg-white dark:bg-gray-800 relative">
        <Candles data={rates} />
      </div>
    </>
  )
}

export default TokenDetail
