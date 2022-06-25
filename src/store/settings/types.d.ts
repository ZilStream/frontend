export interface SettingsState {
  initialized: boolean
  columns: DataColumns
  filters: TokenFilters
  rows: number
}

export interface DataColumns {
  priceZIL: boolean
  priceFiat: boolean
  ath: boolean
  atl: boolean
  change24H: boolean
  change7D: boolean
  change24HZIL: boolean
  change7DZIL: boolean
  marketCap: boolean
  marketCapDiluted: boolean
  circSupply: boolean
  totalSupply: boolean
  maxSupply: boolean
  liquidity: boolean
  volume: boolean
  apr: boolean
  apy: boolean
  graph24H: boolean
  graph24HZIL: boolean
}

export interface TokenFilters {
  unlisted: boolean
  bridged: boolean
}

export interface UpdateSettingsProps extends Partial<SettingsState> {}
export interface UpdateColumnsProps extends Partial<DataColumns> {}
export interface UpdateFiltersProps extends Partial<TokenFilters> {}