import { Token } from "types/token.interface";

export default async function getTokens(): Promise<Token[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/tokens`)
  return await res.json()
}