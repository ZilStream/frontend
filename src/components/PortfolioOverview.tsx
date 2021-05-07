import BigNumber from 'bignumber.js'
import Link from 'next/link'
import React from 'react'
import { Operator, TokenInfo } from 'store/types'
import { SimpleRate } from 'types/rate.interface'
import { BIG_ZERO } from 'utils/strings'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import BalanceDonut from './BalanceDonut'
import FlashChange from './FlashChange'

interface Props {
  tokens: TokenInfo[]
  latestRates: SimpleRate[]
  operators: Operator[]
}

function PortfolioOverview(props: Props) {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  let zilRate = props.latestRates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0].rate

  var totalBalance = new BigNumber(0)

  var holdingBalance = props.tokens.reduce((sum, current) => {
    let balance = toBigNumber(current.balance, {compression: current.decimals})

    if(current.isZil) return sum.plus(balance)

    let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == current.address_bech32)[0].rate : 0
    return sum.plus(balance.times(rate))
  }, new BigNumber(0))
  totalBalance = totalBalance.plus(holdingBalance)

  var liquidityBalance = props.tokens.reduce((sum, current) => {
    if(!current.pool || !current.pool.userContribution)  return sum 

    let pool = current.pool!
    let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution).times(100)
    let contributionShare = contributionPercentage.shiftedBy(-2)
    let zilAmount = contributionShare?.times(current.pool?.zilReserve ?? BIG_ZERO);
    let totalZilAmount = zilAmount.times(2)

    return sum.plus(totalZilAmount)
  }, new BigNumber(0))
  totalBalance = totalBalance.plus(liquidityBalance.shiftedBy(-12))
  

  var stakingBalance = props.operators.reduce((sum, current) => {
    let staked = toBigNumber(current.staked, {compression: 12})
    return sum.plus(staked)
  }, new BigNumber(0))
  totalBalance = totalBalance.plus(stakingBalance.shiftedBy(-12))  

  return (
    <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg sm:w-96 max-w-full flex-shrink-0 flex-grow-0 mr-4">
      <div className="text-gray-600 dark:text-gray-400 text-sm">Current balance</div>
      <div className="flex-grow flex flex-col items-start mb-6">
        <div className="font-semibold text-2xl">
          <FlashChange value={totalBalance.times(zilRate).toNumber()}>
            ${moneyFormat(totalBalance.times(zilRate), {compression: 0, maxFractionDigits: 2})}
          </FlashChange>
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-lg">{moneyFormat(totalBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
      </div>

      <BalanceDonut tokens={props.tokens} operators={props.operators} latestRates={props.latestRates} />

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Holding balance</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            ${moneyFormat(holdingBalance.times(zilRate), {compression: 0, maxFractionDigits: 2})}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(holdingBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Liquidity Pools</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            ${moneyFormat(liquidityBalance.times(zilRate), {compression: 12, maxFractionDigits: 2})}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(liquidityBalance, {compression: 12, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">Estimated ZWAP rewards</div>
      <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/updates/announcing-premium-membership">learn more</Link>.</div>

      <div className="text-sm text-gray-500 mt-4">Fees earned</div>
      <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/updates/announcing-premium-membership">learn more</Link>.</div>

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Staking</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            ${moneyFormat(stakingBalance.times(zilRate), {compression: 0, maxFractionDigits: 2})}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(stakingBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">Rewards earned</div>
      <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/updates/announcing-premium-membership">learn more</Link>.</div>
    </div>
  )
}

export default PortfolioOverview