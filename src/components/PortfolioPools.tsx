import React from 'react'
import { TokenInfo } from 'store/types'
import { SimpleRate } from 'types/rate.interface'
import { BIG_ZERO } from 'utils/strings'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import EmptyRow from './EmptyRow'
import TokenIcon from './TokenIcon'

interface Props {
  tokens: TokenInfo[],
  zilRate: SimpleRate
}

function PortfolioPools(props: Props) {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  let filteredTokens = props.tokens.filter(token => {
    return token.pool && token.pool.userContribution && !token.pool.userContribution.isZero()
  })

  return (
    <>
      <div className="font-bold text-2xl mt-8">Pools</div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '250px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Pair</th>
              <th className="px-2 py-2 text-right">Pool</th>
              <th className="px-2 py-2 text-right">USD</th>
              <th className="px-2 py-2 text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {filteredTokens.map((token, index) => {
              let pool = token.pool!
              let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution).times(100)
              let contributionShare = contributionPercentage.shiftedBy(-2)
              let tokenAmount = contributionShare?.times(token.pool?.tokenReserve ?? BIG_ZERO);
              let zilAmount = contributionShare?.times(token.pool?.zilReserve ?? BIG_ZERO);

              return (
                <tr key={index} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === filteredTokens.length-1 ? 'rounded-bl-lg' : ''}`}>
                    <div className="flex items-center mr-3">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full p-1 flex-shrink-0 flex-grow-0 z-20">
                        <TokenIcon url={token.icon} />
                      </div>
                      <div className="w-6 h-6 -ml-2 bg-gray-200 dark:bg-gray-600 rounded-full p-1 flex-shrink-0 flex-grow-0 z-10">
                        <TokenIcon url={`https://meta.viewblock.io/ZIL/logo`} />
                      </div>
                    </div>
                    <span className="font-semibold">{token.symbol} / ZIL</span>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div className="w-32">
                      <div>
                        {moneyFormat(tokenAmount, {
                          symbol: token.symbol,
                          compression: token.decimals,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })} <span className="text-gray-500">{token.symbol}</span>
                      </div>
                      <div>
                        {moneyFormat(zilAmount, {
                          symbol: 'ZIL',
                          compression: 12,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })} <span className="text-gray-500">ZIL</span></div>
                    </div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    ${moneyFormat(zilAmount.times(2).times(props.zilRate.rate), {
                      symbol: 'USD',
                      compression: 12,
                      maxFractionDigits: 2,
                      showCurrency: false,
                    })}
                  </td>
                  <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === filteredTokens.length-1 ? 'rounded-br-lg' : ''}`}>
                    {moneyFormat(contributionPercentage, {
                      symbol: '0',
                      compression: 0,
                      maxFractionDigits: 5,
                      showCurrency: false,
                    })}%
                  </td>
                </tr>
              )
            })}
            
          </tbody>
        </table>
        {filteredTokens.length === 0 &&
          <EmptyRow message="Currently not providing liquidity." />
        }
      </div>
    </>
  )
}

export default PortfolioPools