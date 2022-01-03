import BigNumber from 'bignumber.js'

export interface Token {
  id: number
  name: string
  symbol: string
  icon: string
  address_bech32: string
  decimals: number
  website: string
  whitepaper: string
  telegram: string
  listed: boolean
  bridged: boolean
  viewblock_score: number
  current_supply: number
  market_cap: number
  daily_volume: number
  current_liquidity: number
  last_vote_start: string
  last_vote_end: string
  last_vote_hash: string
  tags: string
  supply_skip_addresses: string
  market_data: MarketData
  rewards: Reward[]
  isZil: boolean
  isStream: boolean
  isFavorited: boolean = false
  balance?: BigNumber = 0
  pool?: TokenPool
  apr?: BigNumber
}

export interface MarketData {
  init_supply: number
  max_supply: number
  total_supply: number
  current_supply: number
  daily_volume: number
  daily_volume_zil: number
  current_liquidity: number
  current_liquidity_zil: number
  liquidity_providers: number
  zil_reserve: number
  token_reserve: number
  market_cap: number
  market_cap_zil: number
  fully_diluted_valuation: number
  fully_diluted_valuation_zil: number
  ath: number
  atl: number
  change_24h: number
  low_24h: number
  high_24h: number
  change_percentage_24h: number
  change_percentage_7d: number
  change_percentage_14d: number
  change_percentage_30d: number
  rate: number
  rate_usd: number
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
  payment_day: number|null
}

export type TokenPool = {
  zilReserve: BigNumber
  tokenReserve: BigNumber
  exchangeRate: BigNumber
  totalContribution: BigNumber
  userContribution?: BigNumber
  contributionPercentage?: BigNumber
}

export interface TokenState {
  initialized: boolean,
  zilRate: number,
  tokens: Token[]
}

export interface TokenInitProps {
  tokens: Token[]
}

export interface TokenUpdateProps extends Partial<Token> {
  address_bech32: string
}

export interface TokenAddProps {
  token: Token
}

export interface TokenPoolUpdateProps extends Partial<TokenPool> {
  address: string
}