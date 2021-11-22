import { ChartDataPoint } from "components/Chart";

export default async function getTVL(): Promise<{time: string, value: number}[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tvl?period=month`)
  return res.json()
}