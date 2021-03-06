import RatesBlock from 'components/ChartBlock'
import { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'

export const getServerSideProps = async () => {
  const [tokensRes, ratesRes] = await Promise.all([
    fetch(`${process.env.BACKEND_URL}/tokens`),
    fetch(`${process.env.BACKEND_URL}/rates`)
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
        return (
          <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
            <a>
              <RatesBlock token={token} rates={rates.filter(rate => rate.token_id == token.id)} />
            </a>
          </Link>
        )
      })}     
    </div>
  )
}

export default Home
