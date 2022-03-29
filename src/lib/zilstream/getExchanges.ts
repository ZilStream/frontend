import { Exchange } from "types/exchange.interface"

export default async function getExchanges(): Promise<Exchange[]>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_IO_URL}/exchanges`)
  return await res.json()
}