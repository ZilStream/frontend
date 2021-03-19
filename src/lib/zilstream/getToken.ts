import { Token } from "types/token.interface"

export default async function getToken(symbol: string): Promise<Token> {
  const res = await fetch(`${process.env.BACKEND_URL}/token?symbol=${symbol}`)
  return res.json()
}