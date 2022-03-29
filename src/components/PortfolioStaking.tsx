import BigNumber from 'bignumber.js'
import React from 'react'
import { useSelector } from 'react-redux'
import { StakingState } from 'store/staking/types'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import EmptyRow from './EmptyRow'

function PortfolioStaking() {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  let zilRate = tokenState.zilRate
  
  let filteredOperators = stakingState.operators.filter(operator => {
    return operator.staked !== undefined && !toBigNumber(operator.staked).isZero()
  })

  filteredOperators.sort((a,b) => {
    let beforeStaked = a.staked ?? new BigNumber(0)
    let afterStaked = b.staked ?? new BigNumber(0)
    return beforeStaked.isLessThan(afterStaked) ? 1 : -1
  })

  return (
    <>
      <div className="font-semibold text-xl mt-8">Staking</div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '390px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Operator</th>
              <th className="px-2 py-2 text-right">Staked</th>
              <th className="px-2 py-2 text-right">{selectedCurrency.code}</th>
              <th className="px-2 py-2 text-right">Rate</th>
            </tr>
          </thead>
          <tbody>
            {filteredOperators.map((operator, index) => {
              let token = tokenState.tokens.filter(token => token.symbol == operator.symbol)[0]
              let lastRate = token.market_data.rate_zil

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
                  <td className="px-2 py-2 font-normal text-right">
                    {operator.symbol === 'ZIL' ? (
                      <>
                        {selectedCurrency.symbol}{moneyFormat(operator.staked?.times(selectedCurrency.rate), {
                          symbol: 'USD',
                          compression: operator.decimals,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })}
                      </>
                    ): (
                      <>
                        {selectedCurrency.symbol}{moneyFormat(operator.staked?.times(lastRate).times(selectedCurrency.rate), {
                          symbol: 'USD',
                          compression: operator.decimals,
                          maxFractionDigits: 2,
                          showCurrency: false,
                        })}
                      </>
                    )}
                  </td>
                  <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === filteredOperators.length-1 ? 'rounded-br-lg' : ''}`}>
                   {moneyFormat(lastRate, {
                      symbol: operator.symbol,
                      compression: 0,
                      maxFractionDigits: 2,
                      showCurrency: false,
                    })}
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