import { Token } from "store/types"

export default async function getToken(symbol: string): Promise<Token> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/tokens/${symbol}`)
  return res.json()
}