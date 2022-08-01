import { Exchange } from "./exchange.interface";
import { PairVolume } from "./pairVolume.interface";
import { Quote } from "./quote.interface";
import { Reserve } from "./reserve.interface";

export interface Pair {
  id: number
  pair: string
  category: string
  base_symbol: string
  base_address: string
  quote_symbol: string
  quote_address: string
  exchange_id?: string
  price?: number
  base_reserve?: number
  quote_reserve?: number
  volume_24h_base?: number
  volume_24h_quote?: number
  quote?: Quote
  reserve?: Reserve
  exchange?: Exchange
  volume?: PairVolume
}