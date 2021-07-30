import BigNumber from "bignumber.js";

export interface TokenLaunch {
  name: string
  symbol: string
  icon?: string
  description?: string
  tags: string[]
  sale_type?: string
  sale_date?: Date
  goal?: BigNumber
  website?: string
  twitter?: string
  telegram?: string
}