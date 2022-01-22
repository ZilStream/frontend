import { Pair } from "./pair.interface";

export interface Exchange {
  name: string
  slug: string
  network: string
  address: string
  icon: string
  website: string
  pairs: Pair[]
  stats?: ExchangeStats
}

export interface ExchangeStats {
  volume_24h: number
  liquidity: number
}