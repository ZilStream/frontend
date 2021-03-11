import React from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'

const Candles = dynamic(
  () => import('components/Candles'),
  { ssr: false }
)

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { symbol } = context.query

  const [tokenRes, ratesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/token?symbol=${symbol}`),
    fetch(`${process.env.BACKEND_URL}/rates/${symbol}`)
  ])

  const token: Token = await tokenRes.json()
  const rates: Rate[] = await ratesRes.json()

  return {
    props: {
      token,
      rates,
    },
  }
}

function TokenDetail({ token, rates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const sortedRates = rates.sort((a,b) => (a.time < b.time) ? 1 : -1)
  const lastRate = sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0
  const lastRateRounded = (lastRate > 1) ? Math.round(lastRate * 100) / 100 : Math.round(lastRate * 10000) / 10000

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100

  return (
    <>
      <div className="flex flex-col md:flex-row items-stretch md:items-center">
        <div className="flex-grow flex flex-col md:flex-row items-start md:items-center mb-4 pt-8 pb-2">
          <div className="bg-gray-300 dark:bg-gray-800 w-16 h-16 p-2 rounded-lg mb-2 md:mb-0 mr-0 md:mr-3">
            <img src={token.icon} loading="lazy" />
          </div>
          <div>
            <h2>{token.name}</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <span className="text-gray-600 dark:text-gray-400 text-lg mr-3">${token.symbol}</span>
              <span className="text-sm bg-gray-300 dark:bg-gray-800 dark:text-gray-400 rounded px-2">
                <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} className="font-normal">
                  {token.address_bech32}
                </a>
              </span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right font-medium flex items-center md:block mb-2 md:mb-0">
          <div className="flex-grow font-semibold text-2xl">{lastRateRounded} ZIL</div>
          <div className={change >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>
            {changeRounded} %
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end mb-2">
        <button className="py-1 px-2 rounded-lg bg-gray-700 text-gray-400 text-sm shadow font-medium">1D</button>
        <button className="py-1 px-2 rounded-lg bg-gray-700 text-gray-400 text-sm ml-2 font-medium">4H</button>
        <button className="py-1 px-2 rounded-lg bg-gray-700 text-gray-400 text-sm ml-2 font-medium">1H</button>
        <button className="py-1 px-2 rounded-lg bg-gray-600 text-gray-300 text-sm ml-2 font-medium">15M</button>
      </div>
      <div className="h-80 md:h-96 lg:h-96 xl:h-144 rounded-lg overflow-hidden p-2 shadow-md bg-white dark:bg-gray-800">
        <Candles data={rates} />
      </div>
    </>
  )
}

export default TokenDetail
