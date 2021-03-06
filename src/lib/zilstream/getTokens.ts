import { Token } from "types/token.interface";

export default async function getTokens(): Promise<Token[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens?unlisted=all`)
  return await res.json()
}