import TokenIcon from 'components/TokenIcon'
import getBridgeAssets, { AssetResponse } from 'lib/zilstream/getBridgeAssets'
import Head from 'next/head'
import React, { useEffect, useMemo, useState } from 'react'
import { cryptoFormat, currencyFormat } from 'utils/format'
import { useInterval } from 'utils/interval'
import { Zilliqa } from '@zilliqa-js/zilliqa'
import { toBech32Address, fromBech32Address } from '@zilliqa-js/zilliqa'
import BigNumber from 'bignumber.js'
import { toBigNumber } from 'utils/useMoneyFormatter'
import { useSelector } from 'react-redux'
import { RootState, TokenState } from 'store/types'

const Bridge = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const tokens = tokenState.tokens.filter(token => token.symbol === 'zETH' || token.symbol === 'zUSDT' || token.symbol === 'zWBTC')

  // Making this conveluted because ugh 
  const [ethSupply, setEthSupply] = useState<number>(0)
  const [usdtSupply, setUsdtSupply] = useState<number>(0)
  const [wbtcSupply, setWbtcSupply] = useState<number>(0)

  const [ethPrice, setEthPrice] = useState<number>(0)
  const [usdtPrice, setUsdtPrice] = useState<number>(0)
  const [wbtcPrice, setWbtcPrice] = useState<number>(0)

  const zilliqa = new Zilliqa('https://api.zilliqa.com')

  useEffect(() => {
    if(!tokenState.initialized || tokens.length === 0) return
    fetchAssets()
    fetchPrices()
  }, [tokenState.initialized])

  const fetchAssets = async () => {
    const response: any = await zilliqa.blockchain.getSmartContractSubStateBatch([
      [`818ca2e217e060ad17b7bd0124a483a1f66930a9`, "total_supply", []],
      [`2ca315f4329654614d1e8321f9c252921192c5f2`, "total_supply", []],
      [`75fa7d8ba6bed4a68774c758a5e43cfb6633d9d6`, "total_supply", []]
    ])

    const result: any[] = response.batch_result
    setUsdtSupply(toBigNumber(result[0].result.total_supply).times(Math.pow(10, -6)).toNumber())
    setEthSupply(toBigNumber(result[1].result.total_supply).times(Math.pow(10, -18)).toNumber())
    setWbtcSupply(toBigNumber(result[2].result.total_supply).times(Math.pow(10, -8)).toNumber())
  }

  const fetchPrices = async () => {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether,bitcoin,ethereum&vs_currencies=usd')
    const json = await response.json()

    Object.keys(json).forEach(name => {
      if(name === 'tether') {
        setUsdtPrice(json[name].usd)
      } else if(name === 'ethereum') {
        setEthPrice(json[name].usd)
      } else if(name === 'bitcoin') {
        setWbtcPrice(json[name].usd)
      }
    })
  }

  useInterval(async () => {
      fetchAssets()
      fetchPrices()
    },
    50000
  )

  const totalValue = useMemo(() => {
    var value = 0
    value += ethSupply * ethPrice
    value += usdtSupply * usdtPrice
    value += wbtcSupply * wbtcPrice
    return value
  }, [ethSupply, usdtSupply, wbtcSupply, ethPrice, usdtPrice, wbtcPrice])

  if(!tokenState.initialized || tokens.length === 0) {
    return <div></div>
  }

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
        <div className="mt-12 flex flex-col items-center">
          <div className="font-bold mb-2">Total incoming asset value:</div>
          <div className="bg-white dark:bg-gray-800 py-4 px-8 rounded-lg font-bold text-4xl">{currencyFormat(totalValue, '$', 0)}</div>
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
              <tr className="text-lg border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-3 font-medium whitespace-nowrap rounded-tl-lg`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      <TokenIcon address={`zil19j33tapjje2xzng7svslnsjjjgge930jx0w09v`} />
                    </div>
                    <div className="font-bold">zETH</div>
                  </div>
                </td>
                <td className="px-2 py-3 font-normal text-right">
                  {cryptoFormat(ethSupply)} <span className="font-semibold">ETH</span>
                  
                </td>
                <td className={`px-2 py-3 font-normal text-right rounded-tr-lg`}>
                  {currencyFormat(ethSupply * ethPrice, '$', 0)}
                </td>
              </tr>
              <tr className="text-lg border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-3 font-medium whitespace-nowrap`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      <TokenIcon address={`zil1sxx29cshups269ahh5qjffyr58mxjv9ft78jqy`} />
                    </div>
                    <div className="font-bold">zUSDT</div>
                  </div>
                </td>
                <td className="px-2 py-3 font-normal text-right">
                  {cryptoFormat(usdtSupply)} <span className="font-semibold">zUSDT</span>
                  
                </td>
                <td className={`px-2 py-3 font-normal text-right`}>
                  {currencyFormat(usdtSupply * usdtPrice, '$', 0)}
                </td>
              </tr>
              <tr className="text-lg border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-3 font-medium whitespace-nowrap rounded-bl-lg`}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8">
                      <TokenIcon address={`zil1wha8mzaxhm22dpm5cav2tepuldnr8kwkvmqtjq`} />
                    </div>
                    <div className="font-bold">zWBTC</div>
                  </div>
                </td>
                <td className="px-2 py-3 font-normal text-right">
                  {cryptoFormat(wbtcSupply)} <span className="font-semibold">zWBTC</span>
                  
                </td>
                <td className={`px-2 py-3 font-normal text-right rounded-br-lg`}>
                  {currencyFormat(wbtcSupply * wbtcPrice, '$', 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Bridge