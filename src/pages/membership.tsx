import Head from 'next/head'
import React from 'react'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenInfo, TokenState } from 'store/types'
import { cryptoFormat, currencyFormat } from 'utils/format'
import useBalances from 'utils/useBalances'
import TokenIcon from 'components/TokenIcon'

function Membership() {
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const { totalBalance, membership } = useBalances()

  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  const streamTokens = tokenState.tokens.filter(token => token.isStream)
  const streamToken: TokenInfo|null = streamTokens[0] ?? null

  return (
    <>
      <Head>
        <title>Membership | ZilStream</title>
        <meta property="og:title" content="Membership | ZilStream" />
        {/* <meta name="description" content="ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions." />
        <meta property="og:description" content="ZilStream does not recommend that any cryptocurrency should be bought, sold, or held by you. Do conduct your research and consult your financial advisor before making any investment decisions." /> */}
      </Head>
      <div className="py-36 max-w-2xl">
        <div className="font-bold text-4xl leading-normal">Manage your <span className="text-primary">Zilliqa</span> assets in one simple dashboard.</div>
        <div className="text-gray-500 dark:text-gray-400 text-xl mt-1 mb-4">Track your wallet, pools and staking.</div>
      </div>
      {membership.isMember ? (
        <div className="border-t border-gray-300 dark:border-gray-800 py-16">
          <div className="text-primary font-semibold mb-4">Your membership</div>
          <div className="font-semibold text-2xl max-w-sm mb-4">Thank you for becoming a ZilStream member</div>
          <div className="grid grid-cols-2 gap-6 max-w-5xl leading-relaxed dark:text-gray-200">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div>It's great having you as a member.</div>
              <div className="mt-3">In addition to getting yourself wonderful additional features becoming a ZilStream member also means you're supporting an independent developer with interests aligned with yours.</div>
              <div className="mt-3">We don't serve ads, we don't mine your data, we never sell anything you give to us, and we protect your privacy.</div>
              <div className="mt-3">If you ever need a hand, please contact me directly at melvin@zilstream.com or on Telegram @melvinbeemer.</div>
              <div className="mt-3">Thanks again and all the best,</div>
              <div className="mt-1">Melvin</div>
            </div>
            {totalBalance.isGreaterThan(0) &&
              <div className="">
                <div className="text-lg mb-6 text-gray-600 font-medium">Your ZilStream Membership</div>
                <div className="flex items-center">
                  <div className="flex-grow">Wallet balance:</div> 
                  <div className="font-semibold">{currencyFormat(totalBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow">STREAM balance:</div>
                  <div className="font-semibold">{currencyFormat(membership.streamBalanceZIL.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}</div>
                </div>

                {streamToken &&
                  <div className="mt-5 flex items-center">
                    With <div className="flex items-center mx-1"><div className="w-4 h-4 mr-1"><TokenIcon address="zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c" /></div> <span className="font-semibold"> {cryptoFormat(membership.streamBalance.toNumber())} STREAM</span></div> you're a member. Thank you.
                  </div>
                }
              </div>
            }
          </div>
        </div>
      ) : (
        <div className="border-t border-gray-300 dark:border-gray-800 py-16">
          <div className="text-primary font-semibold mb-4">Membership</div>
          <div className="font-semibold text-2xl max-w-sm mb-4">Become a ZilStream member</div>
          <div className="grid grid-cols-2 gap-6 max-w-5xl leading-relaxed dark:text-gray-200">
            <div>Become a ZilStream member and enjoy deeper insight into the ZRC-2 market and your position within it. Track rewards from providing liquidity, staking and farms. Filter and export through your entire transaction history, change to your native currency and never miss an opportunity with price alerts.</div>
            {totalBalance.isGreaterThan(0) &&
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="text-lg mb-6 text-center text-gray-600 font-medium">ZilStream Membership</div>
                <div className="flex items-center">
                  <div className="flex-grow">Wallet balance:</div> 
                  <div className="font-semibold">{currencyFormat(totalBalance.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex-grow">STREAM balance:</div>
                  <div className="font-semibold">{currencyFormat(membership.streamBalanceZIL.times(selectedCurrency.rate).toNumber(), selectedCurrency.symbol)}</div>
                </div>

                {streamToken &&
                  <div className="mt-5">
                    To become a ZilStream member you'll need at least <span className="font-semibold">{cryptoFormat(totalBalance.dividedBy(200).dividedBy(streamToken.rate).toNumber())} STREAM</span>.
                  </div>
                }
              </div>
            }
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-300 dark:border-gray-800 py-16">
        <div className="text-primary font-semibold mb-4">Rewards tracking</div>
        <div className="font-semibold text-2xl max-w-sm mb-4">Track liquidity and staking rewards for tokens</div>
        <div className="grid grid-cols-2 gap-6 max-w-5xl leading-relaxed dark:text-gray-200">
          <div>Track liquidity rewards provided by tokens and the ZilSwap liquidity mining program. View your weekly rewards by each token and in total. Properly adjusted for those projects that exclude their admin wallets.</div>
          <div>ZilStream supports not just ZWAP rewards but rewards from every token providing you an overview of all rewards you stand to gain.</div>
        </div>
        <div className="flex items-start mt-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-72 mr-6">
            <div className="text-sm text-gray-700 dark:text-gray-400 mb-2">Estimated weekly rewards</div>
            <div className="flex-grow flex items-center mb-1">
              <div className="font-medium text-xl">
                $1200,39
              </div>
              <div className="text-gray-500 text-md ml-2">5,000 ZIL</div>
            </div>
            <div className="text-sm">
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2"><TokenIcon address="zil1p5suryq6q647usxczale29cu3336hhp376c627" /></span>
                <span className="mr-1">2.3</span>
                <span className="font-medium">ZWAP</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2"><TokenIcon address="zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c" /></span>
                <span className="mr-1">325.64</span>
                <span className="font-medium">STREAM</span>
              </div>
              <div className="flex items-center">
                <span className="w-4 h-4 mr-2"><TokenIcon address="zil1hau7z6rjltvjc95pphwj57umdpvv0d6kh2t8zk" /></span>
                <span className="mr-1">86.05</span>
                <span className="font-medium">CARB</span>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-72">
            <div className="text-gray-700 dark:text-gray-400 text-sm mb-2">Liquidity Rewards</div>
            <div className="text-sm">Combined APR: <span className="font-semibold">100%</span></div>
            <div>
              <div className="text-sm flex items-center whitespace-nowrap">
                <div className="w-4 h-4 flex-shrink-0 mr-2"><TokenIcon address="zil1p5suryq6q647usxczale29cu3336hhp376c627" /></div>
                <span className="mr-1">53.13</span>
                <span className="font-semibold mr-1">ZWAP</span>
                <span>/ week</span>
              </div>
              <div className="text-sm flex items-center whitespace-nowrap">
                <div className="w-4 h-4 flex-shrink-0 mr-2"><TokenIcon address="zil1504065pp76uuxm7s9m2c4gwszhez8pu3mp6r8c" /></div>
                <span className="mr-1">24,038</span>
                <span className="font-semibold mr-1">STREAM</span>
                <span>/ week</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-800 py-16">
        <div className="text-primary font-semibold mb-4">Currency switching</div>
        <div className="grid grid-cols-2 gap-6 max-w-5xl leading-relaxed dark:text-gray-200">
          <div>
            <div className="font-semibold text-2xl max-w-sm mb-4">Change the native currency across ZilStream</div>
            <div>Track prices, market caps, volume, liquidity and your portfolio in your (crypto) currency of choice. Select a new currency will instantly change all the values across the site.</div>
          </div>
          <div className="flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-900 rounded-lg p-4 w-72 flex flex-col items-stretch text-sm">
              {currencyState.currencies.filter(currency => currency.isPopular).map(currency => {
                return (
                  <button key={currency.code} className={`flex items-center hover:bg-gray-200 dark:hover:bg-gray-700 rounded cursor-pointer focus:outline-none py-1 px-2 ${currency.code === currencyState.selectedCurrency ? 'bg-gray-200 dark:bg-gray-700' : ''}`}>
                    <div className="flex-shrink-0 flex-grow-0 mr-2">
                      <img src={`/images/currency-flags/${currency.code}.svg`} className="w-5 h-5 bg-gray-200 dark:bg-gray-700 border border-gray-100 dark:border-gray-900 rounded-full" />
                    </div>
                    <div className="flex-grow text-left">
                      <div className="font-medium">{currency.name}</div>
                      <div className="flex items-center text-gray-500">
                        <div>{currency.code}</div>
                        <div className="mx-1">·</div>
                        <div>{currency.symbol}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 dark:border-gray-800 py-16">
        <div className="text-primary font-semibold mb-4">Roadmap</div>
        <div className="font-semibold text-2xl max-w-sm mb-6">What's next for members</div>
        <div className="grid grid-cols-5 gap-6 leading-relaxed">
          <div className="bg-primary px-2 py-8 rounded text-center">
            <div className="font-semibold">Rewards Tracking</div>
            <div className="text-gray-700 dark:text-gray-200">Live now</div>
          </div>
          <div className="bg-primary px-2 py-8 rounded text-center">
            <div className="font-semibold">Currency Switching</div>
            <div className="text-gray-700 dark:text-gray-200">Live now</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Transaction History</div>
            <div className="text-gray-700 dark:text-gray-200">Coming very soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Price Alerts</div>
            <div className="text-gray-700 dark:text-gray-200">Coming soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Balance Graphs</div>
            <div className="text-gray-700 dark:text-gray-200">Coming soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Zil-Cost Averaging</div>
            <div className="text-gray-700 dark:text-gray-200">Coming soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Whale Alert</div>
            <div className="text-gray-700 dark:text-gray-200">Coming soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Live Charts</div>
            <div className="text-gray-700 dark:text-gray-200">Coming soon</div>
          </div>
          <div className="bg-gray-300 dark:bg-gray-700 px-2 py-8 rounded text-center">
            <div className="font-semibold">Secrets..</div>
            <div className="text-gray-700 dark:text-gray-200">This quarter</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Membership