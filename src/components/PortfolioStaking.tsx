import React from 'react'
import { Operator } from 'store/staking/types'
import { BIG_ZERO } from 'utils/strings'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import TokenIcon from './TokenIcon'

interface Props {
  walletAddress: string,
  operators: Operator[]
}

function PortfolioStaking(props: Props) {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  
  let filteredOperators = props.operators.filter(operator => {
    return operator.staked !== undefined && !toBigNumber(operator.staked).isZero()
  })

  return (
    <>
      <div className="font-bold text-2xl mt-8">Staking</div>
      <table className="zilstream-table table-fixed border-collapse">
        <colgroup>
          <col style={{width: '220px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
        </colgroup>
        <thead className="text-gray-500 dark:text-gray-400 text-xs">
          <tr>
            <th className="pl-3 pr-2 py-2 text-left">Pair</th>
            <th className="px-2 py-2 text-right">Pool</th>
            <th className="px-2 py-2 text-right">Share</th>
          </tr>
        </thead>
        <tbody>
          {filteredOperators.map((operator, index) => {
            return (
              <tr key={index} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === filteredOperators.length-1 ? 'rounded-bl-lg' : ''}`}>
                  <span className="font-semibold">{operator.name}</span>
                </td>
                <td className="px-2 py-2 font-normal text-right">
                  {moneyFormat(operator.staked, {
                    symbol: 'ZIL',
                    compression: 12,
                    maxFractionDigits: 2,
                    showCurrency: false,
                  })}
                </td>
                <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === filteredOperators.length-1 ? 'rounded-br-lg' : ''}`}>
                  {/* {moneyFormat(contributionPercentage, {
                    symbol: '0',
                    compression: 0,
                    maxFractionDigits: 5,
                    showCurrency: false,
                  })} */}
                </td>
              </tr>
            )
          })}
          
        </tbody>
      </table>
    </>
  )
}

export default PortfolioStaking