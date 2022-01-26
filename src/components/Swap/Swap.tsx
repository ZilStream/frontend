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
import { toast } from 'react-toastify'
import { ZIL_ADDRESS } from 'lib/constants'
import { BIG_ONE } from 'utils/strings'
import { openExchange } from 'store/modal/actions'
import { shortenAddress } from 'utils/addressShortener'
import { updateSwap } from 'store/swap/actions'
import { XCADDex } from 'lib/exchange/xcaddex/xcaddex'

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
  }, [])

  useEffect(() => {
    initiateExchange()
  }, [swapState.exchange])

  const initiateExchange = () => {
    let zilPay = (window as any).zilPay

    if(swapState.exchange.identifier === 'zilswap') {
      setExchange(new ZilSwap(blockchainState.client, zilPay))
    } else if(swapState.exchange.identifier === 'xcaddex') {
      setExchange(new XCADDex(blockchainState.client, zilPay))
    }
  }

  const { tokenIn, tokenOut } = useMemo(() => {
    return {
      tokenIn: tokenState.tokens.filter(t => t.address_bech32 === tokenInAddress)?.[0],
      tokenOut: tokenState.tokens.filter(t => t.address_bech32 === tokenOutAddress)?.[0]
    }
  }, [tokenState, swapState])

  useEffect(() => {
    if(!exchange || !tokenIn) return

    if(tokenIn.address_bech32 === ZIL_ADDRESS) {
      setState({...state, needsApproval: false})
    } else {
      checkApproval()
      }
  }, [exchange, swapState.tokenInAddress])

  const checkApproval = async () => {
    const approval = await exchange!.tokenNeedsApproval(tokenIn, BIG_ONE)
    setState({...state, needsApproval: approval.needsApproval})
  }

  const getCurrentRate = (): BigNumber => {
    if(!tokenIn || !tokenOut) return new BigNumber(0)
    const inRate = toBigNumber(tokenIn.symbol === 'ZIL' ? 1 : tokenIn.market_data.rate)
    const outRate = toBigNumber(tokenOut.symbol === 'ZIL' ? 1 : tokenOut.market_data.rate)
    return inRate.dividedBy(outRate)
  }

  const reverse = () => {
    dispatch(updateSwap({
      tokenInAddress: tokenOut.address_bech32,
      tokenOutAddress: tokenIn.address_bech32
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
    if(tx === null) {
      toast.info('This token has already been approved.')
      setState({...state, needsApproval: false})
    } else {
      toast.info('Approval transaction has been sent.')
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

    if(tx === null) {
      toast.error('Couldn\'t send your swap.')
    }

    toast(<SwapNotification hash={tx?.id as string} />, {autoClose: false})
  }

  const SwapNotification = (props: {hash: string}) => (
    <div className="flex flex-col text-center text-black dark:text-white">
      <div className="flex items-center gap-2">
        <div className="bg-primary dark:bg-gray-700 h-6 w-6 md:w-10 md:h-10 p-1 md:p-3 rounded-full flex items-center justify-center">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="transactions-type" xmlns="http://www.w3.org/2000/svg"><path d="M131.3 231.1L32 330.6l99.3 99.4v-74.6h174.5v-49.7H131.3v-74.6zM480 181.4L380.7 82v74.6H206.2v49.7h174.5v74.6l99.3-99.5z"></path></svg>
        </div>
        <div className="flex flex-col items-start">
          <div className="inline-flex items-center gap-1 font-medium">
            <span className="w-4 h-4 inline-block">
              <TokenIcon url={tokenIn.icon} />
            </span> 
            <span className="font-medium">{cryptoFormat(state.tokenInAmount.toNumber())} {tokenIn.symbol}</span>
          </div> 
          <div className="inline-flex items-center gap-1 font-medium">
            <span className="w-4 h-4 inline-block">
              <TokenIcon url={tokenOut.icon} />
            </span> 
            {cryptoFormat(state.tokenOutAmount.toNumber())} {tokenOut.symbol}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 text-xs mt-2 text-gray-500 dark:text-gray-400">
        <div className="flex-grow text-left">0x{shortenAddress(props.hash)}</div>
        <div className="text-right">Processing</div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mt-1">
        <button className="bg-gray-100 rounded font-medium py-2" onClick={() => navigator.clipboard.writeText('0x'+props.hash)}>Copy hash</button>
        <a className="bg-gray-100 rounded font-medium py-2" href={`https://viewblock.io/zilliqa/tx/0x${props.hash}`} target="_blank">ViewBlock</a>
      </div>
    </div>
  )

  let tokenInValue = tokenIn?.symbol === 'ZIL' ? selectedCurrency.rate : tokenIn?.market_data.rate * selectedCurrency.rate

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