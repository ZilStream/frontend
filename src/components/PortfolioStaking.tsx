import React from 'react'
import { Operator } from 'store/staking/types'
import { SimpleRate } from 'types/rate.interface'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import EmptyRow from './EmptyRow'

interface Props {
  walletAddress: string,
  operators: Operator[],
  latestRates: SimpleRate[]
}

function PortfolioStaking(props: Props) {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  let zilRate = props.latestRates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0]
  
  let filteredOperators = props.operators.filter(operator => {
    return operator.staked !== undefined && !toBigNumber(operator.staked).isZero()
  })

  return (
    <>
      <div className="font-bold text-2xl mt-8">Staking</div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '390px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Operator</th>
              <th className="px-2 py-2 text-right">Staked</th>
              <th className="px-2 py-2 text-right">USD</th>
            </tr>
          </thead>
          <tbody>
            {filteredOperators.map((operator, index) => {
              let lastRate = props.latestRates.filter(rate => rate.symbol == operator.symbol)[0]

              return (
                <tr key={index} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === filteredOperators.length-1 ? 'rounded-bl-lg' : ''}`}>
                    <span className="font-semibold">{operator.name}</span>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <span className="text-gray-600 dark:text-gray-400 font-medium mr-2">{operator.symbol}</span>
                    {moneyFormat(operator.staked, {
                      symbol: operator.symbol,
                      compression: operator.decimals,
                      maxFractionDigits: 2,
                      showCurrency: false,
                    })}
                  </td>
                  <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === filteredOperators.length-1 ? 'rounded-br-lg' : ''}`}>
                    {operator.symbol === 'ZIL' ? (
                      <>
                        ${moneyFormat(operator.staked?.times(zilRate.rate), {
                          symbol: 'USD',
                          compression: operator.decimals,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })}
                      </>
                    ): (
                      <>
                        ${moneyFormat(operator.staked?.times(lastRate.rate).times(zilRate.rate), {
                          symbol: 'USD',
                          compression: operator.decimals,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })}
                      </>
                    )}
                    
                  </td>
                </tr>
              )
            })}
            
          </tbody>
        </table>
        {filteredOperators.length === 0 &&
          <EmptyRow message="Currently not staking." />
        }
      </div>
    </>
  )
}

export default PortfolioStaking