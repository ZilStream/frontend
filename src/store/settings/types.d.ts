export interface SettingsState {
  columns: DataColumns
  filters: TokenFilters
  rows: number
}

export type DataColumns = {
  zil: boolean = true
  usd: boolean = true
  marketCap: boolean = true
  liquidity: boolean = true
  volume: boolean = true
  graph24h: boolean = true
  apr: boolean = false
  change24h: boolean = true
}

export type TokenFilters =  {
  unvetted: boolean = false
  bridged: boolean = true
}