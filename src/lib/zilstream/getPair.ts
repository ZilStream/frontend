import { Pair } from "types/pair.interface"

export default async function getTokenPair(exchangeSlug: string, baseAddress: string, quoteAddress: string): Promise<Pair> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_IO_URL}/pairs/${exchangeSlug}/${baseAddress}/${quoteAddress}`)
  return res.json()
}