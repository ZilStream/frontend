import BigNumber from "bignumber.js"
import Head from "next/head"
import Link from "next/link"
import React from "react"
import { TokenInfo } from "store/types"
import { SimpleRate } from "types/rate.interface"
import useMoneyFormatter, { toBigNumber } from "utils/useMoneyFormatter"
import FlashChange from "./FlashChange"
import TokenIcon from "./TokenIcon"

interface Props {
  walletAddress: string
  tokens: TokenInfo[]
  latestRates: SimpleRate[]
}

function PortfolioBalances(props: Props) {
  const moneyFormat = useMoneyFormatter({ maxFractionDigits: 5 })

  let zilRate = props.latestRates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0].rate

  let filteredTokens = props.tokens.filter(token => {
    return token.balance !== null && token.balance !== undefined && !toBigNumber(token.balance).isZero()
  })

  return (
    <>
      <div className="font-bold text-2xl">Balances</div>
      <table className="zilstream-table table-fixed border-collapse">
        <colgroup>
          <col style={{width: '276px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
          <col style={{width: '100px', minWidth: 'auto'}} />
        </colgroup>
        <thead className="text-gray-500 dark:text-gray-400 text-xs">
          <tr>
            <th className="pl-4 pr-2 py-2 text-left">Token</th>
            <th className="px-2 py-2 text-right">Balance</th>
            <th className="px-2 py-2 text-right">ZIL</th>
            <th className="px-2 py-2 text-right">USD</th>
            <th className="px-2 py-2 text-right">24h %</th>
          </tr>
        </thead>
        <tbody>
          {filteredTokens.map((token, index) => {
            let balance = toBigNumber(token.balance, {compression: token.decimals})

            let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == token.address_bech32)[0].rate : 0
            let zilBalance = (token.isZil) ? balance.toNumber() : (Number(balance) * rate)
            let usdBalance = zilBalance * zilRate
            
            return (
              <tr key={token.address_bech32} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0">
                <td className={`pl-4 pr-2 py-4 font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === filteredTokens.length-1 ? 'rounded-bl-lg' : ''}`}>
                  <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
                    <a className="flex items-center">
                      <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                        <TokenIcon url={token.icon} />
                      </div>
                      <span className="hidden lg:inline">{token.name}</span>
                      <span className="lg:font-normal ml-2 lg:text-gray-500">{token.symbol}</span>
                    </a>
                  </Link>
                </td>
                <td className="px-2 py-2 font-normal text-right">
                  {moneyFormat(token.balance, {
                    symbol: token.symbol,
                    compression: token.decimals,
                    maxFractionDigits: 2,
                    showCurrency: false,
                  })}
                </td>
                <td className="px-2 py-2 font-normal text-right">
                  <FlashChange value={zilBalance}>
                    {token.isZil ? (
                      <span>-</span>
                    ) : (
                      <span>{moneyFormat(zilBalance, {compression: 0, maxFractionDigits: 2})}</span>
                    )}
                  </FlashChange>
                </td>
                <td className="px-2 py-2 font-normal text-right">
                  <FlashChange value={usdBalance}>
                    <span>${moneyFormat(usdBalance, {compression: 0, maxFractionDigits: 2})}</span>
                  </FlashChange>
                </td>
                <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === filteredTokens.length-1 ? 'rounded-br-lg' : ''}`}></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default PortfolioBalances