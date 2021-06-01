import { Popover, Transition } from '@headlessui/react'
import BigNumber from 'bignumber.js'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, StakingState, TokenInfo, TokenState } from 'store/types'
import { cryptoFormat } from 'utils/format'
import { BIG_ZERO } from 'utils/strings'
import useMoneyFormatter, { toBigNumber } from 'utils/useMoneyFormatter'

const StreamPopover = () => {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const streamTokens = tokenState.tokens.filter(token => token.isStream)
  const streamToken: TokenInfo|null = streamTokens[0] ?? null
  var streamBalance = new BigNumber(0)
  var streamBalanceUSD = new BigNumber(0)
  var totalBalance = new BigNumber(0)

  useEffect(() => {
    if(streamToken) {
      streamBalance = streamToken.balance ?? new BigNumber(0)
      streamBalanceUSD = streamBalance.times(streamToken.rate).times(tokenState.zilRate)
    }
  
    const holdingBalance = tokenState.tokens.reduce((sum, current) => {
      let balance = toBigNumber(current.balance, {compression: current.decimals})
  
      if(current.isZil) return sum.plus(balance)
  
      return sum.plus(balance.times(current.rate))
    }, new BigNumber(0))
    totalBalance = totalBalance.plus(holdingBalance)
  
    const liquidityBalance = tokenState.tokens.reduce((sum, current) => {
      if(!current.pool || !current.pool.userContribution)  return sum 
  
      let pool = current.pool!
      let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution).times(100)
      let contributionShare = contributionPercentage.shiftedBy(-2)
      let zilAmount = contributionShare?.times(current.pool?.zilReserve ?? BIG_ZERO);
      let totalZilAmount = zilAmount.times(2)
  
      return sum.plus(totalZilAmount)
    }, new BigNumber(0))
    totalBalance = totalBalance.plus(liquidityBalance.shiftedBy(-12))
    
  
    const stakingBalance = stakingState.operators.reduce((sum, current) => {
      if(current.symbol === 'ZIL') {
        let staked = toBigNumber(current.staked, {compression: 12})
        return sum.plus(staked)
      } else {
        let staked = toBigNumber(current.staked, {compression: current.decimals})
        let rate = tokenState.tokens.filter(token => token.symbol == current.symbol)[0].rate
        return sum.plus(staked.times(rate))
      }
    }, new BigNumber(0))
    totalBalance = totalBalance.plus(stakingBalance)
  }, [tokenState])

  return (
    <Popover>
      {({ open }) => (
        <>
          <Popover.Button className="menu-item-active focus:outline-none flex items-center mr-2">
            <span className="mr-2">{cryptoFormat(streamBalance.toNumber())}</span>
            <img className="h-4 w-4" src="/stream.svg" alt="STREAM" />
          </Popover.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel className="origin-top-right absolute right-0 z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72">
              <div className="flex flex-col items-center">
                <div className="font-semibold mb-3">STREAM balance</div>
                <img className="h-12 w-12" src="/stream.svg" alt="STREAM" />
                <div className="mt-2 font-semibold">{cryptoFormat(streamBalance.toNumber())}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">${moneyFormat(streamBalanceUSD, {maxFractionDigits: 2})}</div>
                <div className="border-2 border-primary rounded-full text-sm font-medium text-primary px-2 mt-2">ZilStream Member</div>
              </div>
              <div className="mt-4 text-sm">
                <div className="flex items-center mb-1">
                  <div className="flex-grow text-gray-600 dark:text-gray-400">
                    Wallet balance
                  </div>
                  <div>${moneyFormat(totalBalance.times(tokenState.zilRate), {maxFractionDigits: 2})}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow text-gray-600 dark:text-gray-400">
                    Membership
                  </div>
                  <div>${moneyFormat(totalBalance.times(tokenState.zilRate).dividedBy(200), {maxFractionDigits: 2})}</div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
          </>
      )}
    </Popover>
  )
}

export default StreamPopover