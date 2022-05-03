import BigNumber from 'bignumber.js'
import { DEX } from 'types/dex.interface'

export interface Token {
  id: number
  rank: number
  name: string
  symbol: string
  icon: string
  address: string
  decimals: number
  website: string
  whitepaper: string
  telegram: string
  discord: string
  init_supply: number
  max_supply: number
  viewblock_score: number
  reviewed: boolean
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
  pools?: TokenPool[]
  apr?: BigNumber
}

export interface MarketData {
  rate_usd: number
  rate_zil: number
  ath: number
  atl: number
  ath_zil: number
  atl_zil: number
  change_24h: number
  low_24h: number
  high_24h: number
  change_24h_zil: number
  low_24h_zil: number
  high_24h_zil: number
  change_percentage_24h: number
  change_percentage_7d: number
  change_percentage_30d: number
  change_percentage_24h_zil: number
  change_percentage_7d_zil: number
  init_supply: number
  max_supply: number
  total_supply: number
  current_supply: number
  daily_volume_usd: number
  daily_volume_zil: number
  market_cap_usd: number
  market_cap_zil: number
  fully_diluted_valuation_usd: number
  fully_diluted_valuation_zil: number
  current_liquidity_usd: number
  current_liquidity_zil: number
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
  current_apr: number
  exchange_id: number
  pair_id: number
}

export type TokenPool = {
  dex: DEX
  quoteAddress: string
  quoteReserve?: BigNumber
  baseAddress: string
  baseReserve?: BigNumber
  exchangeRate?: BigNumber
  totalContribution?: BigNumber
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
  address: string
}

export interface TokenAddProps {
  token: Token
}

export interface TokenPoolUpdateProps extends Partial<TokenPool> {
  address: string
  quoteAddress: string
  baseAddress: string
  dex: DEX
}