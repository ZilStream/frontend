import RatesBlock from 'components/ChartBlock'
import LoadingChartBlock from 'components/LoadingChartBlock'
import LoadingTokenRows from 'components/LoadingTokenRows'
import TokenRow from 'components/TokenRow'
import getRates from 'lib/zilstream/getRates'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Star, Triangle } from 'react-feather'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, SettingsState, Token, TokenState } from 'store/types'
import { ListType } from 'types/list.interface'
import { SortType, SortDirection } from 'types/sort.interface'
import { Rate } from 'types/rate.interface'
import { compactFormat, currencyFormat } from 'utils/format'
import { useInterval } from 'utils/interval'
import TVLChartBlock from 'components/TVLChartBlock'
import VolumeChartBlock from 'components/VolumeChartBlock'
import Customize from 'components/Customization'
import Filters from 'components/Filters'
import HighestAPRBlock from 'components/HighestAPRBlock'
import SponsorBlock from 'components/SponsorBlock'
import { ZIL_ADDRESS } from 'lib/constants'
import HighestVolumeBlock from 'components/HighestVolumeBlock'

export const getServerSideProps = async () => {
  var initialRates: Rate[] = []

  try {
    initialRates = await getRates()
  } catch(e) {
    initialRates = []
  }  
  
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
  const settingsState = useSelector<RootState, SettingsState>(state => state.settings)
  const [displayedTokens, setDisplayedTokens] = useState<Token[]>([])
  const [currentList, setCurrentList] = useState<ListType>(ListType.Ranking)
  const [currentSort, setCurrentSort] = useState<SortType>(SortType.Default)
  const [currentSortDirection, setCurrentSortDirection] = useState<SortDirection>(SortDirection.Ascending)

  const tokens = useMemo(() => {
    if(!tokenState.initialized) return []
    return tokenState.tokens
  }, [tokenState])

  const marketCap = tokenState.tokens.reduce((sum, current) => {
    return sum + current.market_data.market_cap_zil
  }, 0)

  const volume = tokenState.tokens.reduce((sum, current) => {
    return sum + current.market_data.daily_volume_zil
  }, 0)

  const zilToken = tokens.filter(token => token.symbol == 'ZIL')[0]
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  useInterval(async () => {
    var newRates: Rate[] = []

    try {
      newRates = await getRates()
    } catch(e) {
      newRates = []
    }
      
    setRates(newRates)
  }, 30000)

  const aprTokens = tokens.filter(token => token.reviewed === true || token.address === ZIL_ADDRESS).sort((a: Token, b: Token) => {
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

    if(currentList == ListType.Favorites) {
      tokensToDisplay = tokensToDisplay.filter(token => token.isFavorited)
    } else if(currentList == ListType.DeFi) {
      tokensToDisplay = tokensToDisplay.filter(token => token.tags?.split(',').includes('defi'))
    } else if(currentList == ListType.NFT) {
      tokensToDisplay = tokensToDisplay.filter(token => token.tags?.split(',').includes('nft'))
    }

    if(currentSort === SortType.APR || currentSort === SortType.APY) {
      tokensToDisplay.sort((a: Token, b: Token) => {
        if(!a.apr || !b.apr) return -1
        if(currentSortDirection == SortDirection.Ascending) {
          return a.apr.isGreaterThan(b.apr) ? 1 : -1
        }
        return a.apr.isLessThan(b.apr) ? 1 : -1
      })
    } else if(currentSort === SortType.Default) {
      tokensToDisplay.sort((a: Token, b: Token) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.rank > b.rank) ? 1 : -1
        }
        return (a.rank < b.rank) ? 1 : -1
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
          return (a.market_data.rate_usd > b.market_data.rate_usd) ? 1 : -1
        }
        return (a.market_data.rate_usd < b.market_data.rate_usd) ? 1 : -1
      })
    } else if(currentSort === SortType.ATH) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.ath > b.market_data.ath) ? 1 : -1
        }
        return (a.market_data.ath < b.market_data.ath) ? 1 : -1
      })
    } else if(currentSort === SortType.ATL) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.atl > b.market_data.atl) ? 1 : -1
        }
        return (a.market_data.atl < b.market_data.atl) ? 1 : -1
      })
    } else if(currentSort === SortType.Change24H) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.change_percentage_24h > b.market_data.change_percentage_24h) ? 1 : -1
        }
        return (a.market_data.change_percentage_24h < b.market_data.change_percentage_24h) ? 1 : -1
      })
    } else if(currentSort === SortType.Change7D) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.change_percentage_7d > b.market_data.change_percentage_7d) ? 1 : -1
        }
        return (a.market_data.change_percentage_7d < b.market_data.change_percentage_7d) ? 1 : -1
      })
    } else if(currentSort === SortType.Change24HZIL) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.change_percentage_24h_zil > b.market_data.change_percentage_24h_zil) ? 1 : -1
        }
        return (a.market_data.change_percentage_24h_zil < b.market_data.change_percentage_24h_zil) ? 1 : -1
      })
    } else if(currentSort === SortType.Change7DZIL) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.change_percentage_7d_zil > b.market_data.change_percentage_7d_zil) ? 1 : -1
        }
        return (a.market_data.change_percentage_7d_zil < b.market_data.change_percentage_7d_zil) ? 1 : -1
      })
    } else if(currentSort === SortType.Volume) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.daily_volume_usd > b.market_data.daily_volume_usd) ? 1 : -1
        }
        return (a.market_data.daily_volume_usd < b.market_data.daily_volume_usd) ? 1 : -1
      })
    } else if(currentSort === SortType.Liquidity) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.current_liquidity_usd > b.market_data.current_liquidity_usd) ? 1 : -1
        }
        return (a.market_data.current_liquidity_usd < b.market_data.current_liquidity_usd) ? 1 : -1
      })
    } else if(currentSort === SortType.CircSupply) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.current_supply > b.market_data.current_supply) ? 1 : -1
        }
        return (a.market_data.current_supply < b.market_data.current_supply) ? 1 : -1
      })
    } else if(currentSort === SortType.TotalSupply) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.total_supply > b.market_data.total_supply) ? 1 : -1
        }
        return (a.market_data.total_supply < b.market_data.total_supply) ? 1 : -1
      })
    } else if(currentSort === SortType.MaxSupply) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.max_supply > b.market_data.max_supply) ? 1 : -1
        }
        return (a.market_data.max_supply < b.market_data.max_supply) ? 1 : -1
      })
    } else if(currentSort === SortType.FullyDilutedMarketCap) {
      tokensToDisplay.sort((a,b) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.fully_diluted_valuation_usd < b.market_data.fully_diluted_valuation_usd) ? 1 : -1
        }
        return (a.market_data.fully_diluted_valuation_usd < b.market_data.fully_diluted_valuation_usd) ? 1 : -1
      })
    } else {
      tokensToDisplay.sort((a: Token, b: Token) => {
        if(currentSortDirection == SortDirection.Ascending) {
          return (a.market_data.market_cap_usd > b.market_data.market_cap_usd) ? 1 : -1
        }
        return (a.market_data.market_cap_usd < b.market_data.market_cap_usd) ? 1 : -1
      })
    }

    setDisplayedTokens(tokensToDisplay)
  }, [currentList, tokenState, currentSort, currentSortDirection, settingsState.filters])
  
  return (
    <>
      <Head>
        <title>Zilliqa ecosystem prices, charts, and market cap | ZilStream</title>
        <meta property="og:title" content="Zilliqa ecosystem prices, charts, and market cap | ZilStream" />
        <meta name="description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
        <meta property="og:description" content="Zilliqa ecosystem prices and charts, listed by market capitalization. Free access to current and historic data for gZIL, ZWAP, PORT and many more." />
      </Head>
      <div className="pt-3 pb-2">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1 text-xl">Zilliqa token prices by Market Cap</h1>
            <div className="text-gray-600 dark:text-gray-400">
              The total market cap is <span className="font-semibold">{currencyFormat(marketCap * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>, with <span className="font-semibold">{currencyFormat(volume * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span> in volume over the last 24 hours.
            </div>
            <div className="sr-only">ZilStream is currently tracking {tokens.length} tokens. Popular trends within Zilliqa right now are NFT and DeFi.</div>
          </div>
        </div>
      </div>
      <div className="scrollable-table-container overflow-y-scroll py-1 max-w-full">
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
              {/* <SponsorBlock link="https://arena.zilchill.com/arena/the-leos-civil-war-rAFd-Hivj" /> */}

              <RatesBlock
                title="ZIL"
                value={currencyFormat(selectedCurrency.rate, selectedCurrency.symbol)}
                subTitle={`MC ${compactFormat(zilToken.market_data.current_supply * selectedCurrency.rate, selectedCurrency.symbol)}`}
                token={tokens.filter(token => token.symbol == 'ZIL')[0]} 
                rates={rates.filter(rate => rate.token_id == "1")} 
              />

              <Link href="/exchanges">
                <a>
                  <TVLChartBlock />
                </a>
              </Link>

              <Link href="/exchanges">
                <a>
                  <VolumeChartBlock />
                </a>
              </Link>

              {/* <HighestAPRBlock tokens={aprTokens} /> */}

              <HighestVolumeBlock />
            </>
          )}
        </div>
      </div>
      <div className="token-order-list">
        <div className="flex items-center" style={{minWidth: '380px'}}>
          <div className="flex-grow flex items-stretch">
            <div className="flex items-center border-r border-gray-200 dark:border-gray-800 pr-3 mr-3">
              <button 
                onClick={() => setCurrentList(ListType.Favorites)}
                className={`${currentList == ListType.Favorites ? 
                  'flex items-center bg-primary rounded-lg text-xs font-semibold py-2 px-3 focus:outline-none' : 
                  'flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3 focus:outline-none'}`}
              ><Star size={12} className={`mr-1 ${currentList == ListType.Favorites ? 'text-gray-200' : 'text-gray-500 dark:text-gray-400'}`} /> Favorites</button>
            </div>
            <div className="flex items-stretch">
              <button 
                onClick={() => setCurrentList(ListType.Ranking)}
                className={`${currentList == ListType.Ranking ? 'list-btn-selected' : 'list-btn'} mr-2`}
              >Ranking</button>
              <button 
                onClick={() => setCurrentList(ListType.DeFi)}
                className={`${currentList == ListType.DeFi ? 'list-btn-selected' : 'list-btn'} mr-2`}
              >DeFi</button>
              <button 
                onClick={() => setCurrentList(ListType.NFT)}
                className={`${currentList == ListType.NFT ? 'list-btn-selected' : 'list-btn'} mr-2`}
              >NFT</button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <button className="flex items-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-xs font-semibold py-2 px-3 focus:outline-none">
              50 <ChevronDown size={12} className="ml-1 text-gray-500 dark:text-gray-400" />
            </button> */}
            <Filters />
            <Customize />
          </div>
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll relative">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '24px', minWidth: 'auto'}} />
            <col style={{width: '42px', minWidth: 'auto'}} />
            <col style={{width: '276px', minWidth: 'auto'}} /> 

            {settingsState.columns.priceFiat &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.priceZIL &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.ath &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.atl &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }
            
            {settingsState.columns.change24H &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.change7D &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.change24HZIL &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.change7DZIL &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }
            
            {settingsState.columns.marketCap &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.marketCapDiluted &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.circSupply &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.totalSupply &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.maxSupply &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.liquidity &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.volume &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.apr &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }

            {settingsState.columns.apy &&
              <col style={{width: '100px', minWidth: 'auto'}} />
            }
            
            {settingsState.columns.graph24H &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }

            {settingsState.columns.graph24HZIL &&
              <col style={{width: '160px', minWidth: 'auto'}} />
            }
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
              {settingsState.columns.priceFiat &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.PriceFiat)}>
                    {currentSort === SortType.PriceFiat &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    {selectedCurrency.code}
                  </button>
                </th>
              }

              {settingsState.columns.priceZIL &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Price)}>
                    {currentSort === SortType.Price &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    ZIL
                  </button>
                </th>
              }

              {settingsState.columns.ath &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.ATH)}>
                    {currentSort === SortType.ATH &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    ATH
                  </button>
                </th>
              }

              {settingsState.columns.atl &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.ATL)}>
                    {currentSort === SortType.ATL &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    ATL
                  </button>
                </th>
              }
              
              {settingsState.columns.change24H &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Change24H)}>
                    {currentSort === SortType.Change24H &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    24h %
                  </button>
                </th>
              }

              {settingsState.columns.change7D &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Change7D)}>
                    {currentSort === SortType.Change7D &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    7d %
                  </button>
                </th>
              }

              {settingsState.columns.change24HZIL &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Change24HZIL)}>
                    {currentSort === SortType.Change24HZIL &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    24h % (ZIL)
                  </button>
                </th>
              }

              {settingsState.columns.change7DZIL &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Change7DZIL)}>
                    {currentSort === SortType.Change7DZIL &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    7d % (ZIL)
                  </button>
                </th>
              }
              
              {settingsState.columns.marketCap &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.MarketCap)}>
                    {currentSort === SortType.MarketCap &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Market Cap</button>
                </th>
              }

              {settingsState.columns.marketCapDiluted &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.FullyDilutedMarketCap)}>
                    {currentSort === SortType.FullyDilutedMarketCap &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Fully Diluted Mcap</button>
                </th>
              }

              {settingsState.columns.circSupply &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.CircSupply)}>
                    {currentSort === SortType.CircSupply &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Circ Supply</button>
                </th>
              }

              {settingsState.columns.totalSupply &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.TotalSupply)}>
                    {currentSort === SortType.TotalSupply &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Total Supply</button>
                </th>
              }

              {settingsState.columns.maxSupply &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.MaxSupply)}>
                    {currentSort === SortType.MaxSupply &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Max Supply</button>
                </th>
              }

              {settingsState.columns.liquidity &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center" onClick={() => handleSort(SortType.Liquidity)}>
                    {currentSort === SortType.Liquidity &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Liquidity
                  </button>
                </th>
              }

              {settingsState.columns.volume &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.Volume)}>
                    {currentSort === SortType.Volume &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    Volume (24h)
                  </button>
                </th>
              }

              {settingsState.columns.apr &&
                <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.APR)}>
                    {currentSort === SortType.APR &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    APR
                  </button>
                </th>
              }

              {settingsState.columns.apy &&
                  <th className="px-2 py-2 text-right">
                  <button className="focus:outline-none font-bold inline-flex items-center whitespace-nowrap" onClick={() => handleSort(SortType.APY)}>
                    {currentSort === SortType.APY &&
                      <Triangle className={`mr-1 ${currentSortDirection === SortDirection.Descending ? 'transform rotate-180': ''}`} fill="gray" size={6} />
                    }
                    APY
                  </button>
                </th>
              }
              
              {settingsState.columns.graph24H &&
                <th className="px-2 py-2 text-right whitespace-nowrap">Last 24 hours</th>
              }

              {settingsState.columns.graph24HZIL &&
                <th className="px-2 py-2 text-right whitespace-nowrap">Last 24 hours (ZIL)</th>
              }
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
                  rates={rates.filter(rate => rate.token_id == token.id.toString())} 
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
