import { ChartDataPoint } from "components/Chart";

export default async function getVolume(): Promise<
  { time: string; value: number }[]
> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_IO_URL}/chart/volume`);
  return res.json();
}
