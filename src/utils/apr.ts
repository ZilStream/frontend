import BigNumber from "bignumber.js";
import { Reward, TokenInfo, TokenState } from "store/types";
import { bnOrZero } from "./strings";
import { toBigNumber } from "./useMoneyFormatter";

export function getTokenAPR(token: TokenInfo, tokenState: TokenState): BigNumber {
  const rewards: Reward[] = token.rewards

  var totalAPR = new BigNumber(0)
  rewards.forEach(reward => {
    const rewardTokens = tokenState.tokens.filter(token => token.address_bech32 == reward.reward_token_address)
    if(rewardTokens.length > 0) {
      const rewardToken = rewardTokens[0]
      const rewardsValue = reward.reward_token_symbol !== 'ZIL' ? toBigNumber(reward.amount).times(rewardToken.rate).times(tokenState.zilRate) : toBigNumber(reward.amount).times(rewardToken.rate)
      const liquidity = toBigNumber(reward.adjusted_total_contributed_share).times(token.current_liquidity * tokenState.zilRate)
      const roiPerEpoch = rewardsValue.dividedBy(liquidity)
      const apr = bnOrZero(roiPerEpoch.times(52).shiftedBy(2).decimalPlaces(1))
      totalAPR = totalAPR.plus(apr)
    }
  })
  
  return totalAPR
}