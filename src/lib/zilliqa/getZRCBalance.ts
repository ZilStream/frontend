import getSmartContractSubState from "./getSmartContractSubState";
import { callableAddress } from "./zilliqa";

export default async function getZRCBalance(proxyAddress: string, wallet: string): Promise<number|null> {
  let address = String(callableAddress(wallet)).toLowerCase()
  let response = await getSmartContractSubState(proxyAddress, 'balances', [address])

  if(response && !response.result) {
    return null
  }
  return +response?.result.balances[address]
}