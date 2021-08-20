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
  viewblock_score: number
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
  telegram: string
  listed: string
  viewblock_score: number
  last_vote_start: string
  last_vote_end: string
  last_vote_hash: string
  supply_skip_addresses: string
  rate: number
  rate_usd: number
  market_data: MarketData
  rewards: Reward[]
}

export interface MarketData {
  init_supply: number
  max_supply: number
  total_supply: number
  current_supply: number
  daily_volume: number
  current_liquidity: number
  liquidity_providers: number
  zil_reserve: number
  token_reserve: number
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

export interface Reward {
  type: string
  amount: number
  max_individual_amount: number
  reward_token_address: string
  reward_token_symbol: string
  frequency: number
  frequency_type: string
  excluded_addresses: string
  adjusted_total_contributed: string
  adjusted_total_contributed_share: string
}