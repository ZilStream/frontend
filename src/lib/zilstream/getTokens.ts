import { Token } from "types/token.interface";

export default async function getTokens(unlisted: boolean = false): Promise<Token[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tokens?unlisted=${unlisted}`)
  return await res.json()
}