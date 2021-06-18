import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'
import { AccountState, RootState, StakingState, TokenState } from 'store/types'
import useBalances from 'utils/useBalances'
import useMoneyFormatter from 'utils/useMoneyFormatter'
import BalanceDonut from './BalanceDonut'
import FlashChange from './FlashChange'

function PortfolioOverview() {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const { totalBalance, holdingBalance, liquidityBalance, stakingBalance, membership } = useBalances()

  let zilRate = tokenState.zilRate

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

      <BalanceDonut tokens={tokenState.tokens} operators={stakingState.operators} />

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
      {membership.isMember ? (
        <div></div>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/updates/announcing-premium-membership">learn more</Link>.</div>
      )}

      <div className="text-sm text-gray-500 mt-4">Estimated fees earned</div>
      {membership.isMember ? (
        <div></div>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/updates/announcing-premium-membership">learn more</Link>.</div>
      )}

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Staking</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            ${moneyFormat(stakingBalance.times(zilRate), {compression: 0, maxFractionDigits: 2})}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(stakingBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioOverview