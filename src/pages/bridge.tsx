import TokenIcon from 'components/TokenIcon'
import getBridgeAssets, { AssetResponse } from 'lib/zilstream/getBridgeAssets'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { cryptoFormat, currencyFormat } from 'utils/format'
import { useInterval } from 'utils/interval'

const Bridge = () => {
  const [assets, setAssets] = useState<AssetResponse>()

  useEffect(() => {
    fetchAssets()
  }, [])

  const fetchAssets = async () => {
    const assets = await getBridgeAssets("1470000", "5470000")
    setAssets(assets)
  }

  useInterval(async () => {
      fetchAssets()
    },
    100000
  )

  return (
    <>  
      <Head>
        <title>ZilBridge | ZilStream</title>
        <meta property="og:title" content={`ZilBridge | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8 text-center">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">ZilBridge: Incoming assets</h1>
          </div>
        </div>
        {assets &&
          <>
            <div className="mt-12 flex flex-col items-center">
              <div className="font-bold mb-2">Total incoming asset value:</div>
              <div className="bg-white dark:bg-gray-800 py-4 px-8 rounded-lg font-bold text-4xl">{currencyFormat(assets.total_usd_value, '$', 0)}</div>
            </div>

            <div className="scrollable-table-container max-w-2xl mx-auto overflow-x-scroll mt-10">
              <table className="zilstream-table table-fixed border-collapse">
                <colgroup>
                  <col style={{width: '200px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                </colgroup>
                <thead className="text-gray-500 dark:text-gray-400 text-xs">
                  <tr>
                    <th className="pl-4 pr-2 py-2 text-left">Asset</th>
                    <th className="px-2 py-2 text-right">Amount</th>
                    <th className="px-2 py-2 text-right">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.assets.map((asset, index) => (
                    <tr key={asset.address} className="text-lg border-b dark:border-gray-700 last:border-b-0">
                      <td className={`pl-4 pr-2 py-3 font-medium whitespace-nowrap ${index === 0 ? 'rounded-tl-lg' : ''} ${index === assets.assets.length-1 ? 'rounded-bl-lg' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8">
                            <TokenIcon address={asset.address} />
                          </div>
                          <div className="font-bold">{asset.symbol}</div>
                        </div>
                      </td>
                      <td className="px-2 py-3 font-normal text-right">
                        {cryptoFormat(asset.amount)} <span className="font-semibold">{asset.symbol}</span>
                        
                      </td>
                      <td className={`px-2 py-3 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === assets.assets.length-1 ? 'rounded-br-lg' : ''}`}>
                        {currencyFormat(asset.usd_value, '$', 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default Bridge