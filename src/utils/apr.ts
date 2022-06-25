import BigNumber from "bignumber.js";
import { Reward, Token, TokenState } from "store/types";
import { bnOrZero } from "./strings";
import { toBigNumber } from "./useMoneyFormatter";

export function getTokenAPR(token: Token, tokenState: TokenState): BigNumber {
  const rewards: Reward[] = token.rewards ?? []

  const groupBy = <T, K extends keyof any>(list: T[], getKey: (item: T) => K) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);

  const rewardGroups = groupBy(rewards, reward => reward.exchange_id)

  var aprs: number[] = []
  for (const [exchangeId, reward] of Object.entries(rewardGroups)) {
    
    const apr = reward.reduce((sum, cur) => sum + cur.current_apr, 0)
    aprs.push(apr)
  }
  
  return toBigNumber(Math.max(...aprs)).decimalPlaces(2)
}