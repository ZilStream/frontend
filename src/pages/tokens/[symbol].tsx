import React from 'react'
import dynamic from 'next/dynamic'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { currencyFormat, numberFormat, cryptoFormat } from 'utils/format'
import { Link as WebLink, FileText, Box, ExternalLink, AlertCircle, MessageCircle, Info } from 'react-feather'
import CopyableAddress from 'components/CopyableAddress'
import Supply from 'components/Supply'
import Head from 'next/head'
import getToken from 'lib/zilstream/getToken'
import TokenIcon from 'components/TokenIcon'
import Score from 'components/Score'
import { Reward } from 'types/token.interface'
import { ResolutionString } from '../../../public/charting_library/charting_library'
import { useTheme } from 'next-themes'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenInfo, TokenState } from 'store/types'
import { toBigNumber } from 'utils/useMoneyFormatter'
import BigNumber from 'bignumber.js'
import { bnOrZero } from 'utils/strings'
import dayjs from 'dayjs'
import Link from 'next/link'
import GzilCountdown from 'components/GzilCountdown'
import Tippy from '@tippyjs/react'

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

  const {
    apr
  } = React.useMemo(() => {
    const rewards: Reward[] = token.rewards

    var totalAPR = new BigNumber(0)
    rewards.forEach(reward => {
      const rewardTokens = tokenState.tokens.filter(token => token.address_bech32 == reward.reward_token_address)
      if(rewardTokens.length > 0) {
        const rewardToken = rewardTokens[0]
        const rewardsValue = toBigNumber(reward.amount).times(rewardToken.rate).times(tokenState.zilRate)
        const liquidity = toBigNumber(reward.adjusted_total_contributed_share).times(token.market_data.current_liquidity)
        const roiPerEpoch = rewardsValue.dividedBy(liquidity)
        const apr = bnOrZero(roiPerEpoch.times(52).shiftedBy(2).decimalPlaces(1))
        totalAPR = totalAPR.plus(apr)
      }
    })

    return {
      apr: totalAPR
    }
  }, [token, tokenState.tokens])

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
            <div className="font-medium">This token is unvetted, be extra cautious</div>
            <div className="text-sm">{token.name} is not screened or audited by ZilStream. Please verify the legitimacy of this token yourself.</div>
          </div>
        </div>
      }
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        <div className="flex-grow flex flex-col sm:flex-row items-center mb-1 pt-6 sm:pt-8 pb-2">
          <div className="flex-shrink-0 flex items-center justify-center bg-gray-300 dark:bg-gray-800 w-12 sm:w-16 h-12 sm:h-16 p-2 rounded-lg mr-0 sm:mr-3 mb-2 sm:mb-0">
            <TokenIcon url={token.icon} />
          </div>
          <div>
            <h2 className="text-center sm:text-left">{token.name}</h2>
            <div className="flex flex-col sm:flex-row items-center">
              <span className="text-gray-500 dark:text-gray-300 text-sm sm:text-lg sm:mr-3 mb-1 sm:mb-0 font-medium">${token.symbol}</span>
              <CopyableAddress address={token.address_bech32} showCopy={true} />
            </div>
          </div>
        </div>
        <div className="text-center md:text-right font-medium flex flex-col md:flex-row items-center md:block mb-2 md:mb-0">
          <div className="flex-grow font-bold text-2xl">{cryptoFormat(token.rate)} ZIL</div>
          <div className="text-gray-500 flex items-center justify-end">
            {currencyFormat(token.rate * selectedCurrency.rate, selectedCurrency.symbol)}
            <div className="bg-gray-300 dark:bg-gray-800 text-sm rounded px-2 py-1 ml-2">
              <div className={`font-medium ${token.market_data.change_24h >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_24h)}%
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-stretch sm:flex-row sm:items-center text-gray-800 dark:text-gray-400 mb-2">
        <div className="flex items-center justify-center mt-2 sm:mt-0">
          <Score value={token.viewblock_score} />
        </div>
        <div className="flex-grow gap-2 flex items-center justify-center sm:justify-start text-xs sm:text-sm mt-2 sm:mt-0">
          {token.website &&
            <a href={token.website} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <WebLink size={12} className="mr-1" />
              Website 
            </a>
          }
          
          {token.whitepaper &&
            <a href={token.whitepaper} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <FileText size={12} className="mr-1" />
              <span>Whitepaper</span>
            </a>
          }

          {token.telegram &&
            <a href={token.telegram} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
              <MessageCircle size={12} className="mr-1" />
              <span>Telegram</span>
            </a>
          }
          
          <a href={`https://viewblock.io/zilliqa/address/${token.address_bech32}`} target="_blank" className="flex items-center bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
            <Box size={12} className="mr-1" />
            ViewBlock 
          </a>

          <a href={`https://zilswap.io/swap?tokenIn=zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz&tokenOut=${token.address_bech32}`} target="_blank" className="flex items-center justify-center sm:justify-start bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded sm:mr-2">
            <span className="w-3 h-3 mr-1"><TokenIcon address="zil1p5suryq6q647usxczale29cu3336hhp376c627" /></span>
            Swap 
          </a>
        </div>

        <div className="flex items-center justify-center sm:justify-end text-xs sm:text-sm">
          {token.market_data.change_percentage_7d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium">
              <div className="mr-2 text-gray-500">7D</div>
              <div className={`${token.market_data.change_percentage_7d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_7d)}%
              </div>
            </div>
          }

          {token.market_data.change_percentage_14d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium ml-2">
              <div className="mr-2 text-gray-500">14D</div>
              <div className={`${token.market_data.change_percentage_14d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_14d)}%
              </div>
            </div>
          }

          {token.market_data.change_percentage_30d !== 0 &&
            <div className="flex items-center bg-gray-300 dark:bg-gray-800 px-2 py-1 rounded font-medium ml-2">
              <div className="mr-2 text-gray-500">30D</div>
              <div className={`${token.market_data.change_percentage_30d >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                {numberFormat(token.market_data.change_percentage_30d)}%
              </div>
            </div>
          }
        </div>
      </div>
      <div className="py-2 -mx-4 mb-6 grid grid-cols-2 md:grid-cols-4">
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Market Cap</div>
          <div className="font-medium">{currencyFormat(token.market_data.market_cap_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
          
          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Fully Diluted Market Cap</div>
          <div className="font-medium">{currencyFormat(token.market_data.fully_diluted_valuation_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
        </div>
        <div className="px-4 py-2 border-r-0 md:border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Volume (24h)</div>
          <div className="font-medium">{currencyFormat(token.market_data.daily_volume_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>

          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">All Time High</div>
          <div className="font-medium">{currencyFormat(token.market_data.ath, '')} ZIL</div>

          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">All Time Low</div>
          <div className="font-medium">{currencyFormat(token.market_data.atl, '')} ZIL</div>
        </div>
        <div className="px-4 py-2 border-r border-gray-300 dark:border-gray-800">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Liquidity</div>
          <div className="flex-grow font-medium">{currencyFormat(token.market_data.current_liquidity_zil * selectedCurrency.rate, selectedCurrency.symbol)}</div>
          <div className="text-xs text-gray-500"><span className="font-semibold">{cryptoFormat(token.market_data.zil_reserve)}</span> ZIL / <span className="font-semibold">{cryptoFormat(token.market_data.token_reserve)}</span> {token.symbol}</div>
          <div className="text-xs text-gray-500"><span className="font-semibold">{numberFormat(token.market_data.liquidity_providers, 0)}</span> liquidity providers</div>

          <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Liquidity / Market Cap</div>
          <div className="font-medium">{numberFormat(token.market_data.current_liquidity / token.market_data.market_cap, 3)}</div>

          {token.rewards.length > 0 &&
            <>
              <div className="text-gray-700 dark:text-gray-400 text-sm mt-6">Liquidity Rewards</div>
              <div className="text-sm">Combined APR: <span className="font-semibold">{apr.toNumber()}%</span></div>
              <div>
                {token.rewards.map((reward: Reward) => {
                  const paymentDayDetail = reward.payment_day ? (
                    <div className="bg-white dark:bg-gray-700 px-3 py-2 rounded-lg shadow-md text-sm">
                      Distributed on <span className="font-semibold">{dayjs().day(reward.payment_day).format('dddd')}</span>
                    </div>
                  ) : (<></>)
                  return (
                    <div key={reward.reward_token_address} className="text-sm flex items-center whitespace-nowrap">
                      <div className="w-4 h-4 flex-shrink-0 mr-2"><TokenIcon address={reward.reward_token_address} /></div>
                      <span className="mr-1">{cryptoFormat(reward.amount)}</span>
                      <span className="font-semibold mr-1">{reward.reward_token_symbol}</span>
                      <span>/ week</span>
                      {reward.payment_day &&
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
        <div className="px-4 py-2">
          <div className="text-gray-700 dark:text-gray-400 text-sm">Circulating Supply</div>
          <Supply token={token} />

          {token.symbol === 'gZIL' &&
            <>
              <div className="text-gray-700 dark:text-gray-400 text-sm mt-6 mb-1">Minting stops in</div>
              <GzilCountdown />
            </>
          }

          {(token.symbol === 'ZILLEX' || token.symbol === 'UNIDEX') &&
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
      
      <div className="rounded-lg overflow-hidden shadow-md">
        <TVChartContainer 
          symbol={`${token.symbol}/ZIL`} 
          interval={'240' as ResolutionString} 
          autosize={true} 
          fullscreen={false} 
          theme={resolvedTheme}
        />
      </div>
    </>
  )
}

export default TokenDetail
