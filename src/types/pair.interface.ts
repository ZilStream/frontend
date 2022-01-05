import { Quote } from "./quote.interface";
import { Reserve } from "./reserve.interface";

export interface Pair {
  pair: string
  category: string
  base_symbol: string
  base_address: string
  quote_symbol: string
  quote_address: string
  quote?: Quote
  reserve?: Reserve
}