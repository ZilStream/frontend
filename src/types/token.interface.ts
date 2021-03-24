export interface Token {
  id: number
  name: string
  symbol: string
  icon: string
  address_bech32: string
  decimals: number
  init_supply: number
  max_supply: number
  total_supply: number
  current_supply: number
  daily_volume: number
  current_liquidity: number
  website: string
  whitepaper: string
  supply_skip_addresses: string
}

export interface TokenDetail {
  id: number
  name: string
  symbol: string
  icon: string
  address_bech32: string
  decimals: number
  website: string
  whitepaper: string
  supply_skip_addresses: string
  rate: number
  rate_usd: number
  market_data: MarketData
}

export interface MarketData {
  init_supply: number
  max_supply: number
  total_supply: number
  current_supply: number
  daily_volume: number
  current_liquidity: number
  market_cap: number
  fully_diluted_valuation: number
  ath: number
  atl: number
  change_24h: number
  change_percentage_24h: number
  change_percentage_7d: number
  change_percentage_14d: number
  change_percentage_30d: number
}