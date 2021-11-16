export const ModalActionTypes = {
  OPEN_WALLET: "OPEN_WALLET",
  OPEN_CURRENCY: "OPEN_CURRENCY"
}

export function openWallet(open: boolean) {
  return {
    type: ModalActionTypes.OPEN_WALLET,
    payload: open
  }
}

export function openCurrency(open: boolean) {
  return {
    type: ModalActionTypes.OPEN_CURRENCY,
    payload: open
  }
}