import { fromBech32Address, toBech32Address } from '@zilliqa-js/crypto'
import BigNumber from 'bignumber.js'
import { ZILSWAP_ADDRESS } from 'lib/constants'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { BlockchainState, RootState, Token } from 'store/types'
import { shortenAddress } from 'utils/shorten'
import { cryptoFormat, numberFormat } from 'utils/format'
import { toBigNumber } from 'utils/useMoneyFormatter'
import LoadingSpinner from './LoadingSpinner'
import { DEX } from 'types/dex.interface'

interface Props {
  token: Token
}

export interface Balance {
  address: string;
  balance: BigNumber;
}

const TokenLiquidity = (props: Props) => {
  const { token } = props

  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const client = blockchainState.client

  const [totalContribution, setTotalContribution] = useState<BigNumber>(new BigNumber(0))
  const [baseReserve, setBaseReserve] = useState<BigNumber>(new BigNumber(0))
  const [holders, setHolders] = useState<Balance[]>([])
  const excludedAddresses = token.supply_skip_addresses.split(",")
  const zilSwapAddress = ZILSWAP_ADDRESS

  const [state, setState] = useState({
    isLoading: true,
    showLocked: false,
    showZilSwap: false,
    rows: 50,
    totalContribution: new BigNumber(0)
  })

  useEffect(() => {
    getTotalContribution()
    getBaseReserve()
  }, [])

  useEffect(() => {
    if(totalContribution.isZero() || baseReserve.isZero()) return
    getHolders()
  }, [totalContribution, baseReserve])

  const getHolders = async () => {
    const response = await client.blockchain.getSmartContractSubState(
      fromBech32Address(zilSwapAddress),
      'balances',
      [fromBech32Address(token.address).toLowerCase()]
    )
    const balances: {[id: string]: string} = response.result.balances[fromBech32Address(token.address).toLowerCase()]

    const newHolders: Balance[] = []

    Object.entries(balances).forEach(([hex, b]) => {
      const address = toBech32Address(hex)
      const userContribution = toBigNumber(b)

      if(userContribution.isZero()) return

      const share = userContribution.dividedBy(totalContribution)
      const balance = share.times(baseReserve).shiftedBy(-token.decimals)

      newHolders.push({
        address,
        balance
      })
    })
    setHolders(newHolders)
    setState({...state, totalContribution, isLoading: false})
  }

  const getTotalContribution = async () => {
    const response = await client.blockchain.getSmartContractSubState(
      fromBech32Address(zilSwapAddress),
      'total_contributions',
      [fromBech32Address(token.address).toLowerCase()]
    )

    setTotalContribution(toBigNumber(response.result.total_contributions[fromBech32Address(token.address).toLowerCase()]))
  }

  const getBaseReserve = async () => {
    const response = await client.blockchain.getSmartContractSubState(
      fromBech32Address(zilSwapAddress),
      'pools',
      [fromBech32Address(token.address).toLowerCase()]
    )

    setBaseReserve(toBigNumber(response.result.pools[fromBech32Address(token.address).toLowerCase()].arguments[1]))
  }

  const filteredHolders = useMemo(() => {
    if(state.isLoading) return []
    var fHolders = holders
    if(!state.showLocked) {
      fHolders = fHolders.filter(h => !excludedAddresses.includes(h.address))
    }
    if(!state.showZilSwap) {
      fHolders = fHolders.filter(h => h.address !== ZILSWAP_ADDRESS)
    }

    fHolders.sort((a,b) => a.balance.isGreaterThan(b.balance) ? -1 : 1)
    fHolders = fHolders.slice(0, state.rows)

    return fHolders
  }, [holders, state])

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow">
          <span className="font-semibold">{holders.length} liquidity providers on ZilSwap</span>
        </div>
      </div>
      <div>
        <div className="flex items-center py-2 text-xs uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 mt-4">
          <div className="flex-grow flex items-center">Address</div>
          <div>Liquidity</div>
          <div className="w-24 text-right">
            Share
          </div>
        </div>
        {filteredHolders.map((holder, index) => {
          const share = holder.balance.dividedBy(state.totalContribution)
          const tokenAmount = share.times(state.totalContribution)
          return (
            <div key={holder.address} className="flex items-center text-gray-800 dark:text-gray-300 py-2 whitespace-nowrap border-b last:border-b-0 dark:border-gray-700">
              <div className="flex-grow flex items-center">
                <div className="w-10 text-gray-500 dark:text-gray-400">{index+1}.</div>
                <div className="hidden md:block"><a className="font-normal" href={`https://viewblock.io/zilliqa/address/${holder.address}`} target="_blank">{holder.address}</a></div>
                <div className="block md:hidden"><a className="font-normal" href={`https://viewblock.io/zilliqa/address/${holder.address}`} target="_blank">{shortenAddress(holder.address)}</a></div>
                {excludedAddresses.includes(holder.address) && <span className="ml-3 uppercase bg-primaryDark text-gray-800 rounded text-xs font-semibold px-2 py-1">Team Locked</span>}
                {holder.address === zilSwapAddress && <span className="ml-3 uppercase bg-primaryDark text-gray-800 rounded text-xs font-semibold px-2 py-1">ZilSwap</span>}
              </div>
              <div className="text-right">{cryptoFormat(tokenAmount.toNumber())} <span className="font-semibold">{token.symbol}</span></div>
              <div className="w-24 text-right">
                {numberFormat(share.times(100).toNumber())}%
              </div>
            </div>
          )
        })}

        {holders.length > 50 && state.rows === 50 &&
          <button onClick={() => setState({...state, rows: holders.length})} className="w-full py-3 font-medium">Show more</button>
        }

        {state.isLoading &&
          <div className="py-6 flex items-center justify-center">
            <LoadingSpinner /> <span className="text-gray-600 dark:text-gray-300">Loading</span>
          </div>
        }
        
      </div>
    </div>
  )
}

export default TokenLiquidity