import React from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { RootState, StakingState, TokenInfo, TokenState } from 'store/types'
import { BIG_ZERO } from './strings'
import { toBigNumber } from './useMoneyFormatter'

export default function useBalances() {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)

  const streamTokens = tokenState.tokens.filter(token => token.isStream)
  const streamToken: TokenInfo|null = streamTokens[0] ?? null
  var streamBalance = new BigNumber(0)
  var streamBalanceUSD = new BigNumber(0)

  if(streamToken) {
    streamBalance = streamToken.balance ?? new BigNumber(0)

    if(streamToken.pool) {
      let pool = streamToken.pool!
      let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution).times(100)
      let contributionShare = contributionPercentage.shiftedBy(-2)
      let streamLiquidityAmount = contributionShare?.times(streamToken.pool?.tokenReserve ?? BIG_ZERO);
      streamBalance = streamBalance.plus(streamLiquidityAmount).shiftedBy(-8)
    }

    streamBalanceUSD = streamBalance.times(streamToken.rate).times(tokenState.zilRate)
  }

  var totalBalance = new BigNumber(0)
  var holdingBalance = new BigNumber(0)
  var liquidityBalance = new BigNumber(0)
  var stakingBalance = new BigNumber(0)

  if(tokenState.initialized) {
    holdingBalance = tokenState.tokens.reduce((sum, current) => {
      let balance = toBigNumber(current.balance, {compression: current.decimals})
  
      if(current.isZil) return sum.plus(balance)
  
      return sum.plus(balance.times(current.rate))
    }, new BigNumber(0))
    totalBalance = totalBalance.plus(holdingBalance)
  
    liquidityBalance = tokenState.tokens.reduce((sum, current) => {
      if(!current.pool || !current.pool.userContribution || !current.pool.totalContribution)  return sum 
      
      let pool = current.pool!
      let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution).times(100)
      let contributionShare = contributionPercentage.shiftedBy(-2)
      let zilAmount = contributionShare?.times(current.pool?.zilReserve ?? BIG_ZERO);
      let totalZilAmount = zilAmount.times(2)
  
      return sum.plus(totalZilAmount)
    }, new BigNumber(0))
    totalBalance = totalBalance.plus(liquidityBalance.shiftedBy(-12))
    
    stakingBalance = stakingState.operators.reduce((sum, current) => {
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
  }

  var membershipUSD = totalBalance.times(tokenState.zilRate).dividedBy(200)

  return { 
    totalBalance, 
    holdingBalance, 
    liquidityBalance, 
    stakingBalance,
    membership: {
      streamBalance,
      streamBalanceUSD,
      membershipUSD,
      isMember: streamBalanceUSD >= membershipUSD
    }
  }
}