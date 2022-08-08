import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux'
import { AccountState, CollectionState, RootState, StakingState, Token, TokenState } from 'store/types'
import { BIG_ZERO } from './strings'
import { toBigNumber } from './useMoneyFormatter'

export interface TokenReward {
  amount: BigNumber
  address: string
  symbol: string
  payment_day: number|null
}

export default function useBalances() {
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const stakingState = useSelector<RootState, StakingState>(state => state.staking)
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const collectionState = useSelector<RootState, CollectionState>(state => state.collection)

  const { totalBalance, holdingBalance, liquidityBalance, stakingBalance, collectionBalance, membership, rewards } = useMemo(() => {
    if(!tokenState.initialized) {
      return {
        totalBalance: new BigNumber(0),
        holdingBalance: new BigNumber(0),
        liquidityBalance: new BigNumber(0),
        stakingBalance: new BigNumber(0),
        collectionBalance: new BigNumber(0),
        membership: {
          streamBalance: new BigNumber(0),
          streamBalanceUSD: new BigNumber(0),
          streamBalanceZIL: new BigNumber(0),
          membershipZIL: new BigNumber(0),
          isMember: false
        },
        rewards: {}
      }
    }
    const streamTokens = tokenState.tokens.filter(token => token.isStream)
    const streamToken: Token|null = streamTokens[0] ?? null
    var streamBalance = new BigNumber(0)
    var streamBalanceUSD = new BigNumber(0)
    var streamBalanceZIL = new BigNumber(0)

    if(streamToken) {
      streamBalance = streamToken.balance ?? new BigNumber(0)

      if(streamToken.pools) {
        streamToken.pools.forEach(pool => {
          if(!pool.totalContribution || !pool.userContribution) return
          let contributionPercentage = pool.userContribution.dividedBy(pool.totalContribution).times(100)
          let contributionShare = contributionPercentage.shiftedBy(-2)
          let streamLiquidityAmount = contributionShare?.times(pool.baseReserve ?? BIG_ZERO);
          streamBalance = streamBalance.plus(streamLiquidityAmount)
        })
      }

      streamBalance = streamBalance.shiftedBy(-8)
      streamBalanceUSD = streamBalance.times(streamToken.market_data.rate_zil).times(tokenState.zilRate)
      streamBalanceZIL = streamBalance.times(streamToken.market_data.rate_zil)
    }

    var totalBalance = new BigNumber(0)
    var holdingBalance = new BigNumber(0)
    var liquidityBalance = new BigNumber(0)
    var stakingBalance = new BigNumber(0)
    var collectionBalance = new BigNumber(0)

    if(tokenState.initialized) {
      holdingBalance = tokenState.tokens.reduce((sum, current) => {
        let balance = toBigNumber(current.balance, {compression: current.decimals})
    
        if(current.isZil) return sum.plus(balance)
    
        return sum.plus(balance.times(current.market_data.rate_zil))
      }, new BigNumber(0))
      totalBalance = totalBalance.plus(holdingBalance)
    
      liquidityBalance = tokenState.tokens.reduce((sum, current) => {
        var newSum = sum

        if(current.pools) {
          current.pools.forEach(pool => {
            if(!pool.totalContribution || !pool.userContribution) return
            let contributionPercentage = pool.userContribution.dividedBy(pool.totalContribution).times(100)
            let contributionShare = contributionPercentage.shiftedBy(-2)
            let zilAmount = (pool.baseReserve ?? BIG_ZERO).shiftedBy(-current.decimals).times(current.market_data.rate_zil).times(2).times(contributionShare)
            newSum = newSum.plus(zilAmount)
          })
        }
        
        return newSum
      }, new BigNumber(0))
      totalBalance = totalBalance.plus(liquidityBalance)
      
      stakingBalance = stakingState.operators.reduce((sum, current) => {
        if(current.symbol === 'ZIL') {
          let staked = toBigNumber(current.staked, {compression: 12})
          return sum.plus(staked)
        } else {
          let staked = toBigNumber(current.staked, {compression: current.decimals})
          let rate = tokenState.tokens.filter(token => token.symbol == current.symbol)[0].market_data.rate_zil
          return sum.plus(staked.times(rate))
        }
      }, new BigNumber(0))
      totalBalance = totalBalance.plus(stakingBalance)
    }

    if(collectionState.initialized) {
      collectionBalance = collectionState.collections.reduce((sum, current) => {
        if(!current.tokens || current.tokens.length === 0) return sum
        let floor = toBigNumber(current.market_data.floor_price)
        return sum.plus(floor.times(current.tokens.length))
      }, new BigNumber(0))
      totalBalance = totalBalance.plus(collectionBalance)
    }

    const membershipZIL = totalBalance.minus(collectionBalance).dividedBy(200)
    const isMember = streamBalanceZIL.isGreaterThanOrEqualTo(membershipZIL) && streamBalanceZIL.isGreaterThan(0)

    var rewards: {[key: string]: TokenReward} = {}

    tokenState.tokens.forEach(token => {
      if(!token.pools) return

      token.pools.forEach(pool => {
        if(!pool.userContribution || !pool.totalContribution || pool.userContribution.isZero()) return

        token.rewards.filter(reward => reward.exchange_id === pool.dex).forEach(reward => {
          let contributionPercentage = pool.userContribution!.dividedBy(pool.totalContribution ?? 0).times(100)
              let contributionShare = contributionPercentage.shiftedBy(-2)
          let currentReward = rewards[reward.reward_token_address]
          let newReward = toBigNumber(reward.amount).times(contributionShare)
  
          if(reward.max_individual_amount > 0 && newReward.isGreaterThan(reward.max_individual_amount)) {
            newReward = toBigNumber(reward.max_individual_amount)
          }

          newReward = newReward.dividedBy(reward.frequency).times(86400)
  
          if(currentReward !== undefined) {
            rewards[reward.reward_token_address] = {
              amount: currentReward.amount.plus(newReward),
              address: reward.reward_token_address,
              symbol: reward.reward_token_symbol,
              payment_day: reward.payment_day
            }
          } else {
            rewards[reward.reward_token_address] = {
              amount: newReward,
              address: reward.reward_token_address,
              symbol: reward.reward_token_symbol,
              payment_day: reward.payment_day
            }
          }
        })
      })
    })
    
    return {
      totalBalance,
      holdingBalance,
      liquidityBalance,
      stakingBalance,
      collectionBalance,
      membership: {
        streamBalance,
        streamBalanceUSD,
        streamBalanceZIL,
        membershipZIL: membershipZIL,
        isMember: isMember
      },
      rewards
    }
  }, [accountState, tokenState, stakingState])

  return { 
    totalBalance, 
    holdingBalance, 
    liquidityBalance, 
    stakingBalance,
    collectionBalance,
    membership,
    rewards
  }
}