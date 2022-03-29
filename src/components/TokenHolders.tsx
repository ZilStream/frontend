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

interface Props {
  token: Token
}

export interface Balance {
  address: string;
  balance: BigNumber;
}

const TokenHolders = (props: Props) => {
  const { token } = props

  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const client = blockchainState.client

  const [holders, setHolders] = useState<Balance[]>([])
  const excludedAddresses = token.supply_skip_addresses.split(",")
  const zilSwapAddress = ZILSWAP_ADDRESS

  const [state, setState] = useState({
    isLoading: true,
    showLocked: false,
    showZilSwap: false,
    rows: 50,
    zilSwapAmount: new BigNumber(0)
  })

  useEffect(() => {
    getHolders()
  }, [])

  const getHolders = async () => {
    const response = await client.blockchain.getSmartContractSubState(
      fromBech32Address(token.address),
      'balances',
      []
    )
    const balances: {[id: string]: string} = response.result.balances

    const newHolders: Balance[] = []
    var zilSwap = new BigNumber(0)
    Object.entries(balances).forEach(([hex, b]) => {
      const address = toBech32Address(hex)
      const balance = toBigNumber(b).shiftedBy(-token.decimals)
      if(balance.isZero()) return

      if(address === zilSwapAddress) {
        zilSwap = zilSwap.plus(balance)
      }

      newHolders.push({
        address,
        balance
      })
    })
    setHolders(newHolders)
    setState({...state, zilSwapAmount: zilSwap, isLoading: false})
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

  const filteredSupply = useMemo(() => {
    if(!state.showLocked) {
      if(!state.showZilSwap) {
        return token.market_data.current_supply - state.zilSwapAmount.toNumber()
      }
      return token.market_data.current_supply
    }
    if(!state.showZilSwap) {
      return token.market_data.total_supply - state.zilSwapAmount.toNumber()
    }
    return token.market_data.total_supply
  }, [state])

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow">
          <span className="font-semibold">{holders.length} holders</span>
        </div>
        <div className="flex items-center bg-gray-200 dark:bg-gray-800 rounded py-1 px-3 text-sm">
          <div className="text-gray-500 dark:text-gray-400 mr-3">Excluding</div>
          <label className="flex items-center font-medium mr-2">
            <input 
              type="checkbox" 
              checked={!state.showLocked} 
              onChange={() => setState({...state, showLocked: !state.showLocked})} 
              className="text-primary bg-gray-600 rounded mr-1 border-0 outline-none focus:outline-none focus:border-0 focus:ring-0" />
            Team Locked
          </label>
          <label className="flex items-center font-medium">
            <input 
              type="checkbox" 
              checked={!state.showZilSwap} 
              onChange={() => setState({...state, showZilSwap: !state.showZilSwap})} 
              className="text-primary bg-gray-600 rounded mr-1 border-0 outline-none focus:outline-none focus:border-0 focus:ring-0" />
            ZilSwap
          </label>
        </div>
      </div>
      <div>
        <div className="flex items-center py-2 text-xs uppercase text-gray-500 dark:text-gray-400 border-b dark:border-gray-700 mt-4">
          <div className="flex-grow flex items-center">Address</div>
          <div>Balance</div>
          <div className="w-24 text-right">
            Share
          </div>
        </div>
        {filteredHolders.map((holder, index) => {
          return (
            <div key={holder.address} className="flex items-center text-gray-800 dark:text-gray-300 py-2 border-b last:border-b-0 dark:border-gray-700">
              <div className="flex-grow flex items-center">
                <div className="w-10 text-gray-500 dark:text-gray-400">{index+1}.</div>
                <div className="hidden md:block"><a className="font-normal" href={`https://viewblock.io/zilliqa/address/${holder.address}`} target="_blank">{holder.address}</a></div>
                <div className="block md:hidden"><a className="font-normal" href={`https://viewblock.io/zilliqa/address/${holder.address}`} target="_blank">{shortenAddress(holder.address)}</a></div>
                {excludedAddresses.includes(holder.address) && <span className="ml-3 uppercase bg-primaryDark text-gray-800 rounded text-xs font-semibold px-2 py-1">Team Locked</span>}
                {holder.address === zilSwapAddress && <span className="ml-3 uppercase bg-primaryDark text-gray-800 rounded text-xs font-semibold px-2 py-1">ZilSwap</span>}
                {holder.address === 'zil1e9zzx762ggnvd20nfm2yrfr9pgurvn24qmzhew' && <span className="ml-3 uppercase bg-primaryDark text-gray-800 rounded text-xs font-semibold px-2 py-1">Rescued Funds</span>}
              </div>
              <div className="text-right">{cryptoFormat(holder.balance.toNumber())}</div>
              <div className="w-24 text-right">
                {numberFormat(holder.balance.dividedBy(filteredSupply).times(100).toNumber())}%
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

export default TokenHolders