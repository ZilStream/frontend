import RatesBlock from 'components/ChartBlock'
import LoadingChartBlock from 'components/LoadingChartBlock'
import LoadingTokenRows from 'components/LoadingTokenRows'
import TokenRow from 'components/TokenRow'
import getRates from 'lib/zilstream/getRates'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AlertCircle } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState, TokenInfo, TokenState } from 'store/types'
import { ListType } from 'types/list.interface'
import { Rate } from 'types/rate.interface'
import { useInterval } from 'utils/interval'

export const getServerSideProps = async () => {
  const initialRates = await getRates()
  
  return {
    props: {
      initialRates,
    },
  }
}

function Home({ initialRates }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [rates, setRates] = useState<Rate[]>(initialRates)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const [displayedTokens, setDisplayedTokens] = useState<TokenInfo[]>([])
  const [currentList, setCurrentList] = useState<ListType>(ListType.Ranking)
  const [zilRates, setZilRates] = useState({firstRate: 0, lastRate: 0, change: 0, changeRounded: 0})

  const tokens = tokenState.tokens
  
  useEffect(() => {
    if(tokens.length === 0) return

    const zilToken = tokens.filter(token => token.symbol == 'ZIL')[0]
    const zilRates = rates.filter(rate => rate.token_id == zilToken.id)
    const firstRate = zilRates[zilRates.length - 1].value
    const lastRate = zilRates[0].value
    const change = ((lastRate - firstRate) / firstRate) * 100

    setZilRates({
      firstRate: firstRate, 
      lastRate: lastRate,
      change: change,
      changeRounded: Math.round(change * 100) / 100
    })
  }, [tokenState.initialized, rates])

  useInterval(async () => {
      let newRates = await getRates()
      setRates(newRates)
    },
    30000
  )

  const sortTokensByMarketCap = (a: TokenInfo, b: TokenInfo) => {
    const priorMarketCap = a.current_supply * (a.rate * tokenState.zilRate)
    const nextMarketCap = b.current_supply * (b.rate * tokenState.zilRate)

    return (priorMarketCap < nextMarketCap) ? 1 : -1
  }

  const topTokens = tokens.sort(sortTokensByMarketCap).slice(0, 3)

  useEffect(() => {
    if(currentList == ListType.Unvetted) {
      let unvettedTokens = tokens.filter(token => token.unvetted === true)
      unvettedTokens.sort(sortTokensByMarketCap)
      setDisplayedTokens(unvettedTokens)
    } else {
      let vettedTokens = tokens.filter(token => token.unvetted === false)
      
      if(currentList == ListType.Volume) {
        vettedTokens.sort((a,b) => {
          return (a.daily_volume < b.daily_volume) ? 1 : -1
        })
      } else if(currentList == ListType.Liquidity) {
        vettedTokens.sort((a,b) => {
          return (a.current_liquidity < b.current_liquidity) ? 1 : -1
        })
      } else {
        vettedTokens.sort(sortTokensByMarketCap)
      }

      setDisplayedTokens(vettedTokens)
    }
  }, [currentList, tokenState.initialized])
  
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
            <h1 className="mb-1">Today's prices in Zilliqa</h1>
            <div className="text-gray-600 dark:text-gray-400">
              Zilliqa is currently valued at <span className="font-medium">${Math.round(zilRates.lastRate * 10000) / 10000}, </span>
              {zilRates.change >= 0 ? (
                <div className="inline">
                  up <span className="text-green-600 dark:text-green-500 font-medium">{zilRates.changeRounded}%</span> from yesterday.
                </div>
              ) : (
                <div className="inline">
                  down <span className="text-red-600 dark:text-red-500 font-medium">{zilRates.changeRounded}%</span> from yesterday.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {tokenState.initialized === false ? (
          <>
            <LoadingChartBlock />
            <LoadingChartBlock />
            <LoadingChartBlock />
          </>
        ) : (
          <>
            {topTokens.map( token => {                
              return (
                <Link key={token.id} href={`/tokens/${token.symbol.toLowerCase()}`}>
                  <a>
                    <RatesBlock token={token} rates={rates.filter(rate => rate.token_id == token.id)}  zilRate={zilRates.lastRate} />
                  </a>
                </Link>
              )
            })}
          </>
        )}
      </div>
      <div className="token-order-list">
        <div className="flex items-center" style={{minWidth: '600px'}}>
          <div className="flex-grow flex items-center">
            <button 
              onClick={() => setCurrentList(ListType.Ranking)}
              className={`${currentList == ListType.Ranking ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Ranking</button>
            <button 
              onClick={() => setCurrentList(ListType.Volume)}
              className={`${currentList == ListType.Volume ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Most volume</button>
            <button 
              onClick={() => setCurrentList(ListType.Liquidity)}
              className={`${currentList == ListType.Liquidity ? 'list-btn-selected' : 'list-btn'} mr-1`}
            >Highest liquidity</button>
            <button 
              onClick={() => setCurrentList(ListType.Unvetted)}
              className={`${currentList == ListType.Unvetted ? 'list-btn-selected' : 'list-btn-disabled'}`}
            >Unvetted</button>
          </div>
        </div>
      </div>
      {currentList == ListType.Unvetted &&
        <div className="bg-gray-400 dark:bg-gray-600 rounded-lg p-4 flex flex-col sm:flex-row mb-6">
          <AlertCircle className="mb-2 sm:mr-3" />
          <div>
            <div className="font-medium">Unvetted tokens, be extra cautious</div>
            <div className="text-sm">Unvetted tokens are not screened or audited by ZilStream. Please verify the legitimacy of these tokens yourself.</div>
          </div>
        </div>
      }
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '54px', minWidth: 'auto'}} />
            <col style={{width: '276px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr className="py-2">
              <th className="text-left pl-5 pr-2 py-2">#</th>
              <th className="px-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-right">ZIL</th>
              <th className="px-2 py-2 text-right">USD</th>
              <th className="px-2 py-2 text-right">24h %</th>
              <th className="px-2 py-2 text-right">Market Cap</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">Volume (24h)</th>
              <th className="px-2 py-2 text-right">Last 24 hours</th>
            </tr>
          </thead>
          <tbody>
            {displayedTokens.filter(token => token.symbol != 'ZIL').map((token, index) => {  
              return (
                <TokenRow 
                  key={token.id} 
                  token={token} 
                  rank={index+1} 
                  rates={rates.filter(rate => rate.token_id == token.id)} 
                  zilRate={zilRates.lastRate} 
                  isLast={displayedTokens.filter(token => token.symbol != 'ZIL').length === index+1}
                />
              )
            })}

            {tokenState.initialized === false &&
              <LoadingTokenRows />
            }
          </tbody>
      </table>
    </div>
  </>
  )
}

export default Home
