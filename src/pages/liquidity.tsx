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

export const getServerSideProps = async () => {
  const stats = await getStats()

  return {
    props: {
      stats,
    }
  }
}

const Liquidity = ({ stats }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const { rewards, edit } = router.query

  const tokens: any[] = stats.tokens.filter((token: any) => token.liquidity > 0)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)

  const zwapTokens = tokenState.tokens.filter(token => token.symbol === 'ZWAP')
  const zwapToken: Token|null = zwapTokens[0] ?? null

  const [minimumLiquidity, setMinimumLiquidity] = useState<number>(3000000)
  const [liquidityFactor, setLiquidityFactor] = useState<number>(3500000)
  const [volumeFactor, setVolumeFactor] = useState<number>(0.01)
  const [maxAP, setMaxAP] = useState<number>(8)

  tokens.forEach(token => {
    if(token.symbol === 'ZWAP') {
      token.aps = 40
      return
    }

    if(token.symbol === 'BOLT') {
      token.aps = 0
      return
    }

    if(token.liquidity_ema30_zil < minimumLiquidity) {
      token.aps = 0
      return
    }

    const aps = Math.min(
      maxAP,
      Math.ceil(Math.sqrt(token.liquidity_ema30_zil / liquidityFactor)),
      Math.floor((token.volume_ema30_zil / token.liquidity_ema30_zil) / volumeFactor)
    )

    token.aps = aps
  })

  tokens.sort((a: any, b: any) => {
    return (a.liquidity_ema30_zil < b.liquidity_ema30_zil) ? 1 : -1
  })

  const totalAPs = tokens.reduce((sum, token) => {
    return sum + token.aps
  }, 0)

  const onMinimumLiquidityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMinimumLiquidity(+event.target.value);
  }

  const onLiquidityFactorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLiquidityFactor(+event.target.value);
  }

  const onVolumeFactorChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVolumeFactor(+event.target.value);
  }

  const onMaxAPChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMaxAP(+event.target.value);
  }
  
  return (
    <>  
      <Head>
        <title>ZilSwap Liquidity | ZilStream</title>
        <meta property="og:title" content={`ZilSwap Liquidity | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">ZilSwap</h1>
          </div>
        </div>
      </div>
      {edit === 'true' &&
        <div className="flex items-center gap-3 mb-3">
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Minimum Liquidity</div>
            <input type="number" onChange={onMinimumLiquidityChangeHandler} value={minimumLiquidity} className="py-1 px-2 rounded-lg focus:outline-none bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Max AP</div>
            <input type="number" onChange={onMaxAPChangeHandler} value={maxAP} className="py-1 px-2 rounded-lg focus:outline-none bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Liquidity Factor</div>
            <input type="number" onChange={onLiquidityFactorChangeHandler} value={liquidityFactor} className="py-1 px-2 rounded-lg focus:outline-none bg-gray-300 dark:bg-gray-600" />
          </div>
          <div className="text-sm">
            <div className="text-gray-500 dark:text-gray-400">Volume Factor</div>
            <input type="number" onChange={onVolumeFactorChangeHandler} value={volumeFactor} className="py-1 px-2 rounded-lg focus:outline-none bg-gray-300 dark:bg-gray-600" />
          </div>
        </div>
      }
      
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '250px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-right">Reserve</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">Volume (EMA30)</th>
              <th className="px-2 py-2 text-right">Liquidity (EMA30)</th>
              <th className="px-2 py-2 text-right">APs</th>
              <th className="pl-2 pr-3 py-2 text-right">Rewards</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token: any, index: number) => {
              const zwapAmount = token.aps / totalAPs * 5312.5

              var apr = 0
              if(zwapToken) {
                const rewardsValue = zwapAmount * zwapToken.market_data.rate_zil
                const roiPerEpoch = rewardsValue / token.liquidity_zil
                apr = roiPerEpoch * 52 * 100
              }

              return (
                <tr key={token.address} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === tokens.length-1 ? 'rounded-bl-lg' : ''}`}>
                   <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
                      <a className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                          <TokenIcon address={token.address} />
                        </div>
                        <span className="hidden lg:inline">{token.name}</span>
                        <span className="lg:font-normal ml-2 lg:text-gray-500">{token.symbol}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div>{cryptoFormat(token.zil_reserve)} <span className="font-medium">ZIL</span></div>
                    <div>{cryptoFormat(token.token_reserve)} <span className="font-medium">{token.symbol}</span></div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div>{currencyFormat(token.liquidity)}</div>
                    <div>{cryptoFormat(token.liquidity_zil)} <span className="font-medium">ZIL</span></div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    {numberFormat(token.volume_ema30_zil, 0)} <span className="font-medium">ZIL</span>
                  </td>
                  <td className={`px-2 py-2 font-normal text-right`}>
                    {numberFormat(token.liquidity_ema30_zil, 0)} <span className="font-medium">ZIL</span>
                  </td>
                  <td className={`px-2 py-2 font-normal text-right`}>

                    {token.liquidity_ema30_zil >= minimumLiquidity ? (
                      <>{token.aps}</>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                    
                  </td>
                  <td className={`pl-2 pr-3 py-2 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === tokens.length-1 ? 'rounded-br-lg' : ''}`}>
                    {token.liquidity_ema30_zil >= minimumLiquidity && token.symbol !== 'BOLT' ? (
                      <div>
                        <div>{numberFormat(zwapAmount, 2)} ZWAP</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{apr.toFixed(2)}% APR</div>
                      </div>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Liquidity