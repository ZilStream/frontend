import React, { useMemo } from 'react'
import { RootState, Token, TokenState } from 'store/types'
import TokenIcon from './TokenIcon'
import Link from 'next/link'
import { currencyFormat } from 'utils/format'
import { useSelector } from 'react-redux'
import { bnOrZero } from 'utils/strings'


const HighestVolumeBlock = () => {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)

  const volumeTokens = useMemo(() => {
    if(!tokenState.initialized) return []

    var tokens = tokenState.tokens

    tokens.sort((a: Token, b: Token) => {
      return a.market_data.daily_volume_usd < b.market_data.daily_volume_usd ? 1 : -1
    })

    tokens = tokens.slice(0, 3)

    return tokens
  }, [tokenState])

  return (
    <div className="h-48 rounded-lg py-2 px-3 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="mb-2">
        <div className="flex items-center text-lg -mb-1">
          <div className="flex-grow flex items-center">
            <span className="font-semibold mr-2">Highest Volume</span>
            <span className="mr-2"></span>
          </div>
          <div>
            {volumeTokens.length > 0 &&
              <>Up to {currencyFormat(volumeTokens[0].market_data.daily_volume_usd)}</>
            }
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-sm">Across all DEXs</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-sm mt-1">
        {volumeTokens.map((token, index) => {          
          return (
            <div key={token.id} className="flex items-center gap-3">
              <div>{index+1}.</div>
              <div className="w-6 h-6">
                <TokenIcon address={token.address} />
              </div>
              <div className="font-medium flex-grow">
                <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
                  <a className="flex items-center">
                    {token.name} <span className="font-normal text-gray-500 ml-1">{token.symbol}</span>
                  </a>
                </Link>
              </div>
              <div>{currencyFormat(token.market_data.daily_volume_usd)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HighestVolumeBlock