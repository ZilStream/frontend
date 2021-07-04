import BigNumber from "bignumber.js";

export type Currency = {
  name: string
  code: string
  symbol: string
  rate?: number = 0
}

export interface CurrencyState {
  currencies: Currency[]
  selectedCurrency: Currency
}

export interface CurrencyUpdateProps extends Partial<Currency> {
  code: string
}

export interface CurrencySelectProps {
  currency: Currency
}