import RatesBlock from 'components/ChartBlock'
import { InferGetServerSidePropsType } from 'next'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'

export const getServerSideProps = async () => {
  const [tokensRes, ratesRes] = await Promise.all([
    fetch('http://localhost:8080/tokens'),
    fetch('http://localhost:8080/rates')
  ])

  const tokens: Token[] = await tokensRes.json()
  const rates: Rate[] = await ratesRes.json()

  return {
    props: {
      tokens,
      rates,
    },
  }
}

function Home({ tokens, rates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {tokens.map( token => {                
        return <RatesBlock key={token.id} token={token} rates={rates.filter(rate => rate.token_id == token.id)} />
      })}     
    </div>
  )
}

export default Home
