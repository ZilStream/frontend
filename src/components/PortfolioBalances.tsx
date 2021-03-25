import Head from "next/head"
import React, { useEffect, useState } from "react"
import { Balance } from "types/balance.interface"
import { Token } from "types/token.interface"
import { getBalancesForTokens } from "utils/balances"
import TokenIcon from "./TokenIcon"

interface Props {
  walletAddress: string
  tokens: Token[]
}

function PortfolioBalances(props: Props) {
  const walletAddress = props.walletAddress

  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    let cachedBalancesString = localStorage.getItem('balances')
    
    if(cachedBalancesString) {
      console.log(JSON.parse(cachedBalancesString))
      let cachedBalances: Balance[] = JSON.parse(cachedBalancesString)
      console.log(cachedBalances)
      setBalances(cachedBalances)
    } else {
      const retrieveBalances = async () => {
        if(walletAddress) {
          let retrievedBalances = await getBalancesForTokens(walletAddress, props.tokens)
          console.log(retrievedBalances)
          setBalances(retrievedBalances)
          localStorage.setItem('balances', JSON.stringify(retrievedBalances))
        }
      }
  
      retrieveBalances()
    }
  }, [])

  return (
    <>
      <Head>
        <title>Portfolio | ZilStream</title>
        <meta property="og:title" content={`Portfolio | ZilStream`} />
      </Head>
      <div className="py-8 flex items-center">
        <h1 className="flex-grow">Portfolio</h1>
        <div className="text-gray-600">{walletAddress}</div>
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
        {props.tokens.map( token => {
          return (
            <div key={token.id} className="bg-gray-800 p-4 rounded-lg mb-2 flex items-center">
              <div className="w-6 mr-4"><TokenIcon url={token.icon} /></div>
              <div className="font-medium">{token.symbol}</div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default PortfolioBalances