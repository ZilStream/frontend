import { Token } from "store/types"
import { Pair } from "types/pair.interface"

export default async function getTokenPairs(address: string): Promise<Pair[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_IO_URL}/tokens/${address}/pairs`)
  return res.json()
}