import { ChartDataPoint } from "components/Chart";

export default async function getVolume(): Promise<{time: string, value: number}[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/volume`)
  return res.json()
}