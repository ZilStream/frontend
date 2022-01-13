import BigNumber from "bignumber.js";
import { Reward, Token, TokenState } from "store/types";
import { bnOrZero } from "./strings";
import { toBigNumber } from "./useMoneyFormatter";

export function getTokenAPR(token: Token, tokenState: TokenState): BigNumber {
  const rewards: Reward[] = token.rewards

  var totalAPR = new BigNumber(0)
  rewards.forEach(reward => {
    if(reward.exchange_id === 1) {
      totalAPR = totalAPR.plus(reward.current_apr)
    }
  })
  
  return totalAPR
}