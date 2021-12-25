import React from 'react'
import { Token } from 'store/types'
import TokenIcon from './TokenIcon'

interface Props {
  tokens: Token[]
}

const HighestAPRBlock = (props: Props) => {
  const { tokens } = props

  return (
    <div className="h-48 rounded-lg py-2 px-3 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="mb-2">
        <div className="flex items-center text-lg -mb-1">
          <div className="flex-grow flex items-center">
            <span className="font-semibold mr-2">Highest APR</span>
            <span className="mr-2"></span>
          </div>
          <div>
            {tokens.length > 0 &&
              <>Up to {tokens[0].apr?.toNumber().toFixed(0)}%</>
            }
          </div>
        </div>
        <div>
          <span className="text-gray-400 text-sm">By providing liquidity on ZilSwap</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 text-sm mt-1">
        {tokens.map((token, index) => (
          <div key={token.id} className="flex items-center gap-3">
            <div>{index+1}.</div>
            <div className="w-6 h-6">
              <TokenIcon address={token.address_bech32} />
            </div>
            <div className="font-medium flex-grow">{token.name} <span className="font-normal text-gray-500 ml-1">{token.symbol}</span></div>
            <div>{token.apr?.toNumber()}%</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HighestAPRBlock