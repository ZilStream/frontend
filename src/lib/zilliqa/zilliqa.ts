import { Zilliqa, fromBech32Address, toChecksumAddress } from "@zilliqa-js/zilliqa";

export const MAIN_NET = 'https://api.zilliqa.com/'
export const TEST_NET = 'https://dev-api.zilliqa.com/'
export const zilliqa = new Zilliqa(MAIN_NET);

export function callableAddress(bech32Address: string): string {
  return toChecksumAddress(fromBech32Address(bech32Address))
}