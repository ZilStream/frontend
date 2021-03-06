import RatesBlock from 'components/ChartBlock'
import { InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'

export const getServerSideProps = async () => {
  const res = await fetch('http://localhost:8080/rates')
  const rates: Rate[] = await res.json()
  
  return {
    props: {
      rates,
    },
  }
}

function Home({ rates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <RatesBlock token={{id: "3", name: "ZWAP", symbol: "ZWAP"}} rates={rates.filter(rate => rate.token_id == 3)} />
      <RatesBlock token={{id: "2", name: "gZIL", symbol: "gZIL"}} rates={rates.filter(rate => rate.token_id == 2)} />
      <RatesBlock token={{id: "4", name: "Port", symbol: "PORT"}} rates={rates.filter(rate => rate.token_id == 4)} />
    </div>
  )
}

export default Home
