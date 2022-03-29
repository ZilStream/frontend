import getZRCBalance from "lib/zilliqa/getZRCBalance";
import { Token } from "store/types";
import { Balance } from "types/balance.interface";

export async function getBalancesForTokens(walletAddress: string, tokens: Token[]): Promise<Balance[]> {
  var balances: Balance[] = []


  tokens.forEach(async token => {
    let balance = await getZRCBalance(
      token.address,
      walletAddress
    )
    balances.push({
      tokenAddress: token.address,
      balance: balance ? (balance * Math.pow(10, -token.decimals)) : 0
    })
  })

  return balances
}