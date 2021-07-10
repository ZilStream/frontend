import { CurrencySelectProps, CurrencyUpdateProps } from "./types";

export const CurrencyActionTypes = {
  CURRENCY_UPDATE: "CURRENCY_UPDATE",
  CURRENCY_SELECT: "CURRENCY_SELECT"
}

export function update(payload: CurrencyUpdateProps) {
  return {
    type: CurrencyActionTypes.CURRENCY_UPDATE,
    payload
  }
}

export function select(payload: CurrencySelectProps) {
  return {
    type: CurrencyActionTypes.CURRENCY_SELECT,
    payload
  }
}