import RatesBlock from 'components/ChartBlock'
import ExchangeStats from 'components/ExchangeStats'
import TokenRow from 'components/TokenRow'
import getRates from 'lib/zilstream/getRates'
import getTokens from 'lib/zilstream/getTokens'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertCircle } from 'react-feather'
import { ListType } from 'types/list.interface'
import { Rate } from 'types/rate.interface'
import { Token } from 'types/token.interface'
import { useInterval } from 'utils/interval'

export const getServerSideProps = async () => {
  const tokens = await getTokens()
  const unlistedTokens = await getTokens(true)
  const initialRates = await getRates()
  
  return {
    props: {
      tokens,
      unlistedTokens,
      initialRates,
    },
  }
}

function Home({ tokens, unlistedTokens, initialRates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [rates, setRates] = useState<Rate[]>(initialRates)
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState(0)
  const [currentList, setCurrentList] = useState<ListType>(ListType.Ranking)

  useInterval(async () => {
      let newRates = await getRates()
      setRates(newRates)
      setSecondsSinceUpdate(0)
    },
    50000
  )

  useInterval(() => {
    setSecondsSinceUpdate(secondsSinceUpdate + 1)
  }, 1000)

  const zilToken = tokens.filter(token => token.symbol == 'ZIL')[0]
  const zilRates = rates.filter(rate => rate.token_id == zilToken.id)
  const firstZilRate = zilRates[zilRates.length - 1]
  const latestZilRate = zilRates[0]
  
  const change = ((latestZilRate.value - firstZilRate.value) / firstZilRate.value) * 100
  const changeRounded = Math.round(change * 100) / 100

  const sortTokensByMarketCap = (a: Token, b: Token) => {
    const priorTokenRates = rates.filter(rate => rate.token_id == a.id).sort((x,y) => (x.time < y.time) ? 1 : -1)
      const priorLastRate = priorTokenRates.length > 0 ? priorTokenRates[0].value : 0
      const priorUsdRate = priorLastRate * latestZilRate.value
      const priorMarketCap = a.current_supply * priorUsdRate
  
      const nextTokenRates = rates.filter(rate => rate.token_id == b.id).sort((x,y) => (x.time < y.time) ? 1 : -1)
      const nextLastRate = nextTokenRates.length > 0 ? nextTokenRates[0].value : 0
      const nextUsdRate = nextLastRate * latestZilRate.value
      const nextMarketCap = b.current_supply * nextUsdRate
  
      return (priorMarketCap < nextMarketCap) ? 1 : -1
  }

  const listTokens: Token[] = Object.assign([], tokens)
  const topTokens = tokens.sort(sortTokensByMarketCap).slice(0, 3)
  
  unlistedTokens.sort(sortTokensByMarketCap)

  var displayedTokens = []
  if(currentList == ListType.Gains) {
    displayedTokens = listTokens.sort((a,b) => {
      const priorSortedRates = rates.filter(rate => rate.token_id == a.id).sort((a,b) => (a.time < b.time) ? 1 : -1)
      const priorLastRate = priorSortedRates.length > 0 ? priorSortedRates[0].value : 0
      const priorFirstRate = priorSortedRates.length > 0 ? priorSortedRates[priorSortedRates.length-1].value : 0
      const priorChange = ((priorLastRate - priorFirstRate) / priorFirstRate) * 100

      const nextSortedRates = rates.filter(rate => rate.token_id == b.id).sort((a,b) => (a.time < b.time) ? 1 : -1)
      const nextLastRate = nextSortedRates.length > 0 ? nextSortedRates[0].value : 0
      const nextFirstRate = nextSortedRates.length > 0 ? nextSortedRates[nextSortedRates.length-1].value : 0
      const nextChange = ((nextLastRate - nextFirstRate) / nextFirstRate) * 100

      return (priorChange < nextChange) ? 1 : -1
    })
  } else if(currentList == ListType.Liquidity) {
    displayedTokens = listTokens.sort((a,b) => {
      return (a.current_liquidity < b.current_liquidity) ? 1 : -1
    })
  } else if(currentList == ListType.Unlisted) {
    displayedTokens = unlistedTokens
  } else {
    displayedTokens = listTokens.sort(sortTokensByMarketCap)
  }

  return (
    <>
      <Head>
        <title>Zilliqa ecosystem prices, charts, and market cap | ZilStream</title>
        <meta property="og:title" content="Zilliqa ecosystem prices, charts, and market cap | ZilStream" />
        <meta name="description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
        <meta property="og:description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
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
          <ExchangeStats 
            total_liquidity={tokens.reduce((sum, current) => { return sum + current.current_liquidity}, 0)}
            volume={tokens.reduce((sum, current) => { return sum + current.daily_volume}, 0)}
            total_liquidity_usd={tokens.reduce((sum, current) => { return sum + current.current_liquidity}, 0) * latestZilRate.value}
            volume_usd={tokens.reduce((sum, current) => { return sum + current.daily_volume}, 0) * latestZilRate.value}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {topTokens.map( token => {                
          return (
            <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a>
                <RatesBlock token={token} rates={rates.filter(rate => rate.token_id == token.id)}  zilRate={latestZilRate} />
              </a>
            </Link>
          )
        })}     
      </div>
      <div className="token-order-list">
        <div className="flex items-center" style={{minWidth: '420px'}}>
          <div className="flex-grow flex items-center">
            <button 
              onClick={() => setCurrentList(ListType.Ranking)}
              className={`${currentList == ListType.Ranking ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Ranking</button>
            <button 
              onClick={() => setCurrentList(ListType.Gains)}
              className={`${currentList == ListType.Gains ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Largest gainers</button>
            <button 
              onClick={() => setCurrentList(ListType.Liquidity)}
              className={`${currentList == ListType.Liquidity ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Highest liquidity</button>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => setCurrentList(ListType.Unlisted)}
              className={`${currentList == ListType.Unlisted ? 'list-btn-selected' : 'list-btn text-gray-400 dark:text-gray-500 hover:text-gray-500 hover:dark:text-gray-200'}`}
            >Unlisted</button>
          </div>
        </div>
      </div>
      {currentList == ListType.Unlisted &&
        <div className="bg-gray-400 dark:bg-gray-600 rounded-lg p-4 flex flex-col sm:flex-row mb-6">
          <AlertCircle className="mb-2 sm:mr-3" />
          <div>
            <div className="font-medium">Unlisted tokens, be extra cautious</div>
            <div className="text-sm">Unlisted tokens are not screened or audited by ZilStream. Please verify the legitimacy of these tokens yourself.</div>
          </div>
        </div>
      }
      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-center px-2 sm:px-4 mb-1 text-gray-500 dark:text-gray-400 text-sm">
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
        {displayedTokens.filter(token => token.symbol != 'ZIL').map( token => {                
          return (
            <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
              <a>
                <TokenRow token={token} rates={rates.filter(rate => rate.token_id == token.id)} zilRate={latestZilRate} />
              </a>
            </Link>
          )
        })}
    </div>
    <div className="flex items-center justify-center text-sm text-gray-500 mt-8 py-2">
      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
      <div>Last updated: {secondsSinceUpdate} seconds ago</div>
    </div>
  </>
  )
}

export default Home
