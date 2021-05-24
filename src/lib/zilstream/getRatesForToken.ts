import { Rate } from "types/rate.interface";

export default async function getRatesForToken(symbol: string, interval: string = '1h', period: string = '2w', currency: string = 'zil'): Promise<Rate[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rates/${symbol}?interval=${interval}&period=${period}&currency=${currency}`)
  return res.json()
}