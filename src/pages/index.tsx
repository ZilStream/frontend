import dynamic from 'next/dynamic'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

export default function Home() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Chart />
      <Chart />
      <Chart />
    </div>
  )
}
