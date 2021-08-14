import BigNumber from "bignumber.js";
import { Reward, TokenInfo, TokenState } from "store/types";
import { bnOrZero } from "./strings";
import { toBigNumber } from "./useMoneyFormatter";

export function getTokenAPR(token: TokenInfo, tokenState: TokenState): BigNumber {
  const rewards: Reward[] = token.rewards

  var totalRewardsValue = new BigNumber(0)
  rewards.forEach(reward => {
    const rewardTokens = tokenState.tokens.filter(token => token.address_bech32 == reward.reward_token_address)
    if(rewardTokens.length > 0) {
      const rewardToken = rewardTokens[0]
      const rewardsValue = toBigNumber(reward.amount).times(rewardToken.rate).times(tokenState.zilRate)
      totalRewardsValue = totalRewardsValue.plus(rewardsValue)
    }
  })

  const roiPerEpoch = totalRewardsValue.dividedBy(token.current_liquidity * tokenState.zilRate)
  const apr = bnOrZero(roiPerEpoch.times(52).shiftedBy(2).decimalPlaces(1))

  return apr
}