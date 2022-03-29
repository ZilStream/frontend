import TokenIcon from 'components/TokenIcon'
import getBridgeAssets from 'lib/zilstream/getBridgeAssets'
import Head from 'next/head'
import React, { useEffect, useMemo, useState } from 'react'
import { cryptoFormat, currencyFormat } from 'utils/format'
import { useInterval } from 'utils/interval'
import { Zilliqa } from '@zilliqa-js/zilliqa'
import { toBigNumber } from 'utils/useMoneyFormatter'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, Token, TokenState } from 'store/types'

const Bridge = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  const [bridgeTokens, setBridgeTokens] = useState<Token[]>([])

  // Making this conveluted because ugh 
  const [supplies, setSupplies] = useState<{[id: string]: number}>({
    XCAD: 0,
    zETH: 0,
    zWBTC: 0,
    zUSDT: 0,
    PORT: 0,
    zBRKL: 0,
    zOPUL: 0
  })

  const zilliqa = new Zilliqa('https://api.zilliqa.com')

  useEffect(() => {
    if(!tokenState.initialized) return
    setBridgeTokens(tokenState.tokens.filter(token => token.symbol === 'XCAD' || token.symbol === 'zETH' || token.symbol === 'zUSDT' || token.symbol === 'zWBTC' || token.symbol === 'PORT' || token.symbol === 'zBRKL' || token.symbol === 'zOPUL'))
    fetchAssets()
  }, [tokenState.initialized])

  const fetchAssets = async () => {
    const response: any = await zilliqa.blockchain.getSmartContractSubStateBatch([
      [`818ca2e217e060ad17b7bd0124a483a1f66930a9`, "total_supply", []],
      [`2ca315f4329654614d1e8321f9c252921192c5f2`, "total_supply", []],
      [`75fa7d8ba6bed4a68774c758a5e43cfb6633d9d6`, "total_supply", []],
      [`32339fa037f7ae1dfff25e13c6451a80289d61f4`, "total_supply", []],
      [`201c44b426d85fb2c382563483140825fd81b9b5`, "total_supply", []]
    ])

    const result: any[] = response.batch_result

    const assets = await getBridgeAssets("1", "500000000")

    setSupplies({
      XCAD: assets.assets.filter(asset => asset.symbol === 'XCAD')[0].amount,
      zETH: toBigNumber(result[1].result.total_supply).times(Math.pow(10, -18)).toNumber(),
      zWBTC: toBigNumber(result[2].result.total_supply).times(Math.pow(10, -8)).toNumber(),
      zUSDT: toBigNumber(result[0].result.total_supply).times(Math.pow(10, -6)).toNumber(),
      PORT: assets.assets.filter(asset => asset.symbol === 'PORT')[0].amount,
      zBRKL: toBigNumber(result[3].result.total_supply).times(Math.pow(10, -18)).toNumber(),
      zOPUL: toBigNumber(result[4].result.total_supply).times(Math.pow(10, -18)).toNumber(),
    })
  }

  useInterval(async () => {
      fetchAssets()
  }, 50000)

  const totalValue = useMemo(() => {
    var value = 0
    bridgeTokens.forEach(token => {
      value += supplies[token.symbol] * token.market_data.rate_zil
    })
    return value
  }, [supplies])

  if(bridgeTokens.length === 0) {
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
          <div className="bg-white dark:bg-gray-800 py-4 px-8 rounded-lg font-bold text-4xl">{currencyFormat(totalValue * selectedCurrency.rate, selectedCurrency.symbol, 0)}</div>
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
              {bridgeTokens.sort((a,b) => {
                const aValue = supplies[a.symbol] * a.market_data.rate_zil
                const bValue = supplies[b.symbol] * b.market_data.rate_zil
                return aValue > bValue ? -1 : 1
              }).map((token, index) => {
                const value = supplies[token.symbol] * token.market_data.rate_zil
                return (
                  <tr key={token.address} className="text-lg border-b dark:border-gray-700 last:border-b-0">
                    <td className={`pl-4 pr-2 py-3 font-medium whitespace-nowrap ${index === 0 ? 'rounded-tl-lg' : ''} ${index === bridgeTokens.length-1 ? 'rounded-bl-lg' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8">
                          <TokenIcon address={token.address} />
                        </div>
                        <div className="font-bold">{token.symbol}</div>
                      </div>
                    </td>
                    <td className="px-2 py-3 font-normal text-right">
                      {cryptoFormat(supplies[token.symbol])} <span className="font-semibold">{token.symbol}</span>
                      
                    </td>
                    <td className={`px-2 py-3 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === bridgeTokens.length-1 ? 'rounded-br-lg' : ''}`}>
                      {currencyFormat(value * selectedCurrency.rate, selectedCurrency.symbol, 0)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default Bridge