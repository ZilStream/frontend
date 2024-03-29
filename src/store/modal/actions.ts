export const ModalActionTypes = {
  OPEN_WALLET: "OPEN_WALLET",
  OPEN_CURRENCY: "OPEN_CURRENCY",
  OPEN_EXCHANGE: "OPEN_EXCHANGE",
  OPEN_EXPORT: "OPEN_EXPORT"
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

export function openExchange(open: boolean) {
  return {
    type: ModalActionTypes.OPEN_EXCHANGE,
    payload: open
  }
}

export function openExport(open: boolean) {
  return {
    type: ModalActionTypes.OPEN_EXPORT,
    payload: open
  }
}