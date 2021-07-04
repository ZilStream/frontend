import BigNumber from "bignumber.js";

export type Currency = {
  name: string
  code: string
  symbol: string
  rate: number = 0
  isPopular: boolean
  isFiat: boolean
  isCrypto: boolean
}

export interface CurrencyState {
  currencies: Currency[]
  selectedCurrency: string
}

export interface CurrencyUpdateProps extends Partial<Currency> {
  code: string
}

export interface CurrencySelectProps {
  currency: string
}