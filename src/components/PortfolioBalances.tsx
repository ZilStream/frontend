import BigNumber from "bignumber.js"
import Head from "next/head"
import React from "react"
import { TokenInfo } from "store/types"
import { SimpleRate } from "types/rate.interface"
import useMoneyFormatter, { toBigNumber } from "utils/useMoneyFormatter"
import TokenIcon from "./TokenIcon"

interface Props {
  walletAddress: string
  tokens: TokenInfo[]
  latestRates: SimpleRate[]
}

function PortfolioBalances(props: Props) {
  const walletAddress = props.walletAddress
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  let zilRate = props.latestRates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0].rate

  var totalBalance = props.tokens.reduce((sum, current) => {
    let balance = toBigNumber(current.balance, {compression: current.decimals})

    if(current.isZil) return sum.plus(balance)

    let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == current.address_bech32)[0].rate : 0
    return sum.plus(balance.times(rate))
  }, new BigNumber(0))

  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>
      <div className="py-8 flex items-center">
        <div className="flex-grow">
          <h1 className="flex-grow">Portfolio</h1>
          <div className="text-gray-600">{walletAddress}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">${moneyFormat(totalBalance.times(zilRate), {compression: 0, maxFractionDigits: 2})}</div>
          <div>{moneyFormat(totalBalance, {compression: 0, maxFractionDigits: 2})} ZIL</div>
        </div>
      </div>
      <div>
        <div className="flex items-center px-2 sm:px-4 text-gray-500 dark:text-gray-400 text-sm mb-2">
          <div className="w-6 mr-3 md:mr-4"></div>
          <div className="w-16 sm:w-24 md:w-36">Token</div>
          <div className="w-20 md:w-28 lg:w-36 text-right">Balance</div>
          <div className="w-32 lg:w-40 hidden md:block text-right">ZIL</div>
          <div className="w-20 md:w-32 lg:w-40 text-right">USD</div>
          <div className="w-36 lg:w-44 xl:w-48 hidden lg:block text-right">Change (24h)</div>
          <div className="flex-grow"></div>
        </div>
        {props.tokens.filter(token => token.balance !== null && token.balance !== undefined).map( token => {
          let balance = toBigNumber(token.balance, {compression: token.decimals})

          if(balance.isZero()) {
            return <></>
          }

          let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == token.address_bech32)[0].rate : 0
          let zilBalance = (token.isZil) ? balance.toNumber() : (Number(balance) * rate)
          let usdBalance = zilBalance * zilRate
          
          return (
            <div key={token.address_bech32} className="bg-gray-800 p-4 rounded-lg mb-2 flex items-center">
              <div className="w-6 mr-3 md:mr-4"><TokenIcon url={token.icon} /></div>
              <div className="w-16 sm:w-24 md:w-36 font-medium">{token.symbol}</div>
              <div className="w-20 md:w-28 lg:w-36 text-right">
                {moneyFormat(token.balance, {
                  symbol: token.symbol,
                  compression: token.decimals,
                  maxFractionDigits: 2,
                  showCurrency: false,
                })}
              </div>
              <div className="w-32 lg:w-40 hidden md:block text-right">
                {token.isZil ? (
                  <span>-</span>
                ) : (
                  <span>{moneyFormat(zilBalance, {compression: 0, maxFractionDigits: 2})}</span>
                )}
              </div>
              <div className="w-20 md:w-32 lg:w-40 text-right">
                <span>${moneyFormat(usdBalance, {compression: 0, maxFractionDigits: 2})}</span>
              </div>
              <div className="w-36 lg:w-44 xl:w-48 hidden lg:block text-right"></div>
              <div className="flex-grow"></div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default PortfolioBalances