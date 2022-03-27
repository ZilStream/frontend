import React, { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ChevronDown, Info, Maximize, Settings } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { BlockchainState, Currency, CurrencyState, RootState, SwapState, TokenState } from 'store/types'
import CurrencyInput from './components/CurrencyInput'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { toBigNumber } from 'utils/useMoneyFormatter'
import { cryptoFormat, currencyFormat } from 'utils/format'
import Tippy from '@tippyjs/react'
import TokenIcon from 'components/TokenIcon'
import { Exchange } from 'lib/exchange/exchange'
import { ZilSwap } from 'lib/exchange/zilswap/zilswap'
import { STREAM_ADDRESS, ZIL_ADDRESS } from 'lib/constants'
import { BIG_ONE } from 'utils/strings'
import { openExchange } from 'store/modal/actions'
import { updateSwap } from 'store/swap/actions'
import { XCADDex } from 'lib/exchange/xcaddex/xcaddex'
import { addNotification } from 'store/notification/actions'
import dayjs from 'dayjs'
import getExchange from 'lib/zilstream/getExchange'

interface Props {
  showFullscreen?: boolean
}

const Swap = (props: Props) => {
  const { showFullscreen } = props
  const { tokenInAddress, tokenOutAddress, slippage } = useSelector<RootState, SwapState>(state => state.swap)
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const swapState = useSelector<RootState, SwapState>(state => state.swap)
  const blockchainState = useSelector<RootState, BlockchainState>(state => state.blockchain)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const dispatch = useDispatch()

  const [exchange, setExchange] = useState<Exchange|null>(null)
  const [state, setState] = useState({
    tokenInAmount: new BigNumber(0),
    tokenOutAmount: new BigNumber(0),
    expectedSlippage: new BigNumber(0),
    focusDirectionIn: true,
    needsApproval: false
  })

  useEffect(() => {
    initiateExchange()

    if(swapState.tokenInAddress === null || swapState.tokenOutAddress === null) {
      dispatch(updateSwap({
        tokenInAddress: swapState.exchange.baseTokenAddress,
        tokenOutAddress: STREAM_ADDRESS
      }))
    }

    getPairsForExchange()
  }, [])

  useEffect(() => {
    initiateExchange()
  }, [swapState.exchange])

  const initiateExchange = () => {
    let zilPay = (window as any).zilPay

    if(typeof zilPay === "undefined") {
      console.log("ZilPay extension not installed")
      return
    }

    if(swapState.exchange.identifier === 'zilswap') {
      setExchange(new ZilSwap(blockchainState.client, zilPay))
    } else if(swapState.exchange.identifier === 'xcad-dex') {
      setExchange(new XCADDex(blockchainState.client, zilPay))
    }
  }

  useEffect(() => {
    // When a token gets set, check if the current routing is available. If not
    // make an educated guess.
    if(swapState.exchange.hasRouting) {
      // Check if the same token has been entered
      if(swapState.tokenInAddress === swapState.tokenOutAddress) {
        if(swapState.selectedDirection === "in") {
          dispatch(updateSwap({
            tokenOutAddress: swapState.tokenInAddress === ZIL_ADDRESS ? STREAM_ADDRESS : ZIL_ADDRESS
          }))
        } else {
          dispatch(updateSwap({
            tokenInAddress: swapState.tokenOutAddress === ZIL_ADDRESS ? STREAM_ADDRESS : ZIL_ADDRESS
          }))
        }
      }      
    } else {
      if(swapState.selectedDirection === "in") {
        let quoteTokens = [...new Set(swapState.availablePairs.filter(pair => pair.base_address === swapState.tokenInAddress).map(pair => pair.quote_address))] 
        let baseTokens = [...new Set(swapState.availablePairs.filter(pair => pair.quote_address === swapState.tokenInAddress).map(pair => pair.base_address))]
        let availableTokens = quoteTokens.concat(baseTokens)

        if(swapState.tokenOutAddress && availableTokens.includes(swapState.tokenOutAddress)) return
 
        if(quoteTokens.length > 0) {
          dispatch(updateSwap({
            tokenOutAddress: quoteTokens[0]
          }))
        } else {
          dispatch(updateSwap({
            tokenOutAddress: baseTokens[0]
          }))
        }
      } else {
        let quoteTokens = [...new Set(swapState.availablePairs.filter(pair => pair.base_address === swapState.tokenOutAddress).map(pair => pair.quote_address))] 
        let baseTokens = [...new Set(swapState.availablePairs.filter(pair => pair.quote_address === swapState.tokenOutAddress).map(pair => pair.base_address))]
        let availableTokens = quoteTokens.concat(baseTokens)

        if(swapState.tokenInAddress && availableTokens.includes(swapState.tokenInAddress)) return

        if(quoteTokens.length > 0) {
          dispatch(updateSwap({
            tokenInAddress: quoteTokens[0]
          }))
        } else {
          dispatch(updateSwap({
            tokenInAddress: baseTokens[0]
          }))
        }
      }      
    }
  }, [swapState.tokenInAddress, swapState.tokenOutAddress])

  const { tokenIn, tokenOut } = useMemo(() => {
    return {
      tokenIn: tokenState.tokens.filter(t => t.address === tokenInAddress)?.[0],
      tokenOut: tokenState.tokens.filter(t => t.address === tokenOutAddress)?.[0]
    }
  }, [tokenState, swapState])

  useEffect(() => {
    if(!tokenState.initialized) return

    dispatch(updateSwap({
      tokenInAddress: swapState.exchange.baseTokenAddress,
      tokenOutAddress: STREAM_ADDRESS
    }))

    getPairsForExchange()
  }, [swapState.exchange])

  useEffect(() => {
    if(!exchange || !tokenIn) return

    if(tokenIn.address === ZIL_ADDRESS) {
      setState({...state, needsApproval: false})
    } else {
      checkApproval()
    }
  }, [exchange, swapState.tokenInAddress])

  const getPairsForExchange = async () => {
    let exchange = await getExchange(swapState.exchange.identifier)
    dispatch(updateSwap({ availablePairs: exchange.pairs }))
  }

  const checkApproval = async () => {
    const approval = await exchange!.tokenNeedsApproval(tokenIn, BIG_ONE)
    setState({...state, needsApproval: approval.needsApproval})
  }

  const getCurrentRate = (): BigNumber => {
    if(!tokenIn || !tokenOut) return new BigNumber(0)
    const inRate = toBigNumber(tokenIn.symbol === 'ZIL' ? 1 : tokenIn.market_data.rate_zil)
    const outRate = toBigNumber(tokenOut.symbol === 'ZIL' ? 1 : tokenOut.market_data.rate_zil)
    return inRate.dividedBy(outRate)
  }

  const reverse = () => {
    dispatch(updateSwap({
      tokenInAddress: tokenOut.address,
      tokenOutAddress: tokenIn.address
    }))
    setState(previousState => {
      return {
        ...previousState,
        tokenInAmount: previousState.tokenOutAmount,
        tokenOutAmount: previousState.tokenInAmount,
        focusDirectionIn: !previousState.focusDirectionIn
      }
    })
  }

  const handleApprove = async () => {
    if(!tokenIn) return

    const tx = await exchange?.approve(tokenIn, state.tokenInAmount.shiftedBy(tokenIn.decimals))
    if(tx === null || tx === undefined) {
      setState({...state, needsApproval: false})
    } else {
      dispatch(addNotification({
        notification: {
          timestamp: dayjs().unix(),
          title: `Approve ${tokenIn.symbol} for ${swapState.exchange.name}`,
          hash: `0x${tx.id}`,
          status: "pending",
        }
      }))
    }
  }

  const handleSwap = async () => {
    if(!tokenIn || !tokenOut || !blockchainState.blockHeight) return
    const tx = await exchange?.swap(
      tokenIn, 
      tokenOut, 
      state.focusDirectionIn ? state.tokenInAmount.shiftedBy(tokenIn.decimals) : state.tokenOutAmount.shiftedBy(tokenOut.decimals),
      swapState.slippage,
      blockchainState.blockHeight + 20,
      state.focusDirectionIn
    )

    if(tx === null || tx === undefined) {
      console.log('Couldn\'t send your swap.')
      return
    }

    dispatch(addNotification({
      notification: {
        timestamp: dayjs().unix(),
        title: `Swap ${cryptoFormat(state.tokenInAmount.toNumber())} ${tokenIn.symbol} to ${cryptoFormat(state.tokenOutAmount.toNumber())} ${tokenOut.symbol}`,
        hash: `0x${tx.id}`,
        status: "pending",
      }
    }))
  }

  let tokenInValue = tokenIn?.symbol === 'ZIL' ? selectedCurrency.rate : tokenIn?.market_data.rate_zil * selectedCurrency.rate

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow text-lg font-bold">
          Swap
        </div>
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center text-sm border dark:border-gray-700 rounded-lg font-medium py-1 px-2"
            onClick={() => dispatch(openExchange(true))}
          >
            <div className="w-4 h-4 mx-1"><TokenIcon address={swapState.exchange.iconAddress} /></div>
            {swapState.exchange.name}
            <ChevronDown size={16} className="ml-1" />
          </button>
          <button><Settings size={16} /></button>
          {showFullscreen && <Link href="/swap"><a><Maximize size={16} /></a></Link>}
        </div>
      </div>
      <div className="mt-2 relative">
        <CurrencyInput 
          selectedToken={tokenIn}
          amount={state.tokenInAmount}
          onAmountChange={amount => {
            if(!exchange || !tokenIn || !tokenOut) return
            const { expectedAmount, expectedSlippage } = exchange.getExchangeRate(tokenIn, tokenOut, amount.shiftedBy(tokenIn.decimals), true)
            setState({
              ...state,
              tokenInAmount: amount,
              tokenOutAmount: expectedAmount.shiftedBy(-tokenOut.decimals),
              expectedSlippage: expectedSlippage,
              focusDirectionIn: true,
            })
          }}
          isFocus={state.focusDirectionIn}
          isIn
        />
        <CurrencyInput 
          selectedToken={tokenOut || !tokenIn || !tokenOut} className="mt-2" 
          amount={state.tokenOutAmount}
          onAmountChange={amount => {
            if(!exchange) return
            const { expectedAmount, expectedSlippage } = exchange.getExchangeRate(tokenIn, tokenOut, amount.shiftedBy(tokenOut.decimals), false)
            setState({
              ...state,
              tokenOutAmount: amount,
              tokenInAmount: expectedAmount.shiftedBy(-tokenIn.decimals),
              expectedSlippage: expectedSlippage,
              focusDirectionIn: false,
            })
          }}
          isFocus={!state.focusDirectionIn}
          expectedSlippage={state.expectedSlippage}
        />
        <button onClick={() => reverse()} className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 border-4 border-white dark:border-gray-800 absolute left-1/2 top-1/2 -translate-x-5 -translate-y-5"><ArrowDown size={14} /></button>
      </div>
      <div className="text-sm font-medium mt-2 flex items-center justify-end">
        1 {tokenIn?.symbol} = {cryptoFormat(getCurrentRate().toNumber())} {tokenOut?.symbol} <span className="text-gray-500 dark:text-gray-400">({currencyFormat(tokenInValue ?? 0, selectedCurrency.symbol)})</span>
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
      <div className="flex items-center gap-4">
        {state.needsApproval &&
          <button className="flex-grow bg-primary px-4 py-3 rounded-lg w-full font-bold mt-2" onClick={() => handleApprove()}>Approve</button>
        }
        <button className="flex-grow bg-primary px-4 py-3 rounded-lg w-full font-bold mt-2" onClick={() => handleSwap()}>Swap</button>
      </div>
    </div>
  )
}

export default Swap