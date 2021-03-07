export interface Token {
  id: number
  name: string
  symbol: string
  icon: string
  address_bech32: string
  decimals: number
  init_supply: number
  max_supply: number
  current_supply: number
}