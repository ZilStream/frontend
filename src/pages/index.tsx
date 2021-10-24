import RatesBlock from 'components/ChartBlock'
import LoadingChartBlock from 'components/LoadingChartBlock'
import LoadingTokenRows from 'components/LoadingTokenRows'
import TokenRow from 'components/TokenRow'
import getRates from 'lib/zilstream/getRates'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, ChevronDown, Sliders, Star, Tool, Triangle } from 'react-feather'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenInfo, TokenState } from 'store/types'
import { ListType } from 'types/list.interface'
import { SortType, SortDirection } from 'types/sort.interface'
import { Rate } from 'types/rate.interface'
import { cryptoFormat, currencyFormat } from 'utils/format'
import { useInterval } from 'utils/interval'
import TokenIcon from 'components/TokenIcon'
import TVLChartBlock from 'components/TVLChartBlock'
import VolumeChartBlock from 'components/VolumeChartBlock'

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
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const [displayedTokens, setDisplayedTokens] = useState<TokenInfo[]>([])
  const [currentList, setCurrentList] = useState<ListType>(ListType.Ranking)
  const [currentSort, setCurrentSort] = useState<SortType>(SortType.Default)
  const [currentSortDirection, setCurrentSortDirection] = useState<SortDirection>(SortDirection.Ascending)
  const [zilRates, setZilRates] = useState({firstRate: 0, lastRate: 0, change: 0, changeRounded: 0})

  const tokens = useMemo(() => {
    if(!tokenState.initialized) return []
    return tokenState.tokens.sort(sortTokensByMarketCap)
  }, [tokenState])

  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  
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
      if(newRates === null) {
        setRates([])
      } else {
        setRates(newRates)
      }
      
    },
    30000
  )

  const sortTokensByMarketCap = (a: TokenInfo, b: TokenInfo) => {
    const priorMarketCap = (a.current_supply ?? 0) * ((a.rate ?? 0) * tokenState.zilRate)
    const nextMarketCap = (b.current_supply ?? 0) * ((b.rate ?? 0) * tokenState.zilRate)

    return (priorMarketCap < nextMarketCap) ? 1 : -1
  }

  const aprTokens = tokens.filter(token => token.unvetted === false).sort((a: TokenInfo, b: TokenInfo) => {
    if(!a.apr || !b.apr) return -1
    return a.apr.isLessThan(b.apr) ? 1 : -1
  }).slice(0,3)

  const handleSort = (sort: SortType) => {
    if(sort === currentSort) {
      if(currentSortDirection === SortDirection.Ascending) {
        setCurrentSortDirection(SortDirection.Descending)
      } else {
        setCurrentSortDirection(SortDirection.Ascending)
      }
    } else {
      setCurrentSort(sort)

      if(sort === SortType.Default || sort === SortType.Token) {
        setCurrentSortDirection(SortDirection.Ascending)
      } else {
        setCurrentSortDirection(SortDirection.Descending)
      }
    }
  }

  useEffect(() => {
    if(!tokenState.initialized) return

    var tokensToDisplay = tokens

    if(currentList == ListType.Unvetted) {
      tokensToDisplay = tokensToDisplay.filter(token => token.unvetted === true)
    } else if(currentList == ListType.Favorites) {
      tokensToDisplay = tokensToDisplay.filter(token => token.isFavorited)
    } else if(currentList == ListType.Native) {
      tokensToDisplay = tokensToDisplay.filter(token => token.bridged === false && token.unvetted === false)
    } else if(currentList == ListType.Bridged) {
      tokensToDisplay = tokensToDisplay.filter(token => token.bridged === true)
    } else if(currentList == ListType.APR) {
      tokensToDisplay = tokensToDisplay.filter(token => token.unvetted === false)
    } else {
      tokensToDisplay = tokensToDisplay.filter(token => token.unvetted === false)
    }

    if(currentList === ListType.APR) {
      tokensToDisplay.sort((a: TokenInfo, b: TokenInfo) => {
        if(!a.apr || !b.apr) return -1
        return a.apr.isLessThan(b.apr) ? 1 : -1
      })
    } else if(currentSort === SortType.Default) {
      tokensToDisplay.sort((a: TokenInfo, b: TokenInfo) => {
        const priorMarketCap = (a.current_supply ?? 0) * ((a.rate ?? 0) * tokenState.zilRate)
        const nextMarketCap = (b.current_supply ?? 0) * ((b.rate ?? 0) * tokenState.zilRate)
    
        if(currentSortDirection == SortDirection.Ascending) {
          return (priorMarketCap < nextMarketCap) ? 1 : -1
        }
        return (priorMarketCap > nextMarketCap) ? 1 : -1
      })
    } else if(currentSort === SortType.Token) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.name > b.name) ? 1 : -1
        }
        return (a.name < b.name) ? 1 : -1
      })
    } else if(currentSort === SortType.Price || currentSort === SortType.PriceFiat) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.rate > b.rate) ? 1 : -1
        }
        return (a.rate < b.rate) ? 1 : -1
      })
    } else if(currentSort === SortType.Change) {
      tokensToDisplay.sort((a,b) => {
        const priorRates = rates.filter(rate => rate.token_id == a.id)
        const priorLastRate = priorRates.length > 0 ? priorRates[0].value : 0
        const priorFirstRate = priorRates.length > 0 ? priorRates[priorRates.length-1].value : 0
        const priorChange = ((priorLastRate - priorFirstRate) / priorFirstRate) * 100

        const nextRates = rates.filter(rate => rate.token_id == b.id)
        const nextLastRate = nextRates.length > 0 ? nextRates[0].value : 0
        const nextFirstRate = nextRates.length > 0 ? nextRates[nextRates.length-1].value : 0
        const nextChange = ((nextLastRate - nextFirstRate) / nextFirstRate) * 100

        if(currentSortDirection == SortDirection.Ascending) {
          return (priorChange > nextChange) ? 1 : -1
        }
        return (priorChange < nextChange) ? 1 : -1
      })
    } else if(currentSort === SortType.Volume) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.daily_volume > b.daily_volume) ? 1 : -1
        }
        return (a.daily_volume < b.daily_volume) ? 1 : -1
      })
    } else if(currentSort === SortType.Liquidity) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.current_liquidity < b.current_liquidity) ? 1 : -1
        }
        return (a.current_liquidity < b.current_liquidity) ? 1 : -1
      })
    } else {
      tokensToDisplay.sort((a: TokenInfo, b: TokenInfo) => {
        const priorMarketCap = (a.current_supply ?? 0) * ((a.rate ?? 0) * tokenState.zilRate)
        const nextMarketCap = (b.current_supply ?? 0) * ((b.rate ?? 0) * tokenState.zilRate)
    
        if(currentSortDirection == SortDirection.Ascending) {
          return (priorMarketCap > nextMarketCap) ? 1 : -1
        }
        return (priorMarketCap < nextMarketCap) ? 1 : -1
      })
    }

    setDisplayedTokens(tokensToDisplay)
  }, [currentList, tokenState, currentSort, currentSortDirection])
  
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
              Zilliqa is currently valued at <span className="font-medium">{currencyFormat(selectedCurrency.rate, selectedCurrency.symbol)}, </span>
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
      <div className="scrollable-table-container max-w-full">
        <div className="grid grid-cols-4 gap-4 mt-2" style={{minWidth: 1200}}>
          {tokenState.initialized === false ? (
            <>
              <LoadingChartBlock />
              <LoadingChartBlock />
              <LoadingChartBlock />
              <LoadingChartBlock />
            </>
          ) : (
            <>
              <RatesBlock
                title="ZIL"
                value={currencyFormat(selectedCurrency.rate, selectedCurrency.symbol)}
                subTitle={"MC $1.4B"}
                token={tokens.filter(token => token.symbol == 'ZIL')[0]} 
                rates={rates.filter(rate => rate.token_id == "1")} 
              />

              <Link href="/liquidity">
                <a>
                  <TVLChartBlock />
                </a>
              </Link>

              <Link href="/liquidity">
                <a>
                  <VolumeChartBlock />
                </a>
              </Link>

              <div className="h-44 rounded-lg py-2 px-3 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
                <div className="mb-2">
                  <div className="flex items-center text-lg -mb-1">
                    <div className="flex-grow flex items-center">
                      <span className="font-semibold mr-2">Highest APR</span>
                      <span className="mr-2"></span>
                    </div>
                    <div>
                      {aprTokens.length > 0 &&
                        <>Up to {aprTokens[0].apr?.toNumber().toFixed(0)}%</>
                      }
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">By providing liquidity on ZilSwap</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 text-sm">
                  {aprTokens.map((token, index) => (
                    <div className="flex items-center gap-3">
                      <div>{index+1}.</div>
                      <div className="w-6 h-6">
                        <TokenIcon address={token.address_bech32} />
                      </div>
                      <div className="font-medium flex-grow">{token.name} <span className="font-normal text-gray-500 ml-1">{token.symbol}</span></div>
                      <div>{token.apr?.toNumber()}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="token-order-list">
        <div className="flex items-center" style={{minWidth: '380px'}}>
          <div className="flex-grow flex items-stretch">
            <div className="flex items-center border-r border-gray-800 pr-3 mr-3">
              <button 
                onClick={() => setCurrentList(ListType.Favorites)}
                className={`${currentList == ListType.Favorites ? 'list-btn-selected' : 'flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3'}`}
              ><Star size={12} className="mr-1 text-gray-500 dark:text-gray-400" /> Favorites</button>
            </div>
            <div className="flex items-stretch">
              <button 
                onClick={() => setCurrentList(ListType.Ranking)}
                className={`${currentList == ListType.Ranking ? 'list-btn-selected' : 'list-btn'} mr-1`}
              >Ranking</button>
              <button 
                onClick={() => setCurrentList(ListType.Native)}
                className={`${currentList == ListType.Native ? 'list-btn-selected' : 'list-btn'} mr-1`}
              >Native</button>
              <button 
                onClick={() => setCurrentList(ListType.Bridged)}
                className={`${currentList == ListType.Bridged ? 'list-btn-selected' : 'list-btn'} mr-1`}
              >Bridged</button>
              <button 
                onClick={() => setCurrentList(ListType.APR)}
                className={`${currentList == ListType.APR ? 'list-btn-selected' : 'list-btn'} mr-1 whitespace-nowrap`}
              >Highest APR</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3">
              50 <ChevronDown size={12} className="ml-1 text-gray-500 dark:text-gray-400" />
            </button>
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3">
              <Sliders size={12} className="mr-1 text-gray-500 dark:text-gray-400" /> Filters
            </button>
            <button className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3">
              <Tool size={12} className="mr-1 text-gray-500 dark:text-gray-400" /> Customize
            </button>
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
      <div className="scrollable-table-container max-w-full overflow-x-scroll relative">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '24px', minWidth: 'auto'}} />
            <col style={{width: '42px', minWidth: 'auto'}} />
            <col style={{width: '276px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '100px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
            <col style={{width: '160px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs" style={{height: 33}}>
            <tr className="py-2">
              <th className="text-left pl-4 sm:pl-5 sm:pr-2 py-2"></th>
              <th className="text-left pl-2 sm:pl-3 pr-1 sm:pr-2 py-2">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Default)}>
                  #
                  {currentSort === SortType.Default &&
                    <Triangle className={`ml-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                </button>
              </th>
              <th className="px-2 py-2 text-left sticky left-0 z-10">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Token)}>
                  Token
                  {currentSort === SortType.Token &&
                    <Triangle className={`ml-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                </button>
              </th>
              <th className="px-2 py-2 text-right">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Price)}>
                  {currentSort === SortType.Price &&
                    <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                  ZIL
                </button>
              </th>
              <th className="px-2 py-2 text-right">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.PriceFiat)}>
                  {currentSort === SortType.PriceFiat &&
                    <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                  {selectedCurrency.code}
                </button>
              </th>
              <th className="px-2 py-2 text-right">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Change)}>
                  {currentSort === SortType.Change &&
                    <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                  24h %
                </button>
              </th>
              <th className="px-2 py-2 text-right">
                <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.MarketCap)}>
                  {currentSort === SortType.MarketCap &&
                    <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                  Market Cap</button>
              </th>
              <th className="px-2 py-2 text-right">
                <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Liquidity)}>
                  {currentSort === SortType.Liquidity &&
                    <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                  }
                  Liquidity
                </button>
              </th>
              {currentList === ListType.APR &&
                <th className="px-2 py-2 text-right">
                  APR
                </th>
              }
              {currentList !== ListType.APR &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.Volume)}>
                    {currentSort === SortType.Volume &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Volume (24h)
                  </button>
                </th>
              }
              <th className="px-2 py-2 text-right whitespace-nowrap">Last 24 hours</th>
            </tr>
          </thead>
          <tbody>
            {displayedTokens.filter(token => token.symbol != 'ZIL').map((token, index) => {  
              return (
                <TokenRow 
                  key={token.id} 
                  token={token}
                  rank={index+1}
                  index={index}
                  rates={rates.filter(rate => rate.token_id == token.id)} 
                  isLast={displayedTokens.filter(token => token.symbol != 'ZIL').length === index+1}
                  showAPR={currentList === ListType.APR}
                />
              )
            })}

            {tokenState.initialized === false &&
              <LoadingTokenRows />
            }
          </tbody>
      </table>

      {tokenState.initialized && currentList === ListType.Bridged && displayedTokens.length === 0 &&
        <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-1 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 italic">Bridged tokens from Ethereum will show up here when ZilBridge has launched.</span>
        </div>
      }

      {tokenState.initialized && currentList === ListType.Favorites && displayedTokens.length === 0 &&
        <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg mt-1 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400 italic">Star a token and you'll see it here in your favorites.</span>
        </div>
      }
    </div>
  </>
  )
}

export default Home
