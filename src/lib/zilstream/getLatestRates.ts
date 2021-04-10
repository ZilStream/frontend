import { SimpleRate } from "types/rate.interface"

export default async function getLatestRates(): Promise<SimpleRate[]>  {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rates/latest`)
  return await res.json()
}