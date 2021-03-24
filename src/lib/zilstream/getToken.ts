import { TokenDetail } from "types/token.interface"

export default async function getToken(symbol: string): Promise<TokenDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens/${symbol}`)
  return res.json()
}