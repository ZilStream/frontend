import { Token } from "store/types"
import { Pair } from "types/pair.interface"

export default async function getTokenPairs(symbol: string): Promise<Pair[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/tokens/${symbol}/pairs`)
  return res.json()
}