import RatesBlock from 'components/ChartBlock'
import TokenRow from 'components/TokenRow'
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
  const zilToken = tokens.filter(token => token.symbol == 'ZIL')[0]
  const zilRates = rates.filter(rate => rate.token_id == zilToken.id)
  const firstZilRate = zilRates[zilRates.length - 1]
  const latestZilRate = zilRates[0]

  const change = ((latestZilRate.value - firstZilRate.value) / firstZilRate.value) * 100
  const changeRounded = Math.round(change * 100) / 100

  return (
    <>
      <div className="py-8">
        <h1 className="mb-1">Todays prices in Zilliqa</h1>
        <div className="text-gray-600">
          Zilliqa is current valued at <span className="font-medium">${Math.round(latestZilRate.value * 10000) / 10000}, </span>
          {change >= 0 ? (
            <div className="inline">
              up <span className="text-green-600 dark:text-green-500 font-medium">{changeRounded}%</span> from yesterday.
            </div>
          ) : (
            <div className="inline">
              down <span className="text-red-600 dark:text-red-500 font-medium">{changeRounded}%</span> from yesterday.
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
        {tokens.filter(token => token.symbol == 'ZWAP' || token.symbol == 'gZIL' || token.symbol == 'XSGD').map( token => {                
          return (
            <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a>
                <RatesBlock token={token} rates={rates.filter(rate => rate.token_id == token.id)}  zilRate={latestZilRate} />
              </a>
            </Link>
          )
        })}     
      </div>
      <div className="grid grid-cols-1 gap-2 mt-6">
        <div className="flex items-center px-4 text-gray-500 text-sm">
          <div className="w-6 mr-3"></div>
          <div className="w-24 md:w-48">Token</div>
          <div className="w-24 md:w-32">Price (ZIL)</div>
          <div className="w-32 hidden md:block">Price (USD)</div>
          <div className="">
            Change (24h)
          </div>
          <div className="flex-grow text-right">
            Last 24 hours
          </div>
        </div>
        {tokens.filter(token => token.symbol != 'ZIL').map( token => {                
          return (
            <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a>
                <TokenRow token={token} rates={rates.filter(rate => rate.token_id == token.id)} zilRate={latestZilRate} />
              </a>
            </Link>
          )
        })}     
    </div>
  </>
  )
}

export default Home
