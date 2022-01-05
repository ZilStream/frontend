import BigNumber from 'bignumber.js'
import CopyableAddress from 'components/CopyableAddress'
import TokenIcon from 'components/TokenIcon'
import TVLChartBlock from 'components/TVLChartBlock'
import VolumeChartBlock from 'components/VolumeChartBlock'
import getStats from 'lib/zilstream/getStats'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, Token, TokenState } from 'store/types'
import { cryptoFormat, currencyFormat, numberFormat } from 'utils/format'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import getExchanges from 'lib/zilstream/getExchanges'
import { Exchange } from 'types/exchange.interface'

export const getServerSideProps = async () => {
  const exchanges = await getExchanges()

  return {
    props: {
      exchanges,
    }
  }
}

const Exchanges = ({ exchanges }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  
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
          return (
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
                  <div>—</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Volume</div>
                  <div>—</div>
                </div>
              </div>
            </div>
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