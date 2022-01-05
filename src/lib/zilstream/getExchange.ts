import { Exchange } from "types/exchange.interface"

export default async function getExchange(slug: string): Promise<Exchange>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/exchanges/${slug}`)
  return await res.json()
}