export interface Rate {
  time: string
  value: number
  low: number
  high: number
  open: number
  close: number
  token_id: number
}

export interface SimpleRate {
  symbol: string
  address: string
  rate: number
}