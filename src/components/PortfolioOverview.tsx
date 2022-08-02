import Tippy from '@tippyjs/react'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'
import { Info } from 'react-feather'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, StakingState, TokenState } from 'store/types'
import { DEX } from 'types/dex.interface'
import { currencyFormat } from 'utils/format'
import useBalances from 'utils/useBalances'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'
import BalanceDonut from './BalanceDonut'
import FlashChange from './FlashChange'
import TokenIcon from './TokenIcon'

function PortfolioOverview() {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const { totalBalance, holdingBalance, liquidityBalance, stakingBalance, collectionBalance, membership, rewards } = useBalances()

  const estimatedFees = tokenState.tokens.reduce((sum, current) => {
    if(!current.pools) return sum

    let newSum = sum

    current.pools.filter(pool => pool.dex === DEX.ZilSwap).forEach(pool => {
      if(!pool.userContribution || !pool.totalContribution) return
      let contributionPercentage = pool.userContribution.dividedBy(pool.totalContribution).times(100)
      let contributionShare = contributionPercentage.shiftedBy(-2)

      let volume = toBigNumber(current.market_data.daily_volume_zil)
      let fees = volume.times(0.003).times(contributionShare)
      newSum = newSum.plus(fees)
    })

    return newSum
  }, new BigNumber(0))

  const totalRewardZil = Object.keys(rewards).reduce((sum, current) => {
    let reward = rewards[current]
    let token = tokenState.tokens.filter(token => token.address === reward.address)[0]
    if(token.symbol === 'ZIL') {
      return sum.plus(reward.amount)
    }
    return sum.plus(reward.amount.times(token.market_data.rate_zil))
  }, new BigNumber(0))

  return (
    <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg sm:w-96 max-w-full flex-shrink-0 flex-grow-0 mr-6">
      <div className="text-gray-600 dark:text-gray-400 text-sm">Current Balance</div>
      <div className="flex-grow flex flex-col items-start mb-6">
        <div className="font-semibold text-2xl">
          <FlashChange value={totalBalance.times(selectedCurrency.rate).toNumber()}>
            {currencyFormat(totalBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </FlashChange>
        </div>
        <div className="text-gray-600 dark:text-gray-400 text-lg">{moneyFormat(totalBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
      </div>

      <BalanceDonut tokens={tokenState.tokens} operators={stakingState.operators} />

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Holding Balance</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            {currencyFormat(holdingBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(holdingBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Liquidity Pools</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            {currencyFormat(liquidityBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(liquidityBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">Estimated daily rewards</div>
      {membership.isMember ? (
        <>
          <div className="flex-grow flex items-center">
            <div className="font-medium text-xl">
              {currencyFormat(totalRewardZil.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
            </div>
            <div className="text-gray-500 text-md ml-2">{moneyFormat(totalRewardZil, {compression: 0, maxFractionDigits: 2})} ZIL</div>
          </div>
          <div className="-mt-1 mb-1">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Weekly: {currencyFormat(totalRewardZil.times(7).times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)} ({moneyFormat(totalRewardZil.times(7), {compression: 0, maxFractionDigits: 2})} ZIL)
            </span>
          </div>
          <div className="text-sm">
            {Object.keys(rewards).map(address => {
              let reward = rewards[address]
              const paymentDayDetail = reward.payment_day !== null ? (
                <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-md text-sm">
                  Distributed on <span className="font-semibold">{dayjs().day(reward.payment_day).format('dddd')}</span>
                </div>
              ) : (<></>)
              return (
                <div key={address} className="flex items-center">
                  <span className="w-4 h-4 mr-2"><TokenIcon address={reward.address} /></span>
                  <span className="mr-1">{moneyFormat(reward.amount, {compression: 0, maxFractionDigits: 2})}</span>
                  <span className="font-medium">{reward.symbol}</span>
                  {reward.payment_day !== null &&
                    <Tippy content={paymentDayDetail}>
                      <button className="ml-2 focus:outline-none">
                        <Info size={14} className="text-gray-400 dark:text-gray-500" />
                      </button>
                    </Tippy>
                  }
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/membership">learn more</Link>.</div>
      )}

      <div className="text-sm text-gray-500 mt-4">Estimated fees earned (24h)</div>
      {membership.isMember ? (
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            {currencyFormat(estimatedFees.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(estimatedFees, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      ) : (
        <div className="text-sm text-gray-700 dark:text-gray-300">Requires Premium, <Link href="/membership">learn more</Link>.</div>
      )}

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">Staking</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            {currencyFormat(stakingBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(stakingBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>

      <div className="text-gray-600 dark:text-gray-400 text-sm border-b dark:border-gray-700 pb-2 mb-2 mt-8">NFT Collections</div>
      <div className="flex items-start">
        <div className="flex-grow flex items-center">
          <div className="font-medium text-xl">
            {currencyFormat(collectionBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}
          </div>
          <div className="text-gray-500 text-md ml-2">{moneyFormat(collectionBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioOverview