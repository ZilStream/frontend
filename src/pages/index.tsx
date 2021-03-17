import RatesBlock from 'components/ChartBlock'
import TokenRow from 'components/TokenRow'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
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

  tokens.sort((a,b) => {
    const priorTokenRates = rates.filter(rate => rate.token_id == a.id).sort((x,y) => (x.time < y.time) ? 1 : -1)
    const priorLastRate = priorTokenRates.length > 0 ? priorTokenRates[0].value : 0
    const priorUsdRate = priorLastRate * latestZilRate.value
    const priorMarketCap = a.current_supply * priorUsdRate

    const nextTokenRates = rates.filter(rate => rate.token_id == b.id).sort((x,y) => (x.time < y.time) ? 1 : -1)
    const nextLastRate = nextTokenRates.length > 0 ? nextTokenRates[0].value : 0
    const nextUsdRate = nextLastRate * latestZilRate.value
    const nextMarketCap = b.current_supply * nextUsdRate

    return (priorMarketCap < nextMarketCap) ? 1 : -1
  })

  return (
    <>
      <Head>
        <title>Zilliqa ecosystem prices, charts, and market capitalizations | ZilStream</title>
        <meta property="og:title" content="Zilliqa ecosystem prices, charts, and market capitalizations | ZilStream" />
        <meta name="description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
        <meta property="og:description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
      </Head>
      <div className="py-8">
        <h1 className="mb-1">Todays prices in Zilliqa</h1>
        <div className="text-gray-600 dark:text-gray-400">
          Zilliqa is currently valued at <span className="font-medium">${Math.round(latestZilRate.value * 10000) / 10000}, </span>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {tokens.slice(0, 3).map( token => {                
          return (
            <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a>
                <RatesBlock token={token} rates={rates.filter(rate => rate.token_id == token.id)}  zilRate={latestZilRate} />
              </a>
            </Link>
          )
        })}     
      </div>
      <div className="grid grid-cols-1 gap-2 mt-10">
        <div className="flex items-center px-2 sm:px-4 text-gray-500 dark:text-gray-400 text-sm">
          <div className="w-6 mr-3 md:mr-4"></div>
          <div className="w-16 sm:w-24 md:w-36">Token</div>
          <div className="w-20 md:w-28 lg:w-36 text-right">Price (ZIL)</div>
          <div className="w-32 lg:w-40 hidden md:block text-right">Price (USD)</div>
          <div className="w-20 md:w-32 lg:w-40 text-right">Change (24h)</div>
          <div className="w-36 lg:w-44 xl:w-48 hidden lg:block text-right">Market Cap</div>
          <div className="w-36 lg:w-44 xl:w-48 hidden xl:block text-right">Volume (24h)</div>
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
