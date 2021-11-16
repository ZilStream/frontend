import React, { useMemo, useState } from 'react'
import { ChevronDown, Info, Maximize, Settings } from 'react-feather'
import { useSelector } from 'react-redux'
import { RootState, SwapState, TokenState } from 'store/types'
import CurrencyInput from './components/CurrencyInput'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { toBigNumber } from 'utils/useMoneyFormatter'
import { cryptoFormat, currencyFormat } from 'utils/format'
import Tippy from '@tippyjs/react'
import { getExchangeRate } from 'lib/zilswap'
import TokenIcon from 'components/TokenIcon'

interface Props {
  showFullscreen?: boolean
}

const Swap = (props: Props) => {
  const { showFullscreen } = props
  const { tokenInAddress, tokenOutAddress, slippage } = useSelector<RootState, SwapState>(state => state.swap)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const swapState = useSelector<RootState, SwapState>(state => state.swap)
  
  const { tokenIn, tokenOut } = useMemo(() => {
    return {
      tokenIn: tokenState.tokens.filter(t => t.address_bech32 === tokenInAddress)?.[0],
      tokenOut: tokenState.tokens.filter(t => t.address_bech32 === tokenOutAddress)?.[0]
    }
  }, [tokenState, swapState])

  const [state, setState] = useState({
    tokenInAmount: new BigNumber(0),
    tokenOutAmount: new BigNumber(0),
    expectedSlippage: new BigNumber(0),
    focusDirectionIn: true
  })

  const getCurrentRate = (): BigNumber => {
    if(!tokenIn || !tokenOut) return new BigNumber(0)
    const inRate = toBigNumber(tokenIn.symbol === 'ZIL' ? 1 : tokenIn.rate)
    const outRate = toBigNumber(tokenOut.symbol === 'ZIL' ? 1 : tokenOut.rate)
    return inRate.dividedBy(outRate)
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow text-lg font-bold">
          Swap
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center text-sm border dark:border-gray-700 rounded-lg font-medium py-1 px-2">
            <div className="w-4 h-4 mx-1"><TokenIcon address={`zil1p5suryq6q647usxczale29cu3336hhp376c627`} /></div>
            ZilSwap
            <ChevronDown size={16} className="ml-1" />
          </button>
          <button><Settings size={16} /></button>
          {showFullscreen && <Link href="/swap"><a><Maximize size={16} /></a></Link>}
        </div>
      </div>
      <div className="mt-2">
      <CurrencyInput 
          selectedToken={tokenIn}
          amount={state.tokenInAmount}
          onAmountChange={amount => {
            const { expectedAmount, expectedSlippage } = getExchangeRate(tokenIn!, tokenOut!, amount, true)
            setState({
              ...state,
              tokenInAmount: amount,
              tokenOutAmount: expectedAmount,
              expectedSlippage: expectedSlippage,
              focusDirectionIn: true,
            })
          }}
          isFocus={state.focusDirectionIn}
          isIn
        />
        <CurrencyInput 
          selectedToken={tokenOut} className="mt-2" 
          amount={state.tokenOutAmount}
          onAmountChange={amount => {
            const { expectedAmount, expectedSlippage } = getExchangeRate(tokenIn!, tokenOut!, amount, false)
            setState({
              ...state,
              tokenOutAmount: amount,
              tokenInAmount: expectedAmount,
              expectedSlippage: expectedSlippage,
              focusDirectionIn: false,
            })
          }}
          isFocus={!state.focusDirectionIn}
          expectedSlippage={state.expectedSlippage}
        />
      </div>
      <div className="text-sm font-medium mt-2 flex items-center justify-end">
        1 {tokenIn?.symbol} = {cryptoFormat(getCurrentRate().toNumber())} {tokenOut?.symbol} <span className="text-gray-500 dark:text-gray-400">({currencyFormat(tokenIn?.rate_usd ?? 0)})</span>
        <Tippy content={
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border w-72 flex flex-col gap-1 text-sm whitespace-nowrap">
            <div className="font-semibold border-b dark:border-gray-700 pb-1 mb-1">
              Transaction Details
            </div>
            <div className="flex items-center">
              <div className="flex-grow">Liquidity Provider Fee</div>
              <div className="font-medium">{cryptoFormat(state.tokenInAmount.times(0.003).toNumber())} {tokenIn?.symbol}</div>
            </div>
            {!state.expectedSlippage.isNaN() &&
              <div className="flex items-center">
                <div className="flex-grow">Price Impact</div>
                <div className="font-medium">{state.expectedSlippage.toFixed(2)}%</div>
              </div>
            }
            
            <div className="flex items-center">
              <div className="flex-grow">Allowed Slippage</div>
              <div className="font-medium">{slippage*100}%</div>
            </div>
            <div className="flex items-center">
              <div className="flex-grow">Minimum Received</div>
              <div className="font-medium">{cryptoFormat(state.tokenOutAmount.times((1-slippage)).toNumber())} {tokenOut?.symbol}</div>
            </div>
          </div>
        }>
          <button className="ml-2 focus:outline-none">
            <Info size={15} className="text-gray-500 dark:text-gray-400" />
          </button>
        </Tippy>
      </div>
      <button className="bg-primary px-4 py-3 rounded-lg w-full font-bold mt-2">Swap</button>
    </div>
  )
}

export default Swap