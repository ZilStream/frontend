import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { currencyFormat, numberFormat, cryptoFormat } from 'utils/format'
import { Link as WebLink, FileText, Box, AlertCircle, MessageCircle, Info, ExternalLink, Copy } from 'react-feather'
import CopyableAddress from 'components/CopyableAddress'
import Supply from 'components/Supply'
import Head from 'next/head'
import getToken from 'lib/zilstream/getToken'
import TokenIcon from 'components/TokenIcon'
import Score from 'components/Score'
import { ResolutionString } from '../../../public/charting_library/charting_library'
import { useTheme } from 'next-themes'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, Reward, TokenState } from 'store/types'
import dayjs from 'dayjs'
import Link from 'next/link'
import Tippy from '@tippyjs/react'
import { Tab } from '@headlessui/react'
import { classNames } from 'utils/classNames'
import { getTokenAPR } from 'utils/apr'
import InlineChange from 'components/InlineChange'
import ChartContainer from 'components/ChartContainer'
import PriceDayRange from 'components/PriceDayRange'
import { shortenAddress } from 'utils/addressShortener'
import TVLChartContainer from 'components/TVLChartContainer'
import MemberWrapper from 'components/MemberWrapper'
import TokenHolders from 'components/TokenHolders'
import TokenLiquidity from 'components/TokenLiquidity'
import getTokenPairs from 'lib/zilstream/getTokenPairs'
import { Pair } from 'types/pair.interface'
import { ZIL_ADDRESS } from 'lib/constants'

const TVChartContainer = dynamic(
  () => import('components/TVChartContainer'),
  { ssr: false }
)

export const getServerSideProps = async (context: GetServerSidePropsContext) => {  
  const { symbol } = context.query

  const token = await getToken(symbol as string).catch(error => {
    return
  })
  if(!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      token,
    },
  }
}

function TokenDetail({ token }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const {theme, setTheme, resolvedTheme} = useTheme()
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const [pairs, setPairs] = useState<Pair[]>([])
  const [totalVolume, setTotalVolume] = useState<number>(0)

  const {
    athChangePercentage,
    atlChangePercentage
  } = React.useMemo(() => {
    return {
      athChangePercentage: -((token.market_data.ath / token.market_data.rate) -1) * 100,
      atlChangePercentage: ((token.market_data.rate / token.market_data.atl) - 1) * 100
    }
  }, [token, tokenState.tokens])

  useEffect(() => {
    const fetchPairs = async () => {
      let newPairs = await getTokenPairs(token.symbol)

      let volume = newPairs.reduce((sum, pair) => {
        if(pair.volume && pair.volume.volume_24h_quote > 0) {
          const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
          if(quoteToken && quoteToken.isZil) {
            return sum + pair.volume.volume_24h_quote
          } else {
            return sum + (pair.volume.volume_24h_quote * (quoteToken?.market_data.rate ?? 0))
          }
        }
        return sum
      }, 0)
      setTotalVolume(volume)

      newPairs.sort((a,b) => {
        const aQuoteToken = tokenState.tokens.filter(token => token.address_bech32 === a.quote_address)?.[0]
        var avolume = a.volume?.volume_24h_quote ?? 0
        if(aQuoteToken && !aQuoteToken.isZil) {
          avolume = (a.volume?.volume_24h_quote ?? 0) * aQuoteToken.market_data.rate
        }

        const bQuoteToken = tokenState.tokens.filter(token => token.address_bech32 === b.quote_address)?.[0]
        var bvolume = b.volume?.volume_24h_quote ?? 0
        if(bQuoteToken && !bQuoteToken.isZil) {
          bvolume = (b.volume?.volume_24h_quote ?? 0) * bQuoteToken.market_data.rate
        }

        return avolume > bvolume ? -1 : 1
      })
      setPairs(newPairs)
    }
    fetchPairs()
  }, [tokenState])

  return (
    <>
      <Head>
        <title>{token.symbol} price and info | ZilStream</title>
        <meta property="og:title" content={`${token.symbol} price and info | ZilStream`} />
        <meta name="description" content={`Get the latest ${token.symbol} price, market capitalization, volume, supply in circulation and more.`} />
        <meta property="og:description" content={`Get the latest ${token.symbol} price, market capitalization, volume, supply in circulation and more.`} />

        <script type="text/javascript" src="/datafeeds/udf/dist/polyfills.js"></script>
		    <script type="text/javascript" src="/datafeeds/udf/dist/bundle.js"></script>
      </Head>
      {!token.listed &&
        <div className="bg-gray-400 dark:bg-gray-600 rounded-lg p-4 flex flex-col sm:flex-row">
          <AlertCircle className="mb-2 sm:mr-3" />
          <div>
            <div className="font-medium">This token is unlisted, be extra cautious</div>
            <div className="text-sm">{token.name} is not screened or audited by ZilStream. Please verify the legitimacy of this token yourself.</div>
          </div>
        </div>
      }
      <div className="w-full flex flex-col sm:flex-row items-start gap-6 mt-8 mb-6">
        <div className="w-96 flex-shrink-0 max-w-full">
          <div className="flex-grow flex items-center">
            <div className="flex-shrink-0 flex items-center justify-center bg-gray-200 dark:bg-gray-800 w-12 sm:w-16 h-12 sm:h-16 p-2 rounded-lg mr-3 mb-2 sm:mb-0">
              <TokenIcon url={token.icon} />
            </div>
            <div>
              <h2 className="text-left">{token.name}</h2>
              <div className="flex items-center">
                <span className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg sm:mr-3 mb-1 sm:mb-0 font-medium">{token.symbol}</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:block text-gray-800 dark:text-gray-200 mt-2 text-sm">
            <Score value={token.viewblock_score} />

            {token.website &&
              <a href={token.website} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <WebLink size={12} className="mr-1" />
                Website 
              </a>
            }
            
            {token.whitepaper &&
              <a href={token.whitepaper} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <FileText size={12} className="mr-1" />
                <span>Whitepaper</span>
              </a>
            }

            {token.telegram &&
              <a href={token.telegram} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
                <MessageCircle size={12} className="mr-1" />
                <span>Telegram</span>
              </a>
            }
            
            <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} target="_blank" className="inline-flex items-center mr-2 mb-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <Box size={12} className="mr-1" />
              ViewBlock 
            </a>

            <a href={`https://zilswap.io/swap?tokenIn=zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz&tokenOut=${token.address_bech32}`} target="_blank" className="inline-flex items-center mr-2 mb-2 justify-center sm:justify-start bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded sm:mr-2">
              <span className="w-3 h-3 mr-1"><TokenIcon address="zil1p5suryq6q647usxczale29cu3336hhp376c627" /></span>
              Swap 
            </a>
            
            <div>
              <CopyableAddress address={token.address_bech32} showCopy={true} />
            </div>
          </div>
        </div>

        <div className="w-full flex-grow flex flex-col">
            
          <div className="font-medium pb-3 mb-3 sm:border-b border-gray-300 dark:border-gray-800">
            <div className="flex sm:flex-col">
              <div className="flex-grow font-bold text-xl sm:text-2xl">{cryptoFormat(token.market_data.rate)} ZIL</div>
              <div className="text-gray-500 dark:text-gray-400 text-lg flex items-center">
                <span className="font-medium">{currencyFormat(token.market_data.rate * selectedCurrency.rate, selectedCurrency.symbol)}</span>
                <span className="text-base ml-1"><InlineChange num={token.market_data.change_percentage_24h} bold /></span>
              </div>
            </div>
            <div className="my-3">
              <PriceDayRange price={token.market_data.rate} low={token.market_data.low_24h} high={token.market_data.high_24h} />
            </div>
          </div>

          <div className="sm:hidden -mt-2 mb-2 text-sm">
            <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-gray-300 dark:border-gray-800">
              {token.website &&
                <a href={token.website} target="_blank" className="bg-gray-200 dark:bg-gray-800 rounded-lg py-2 px-2 flex items-center justify-center"><WebLink size={14} className="mr-1" /> Website</a>
              }
              
              {token.telegram &&
                <a href={token.telegram} target="_blank" className="bg-gray-200 dark:bg-gray-800 rounded-lg py-2 px-2 flex items-center justify-center"><MessageCircle size={14} className="mr-1" /> Telegram</a>
              }
              
              <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} target="_blank" className="bg-gray-200 dark:bg-gray-800 rounded-lg py-2 px-2 flex items-center justify-center"><Box size={14} className="mr-1" /> ViewBlock</a>
            </div>
            
            <div className="flex items-center py-3 border-b border-gray-300 dark:border-gray-800">
              <div className="flex-grow">Contract</div>
              <button 
                className="flex items-center gap-2 font-semibold"
                onClick={() => {
                  navigator.clipboard.writeText(token.address_bech32)
                }}
              >
                {shortenAddress(token.address_bech32, 10)}
                <Copy size={14} />
              </button>
            </div>

            <div className="mt-6 w-full text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2">{token.name} Stats</div>
            <div className="flex items-center py-3 border-t border-b border-gray-300 dark:border-gray-800">
              <div className="flex-grow">Market Cap</div>
              <div className="flex items-center gap-2 font-semibold">
                {currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol)}
              </div>
            </div>

            <div className="flex items-center py-3 border-b border-gray-300 dark:border-gray-800">
              <div className="flex-grow">Volume <span className="px-1 py-1 ml-1 text-xs font-medium bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">24h</span></div>
              <div className="flex items-center gap-2 font-semibold">
                {currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol)}
              </div>
            </div>
          </div>
        

          <div className="hidden py-2 sm:grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
            <div className="py-2 border-r border-gray-300 dark:border-gray-800">
              <div className="text-gray-700 dark:text-gray-400">Market Cap</div>
              <div className="font-medium">{currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.market_cap_zil)} ZIL</span>
            </div>
            <div className="py-2 border-r-0 md:border-r border-gray-300 dark:border-gray-800">
              <div className="text-gray-700 dark:text-gray-400 ">Volume (24h)</div>
              <div className="font-medium">{currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.daily_volume_zil)} ZIL</span>
            </div>
            <div className="py-2 border-r border-gray-300 dark:border-gray-800">
              <div className="text-gray-700 dark:text-gray-400 ">Liquidity</div>
              <div className="flex-grow font-medium">{currencyFormat(token.market_data.current_liquidity_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
              <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.current_liquidity_zil)} ZIL</span>
              
              <div className="text-gray-700 dark:text-gray-400 mt-5">Rewards</div>
              {token.rewards.filter((reward: any) => reward.exchange_id === 1).length > 0 &&
                <>
                  <div className="">ZilSwap APR: <span className="font-semibold">
                    {token.rewards.filter((reward: any) => reward.exchange_id === 1).reduce((sum: number, current: any) => sum + current.current_apr, 0).toFixed(2)}%
                  </span></div>
                  <div>
                    {token.rewards.filter((reward: any) => reward.exchange_id === 1).map((reward: Reward) => {
                      const paymentDayDetail = reward.payment_day !== null ? (
                        <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-md ">
                          Distributed on <span className="font-semibold">{dayjs().day(reward.payment_day).format('dddd')}</span>
                        </div>
                      ) : (<></>)

                      const period = reward.frequency === 604800 ? 'week' : `${reward.frequency/86400} days`
                      return (
                        <div key={reward.reward_token_address} className="flex items-center whitespace-nowrap">
                          <div className="w-4 h-4 flex-shrink-0 mr-2"><TokenIcon address={reward.reward_token_address} /></div>
                          <span className="mr-1">{cryptoFormat(reward.amount)}</span>
                          <span className="font-semibold mr-1">{reward.reward_token_symbol}</span>
                          <span>/ {period}</span>
                          {reward.payment_day !== null &&
                            <Tippy content={paymentDayDetail}>
                              <button className="ml-2 focus:outline-none">
                                <Info size={14} className="text-gray-500" />
                              </button>
                            </Tippy>
                          }
                        </div>
                      )
                    })}
                  </div>
                </>
              }

              {token.rewards.filter((reward: any) => reward.exchange_id === 2).length > 0 &&
                <>
                  <div className="mt-2">XCAD DEX APR: <span className="font-semibold">
                    {token.rewards.filter((reward: any) => reward.exchange_id === 2).reduce((sum: number, current: any) => sum + current.current_apr, 0)}%
                  </span></div>
                  <div>
                    {token.rewards.filter((reward: any) => reward.exchange_id === 2).map((reward: Reward) => {
                      const paymentDayDetail = reward.payment_day !== null ? (
                        <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-md ">
                          Distributed on <span className="font-semibold">{dayjs().day(reward.payment_day).format('dddd')}</span>
                        </div>
                      ) : (<></>)

                      var period = reward.frequency === 604800 ? 'week' : `${reward.frequency/86400} days`
                      if(reward.frequency === 86400) {
                        period = 'day'
                      }
                      return (
                        <div key={reward.reward_token_address} className="flex items-center whitespace-nowrap">
                          <div className="w-4 h-4 flex-shrink-0 mr-2"><TokenIcon address={reward.reward_token_address} /></div>
                          <span className="mr-1">{cryptoFormat(reward.amount)}</span>
                          <span className="font-semibold mr-1">{reward.reward_token_symbol}</span>
                          <span>/ {period}</span>
                          {reward.payment_day !== null &&
                            <Tippy content={paymentDayDetail}>
                              <button className="ml-2 focus:outline-none">
                                <Info size={14} className="text-gray-500" />
                              </button>
                            </Tippy>
                          }
                        </div>
                      )
                    })}
                  </div>
                </>
              }
            </div>
            <div className="py-2">
              <div className="text-gray-700 dark:text-gray-400 text-sm">Circulating Supply</div>
              <Supply token={token} />

              {(token.symbol === 'ZILLEX' || token.symbol === 'UNIDEX-V2' || token.symbol === 'NFTDEX') &&
                <>
                  <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Compound Token</div>
                  <div className="text-sm">Compound tokens consist of other ZRC-2 tokens, more information on the <a href="https://zilall.com/" className="hover:underline">ZILALL website</a>.</div>
                </>
              }

              {dayjs(token.last_vote_start).isBefore(dayjs()) && dayjs(token.last_vote_end).isAfter(dayjs()) &&
                <>
                  <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Governance</div>
                  <Link href={`/vote/${token.symbol.toLowerCase()}/${token.last_vote_hash}`}>
                    <a>
                      <div className="font-semibold text-primary">Vote now</div>
                    </a>
                  </Link>
                </>
              }
            </div>
          </div>
          
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start">
        <div className="flex-grow">
          <Tab.Group>
            <Tab.List className="w-full sm:w-auto inline-flex p-1 space-x-1 bg-blue-900/20 rounded-xl bg-gray-200 dark:bg-gray-800 mb-3">
              <Tab className={({selected}) => classNames(
                'w-full py-1 px-4 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none',
                selected
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-gray-600'
              )}>Chart</Tab>
              <Tab className={({selected}) => classNames(
                'w-full py-1 px-4 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none',
                selected
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-gray-600'
              )}>TradingView</Tab>
              <Tab className={({selected}) => classNames(
                'w-full py-1 px-4 text-sm leading-5 font-medium rounded-lg',
                'focus:outline-none',
                selected
                  ? 'bg-white dark:bg-gray-700 shadow'
                  : 'hover:bg-white/[0.12] hover:text-gray-600'
              )}>Liquidity</Tab>
            </Tab.List>
            <Tab.Panels>
              <Tab.Panel>
                <ChartContainer token={token} />
              </Tab.Panel>
              <Tab.Panel>
                <TVChartContainer 
                  symbol={`${token.symbol}/ZIL`} 
                  interval={'240' as ResolutionString} 
                  autosize={true} 
                  fullscreen={false} 
                  theme={resolvedTheme}
                />
              </Tab.Panel>
              <Tab.Panel>
                <MemberWrapper>
                  <TVLChartContainer token={token} />
                </MemberWrapper>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>

          <div className="mt-8">
            <h2 className="text-lg text-bold">{token.symbol} Markets</h2>
            <div className="scrollable-table-container max-w-full overflow-x-scroll">
              <table className="zilstream-table table-fixed border-collapse">
                <colgroup>
                  <col style={{width: '24px', minWidth: 'auto'}} />
                  <col style={{width: '200px', minWidth: 'auto'}} />
                  <col style={{width: '160px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                  <col style={{width: '140px', minWidth: 'auto'}} />
                </colgroup>
                <thead className="text-gray-500 dark:text-gray-400 text-xs">
                  <tr>
                    <th className="pl-5 pr-2 py-2 text-left">#</th>
                    <th className="px-2 py-2 text-left">Exchange</th>
                    <th className="px-2 py-2 text-left">Pair</th>
                    <th className="px-2 py-2 text-right">Price</th>
                    <th className="px-2 py-2 text-right">Liquidity</th>
                    <th className="px-2 py-2 text-right">Volume (24h)</th>
                    <th className="px-2 py-2 text-right">Volume %</th>
                  </tr>
                </thead>
                <tbody>
                  {pairs.map((pair: Pair, index: number) => {
                    const baseToken = tokenState.tokens.filter(token => token.address_bech32 === pair.base_address)?.[0]
                    const quoteToken = tokenState.tokens.filter(token => token.address_bech32 === pair.quote_address)?.[0]
      
                    var liquidity = (pair.reserve?.quote_reserve ?? 0) * 2
                    var volume = (pair.volume?.volume_24h_quote ?? 0)
                    if(quoteToken && !quoteToken.isZil) {
                      liquidity = (pair.reserve?.quote_reserve ?? 0) * quoteToken.market_data.rate * 2
                      volume = (pair.volume?.volume_24h_quote ?? 0) * quoteToken.market_data.rate
                    }
                    
                    let price = pair.quote?.price ?? 0
                    var zilRate = price

                    if(pair.quote_address !== ZIL_ADDRESS && price > 0) {
                      if(pair.quote_address === token.address_bech32) {
                        zilRate = (1 / price) * (baseToken?.market_data.rate ?? 0)
                      } else {
                        zilRate = price * (quoteToken?.market_data.rate ?? 0)
                      }
                    }

                    return (
                      <tr key={pair.id} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap">
                        <td className={`pl-5 pr-2 py-2 font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === pairs.length-1 ? 'rounded-bl-lg' : ''}`}>
                          <div>{index+1}</div>
                        </td>
                        <td className="px-2 py-2 text-left font-medium">
                          <Link href={`/exchanges/${pair.exchange?.slug}`}>
                            <a className="flex items-center">
                              <div className="w-5 h-5 flex-shrink-0 flex-grow-0 mr-3">
                                <TokenIcon url={pair.exchange?.icon} />
                              </div>
                              <span className="">{pair.exchange?.name}</span>
                            </a>
                          </Link>
                        </td>
                        <td className="px-2 py-2 text-left font-medium">
                          {pair.pair}
                        </td>
                        <td className="px-2 py-2 font-normal text-right">
                          <div>{cryptoFormat(zilRate)} ZIL</div>
                          <div className="text-gray-500 dark:text-gray-400">{currencyFormat(zilRate * selectedCurrency.rate, selectedCurrency.symbol)}</div>
                        </td>
                        <td className="px-2 py-2 font-normal text-right">
                          {currencyFormat((liquidity ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}
                        </td>
                        <td className="px-2 py-2 font-normal text-right">
                          {currencyFormat((volume ?? 0) * selectedCurrency.rate, selectedCurrency.symbol)}
                        </td>
                        <td className={`pl-2 pr-3 py-2 text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === pairs.length-1 ? 'rounded-br-lg' : ''}`}>
                          {numberFormat((volume / totalVolume) * 100)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
            
          <div className="mt-8">
            <Tab.Group>
              <Tab.List className="relative w-full inline-flex gap-2 mb-5 border-b dark:border-gray-700">
                <Tab className={({selected}) => classNames(
                  'focus:outline-none py-2 px-3',
                  selected
                    ? 'font-bold text-primary border-b-2 border-primary'
                    : 'font-medium hover:bg-white/[0.12] hover:text-gray-600'
                )} style={{marginBottom: -1}}>Info</Tab>
                <Tab className={({selected}) => classNames(
                  'font-medium focus:outline-none py-2 px-3',
                  selected
                    ? 'font-bold text-primary border-b-2 border-primary'
                    : 'font-medium hover:bg-white/[0.12] hover:text-gray-600'
                )} style={{marginBottom: -1}}>Holders</Tab>
                <Tab className={({selected}) => classNames(
                  'font-medium focus:outline-none py-2 px-3',
                  selected
                    ? 'font-bold text-primary border-b-2 border-primary'
                    : 'font-medium hover:bg-white/[0.12] hover:text-gray-600'
                )} style={{marginBottom: -1}}>Liquidity Providers</Tab>  
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel>
                  <div className="">
                    <h2 className="text-xl text-gray-700 dark:text-gray-200">{token.name} Price and Market Data</h2>
                    <p className="text-gray-700 dark:text-gray-200">{token.name} price today is {currencyFormat(token.market_data.rate * selectedCurrency.rate, selectedCurrency.symbol)} with a 24-hour trading volume of {currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol)}. {token.name} is {token.market_data.change_percentage_24h >= 0 ? 'up' : 'down'} <InlineChange num={token.market_data.change_percentage_24h} /> in the last 24 hours. With a live market cap of {currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol)}. It has a circulating supply of {numberFormat(token.market_data.current_supply, 0)} {token.symbol} and a max. supply of {numberFormat(token.market_data.max_supply, 0)} {token.symbol}.</p>
                  </div>
                </Tab.Panel>
                <Tab.Panel>
                  <MemberWrapper>
                    <TokenHolders token={token} />
                  </MemberWrapper>
                </Tab.Panel>
                <Tab.Panel>
                  <MemberWrapper>
                    <TokenLiquidity token={token} />
                  </MemberWrapper>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        <div className="flex-grow-0 flex-shrink-0 w-full md:w-96 md:ml-6 mt-6 md:mt-0">
          <div className="bg-blue-900 bg-opacity-5 dark:bg-gray-800 py-4 px-5 rounded-lg">
            <div className="text-lg font-bold mb-2">{token.symbol} Market Stats</div>
            <table className="w-full text-sm table-auto">
              <caption className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2 border-b border-gray-200 dark:border-gray-700">{token.name} Price</caption>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Price</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.rate * selectedCurrency.rate, selectedCurrency.symbol)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.rate)} ZIL</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Price Change <span className="px-1 py-1 ml-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">24h</span></th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{cryptoFormat(token.market_data.change_24h)} ZIL</span>
                    <InlineChange num={token.market_data.change_percentage_24h} bold />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Volume <span className="px-1 py-1 ml-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">24h</span></th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.daily_volume_zil)} ZIL</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Volume / Market Cap</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{numberFormat(token.market_data.daily_volume / token.market_data.market_cap)}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-left font-normal py-3">Liquidity / Market Cap</th>
                  <td className="flex flex-col items-end py-3">
                  <span className="font-bold">{numberFormat(token.market_data.current_liquidity / token.market_data.market_cap)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-sm table-auto mt-2">
              <caption className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2 border-b border-gray-200 dark:border-gray-700">{token.name} Market Cap</caption>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Market Cap</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.market_cap_zil)} ZIL</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-left font-normal py-3">Fully Diluted Market Cap</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.fully_diluted_valuation_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.fully_diluted_valuation_zil)} ZIL</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-sm table-auto mt-2">
              <caption className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2 border-b border-gray-200 dark:border-gray-700">{token.name} Liquidity</caption>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Liquidity</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.current_liquidity_zil * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>
                    <div className="text-xs text-gray-500 text-right"><span className="font-semibold">{cryptoFormat(token.market_data.zil_reserve)}</span> ZIL / <span className="font-semibold">{cryptoFormat(token.market_data.token_reserve)}</span> {token.symbol}</div>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Liquidity Providers</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{numberFormat(token.market_data.liquidity_providers, 0)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-sm table-auto mt-2">
              <caption className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2 border-b border-gray-200 dark:border-gray-700">{token.name} Price History</caption>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Price Change <span className="px-1 py-1 ml-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">7d</span></th>
                  <td className="flex flex-col items-end py-3">
                    <InlineChange num={token.market_data.change_percentage_7d} bold />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Price Change <span className="px-1 py-1 ml-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded">30d</span></th>
                  <td className="flex flex-col items-end py-3">
                    <InlineChange num={token.market_data.change_percentage_30d} bold />
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">All Time High</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.ath * selectedCurrency.rate, selectedCurrency.symbol)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.ath)} ZIL</span>
                    <InlineChange num={athChangePercentage} bold />
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-left font-normal py-3">All Time Low</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{currencyFormat(token.market_data.atl * selectedCurrency.rate, selectedCurrency.symbol)}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{cryptoFormat(token.market_data.atl)} ZIL</span>
                    <InlineChange num={atlChangePercentage} bold />
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="w-full text-sm table-auto mt-2">
              <caption className="text-left text-gray-500 dark:text-gray-400 text-xs font-medium py-2 border-b border-gray-200 dark:border-gray-700">{token.name} Supply</caption>
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Circulating Supply</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{numberFormat(token.market_data.current_supply, 0)}</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th scope="row" className="text-left font-normal py-3">Total Supply</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{numberFormat(token.market_data.total_supply, 0)}</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="text-left font-normal py-3">Max Supply</th>
                  <td className="flex flex-col items-end py-3">
                    <span className="font-bold">{numberFormat(token.market_data.max_supply, 0)}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default TokenDetail
