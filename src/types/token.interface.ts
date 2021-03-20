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