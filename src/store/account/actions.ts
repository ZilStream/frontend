import { AddWalletProps } from "./types"

export const AccountActionTypes = {
  INIT_ACCOUNT: "INIT_ACCOUNT",
  NETWORK_UPDATE: "NETWORK_UPDATE",
  ADD_WALLET: "ADD_WALLET"
}

export function updateNetwork(payload: string) {
  return {
    type: AccountActionTypes.NETWORK_UPDATE,
    payload
  }
}

export function addWallet(payload: AddWalletProps) {
  return {
    type: AccountActionTypes.ADD_WALLET,
    payload
  }
}