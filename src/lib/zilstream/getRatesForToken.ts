import { Rate } from "types/rate.interface";

export default async function getRatesForToken(symbol: string, interval: string = '1h', period: string = '2w'): Promise<Rate[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rates/${symbol}?interval=${interval}&period=${period}`)
  return res.json()
}