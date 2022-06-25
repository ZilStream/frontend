export interface NftCollection {
  name: string
  symbol: string
  description: string
  address: string
  icon: string
  owner_address: string
  owner_name: string
  website: string
  telegram: string
  twitter: string
  discord: string
  instagram: string
  base_uri: string
  market_data: {
    volume_24h: number
    volume_7d: number
    volume_all_time: number
    floor_price: number
  }
}