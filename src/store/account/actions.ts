export const AccountActionTypes = {
  NETWORK_UPDATE: "NETWORK_UPDATE",
  WALLET_UPDATE: "WALLET_UPDATE"
}

export function updateNetwork(payload: string) {
  return {
    type: AccountActionTypes.NETWORK_UPDATE,
    payload
  }
}

export function updateWallet(payload: string) {
  return {
    type: AccountActionTypes.WALLET_UPDATE,
    payload
  }
}