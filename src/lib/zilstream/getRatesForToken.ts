import { Rate } from "types/rate.interface";

export default async function getRatesForToken(symbol: string, interval: string = '1h', period: string = '7d'): Promise<Rate[]> {
  const res = await fetch(`https://api.zilstream.com/rates/${symbol}?interval=${interval}&period=${period}`)
  return res.json()
}