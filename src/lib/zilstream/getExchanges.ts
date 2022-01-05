import { Exchange } from "types/exchange.interface"

export default async function getExchanges(): Promise<Exchange[]>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v2/exchanges`)
  return await res.json()
}