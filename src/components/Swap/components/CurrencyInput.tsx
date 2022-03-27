import BigNumber from 'bignumber.js'
import TokenIcon from 'components/TokenIcon'
import React from 'react'
import { ChevronDown } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { openCurrency } from 'store/modal/actions'
import { updateSwap } from 'store/swap/actions'
import { Currency, CurrencyState, RootState, Token } from 'store/types'
import { cryptoFormat, currencyFormat, fieldFormat, numberFormat } from 'utils/format'
import { toBigNumber } from 'utils/useMoneyFormatter'

interface Props {
  selectedToken: Token|null
  amount: BigNumber,
  onAmountChange: ((amount: BigNumber) => void)
  isFocus: boolean,
  isIn?: boolean
  expectedSlippage?: BigNumber,
  className?: string
}

const CurrencyInput = (props: Props) => {
  const { selectedToken, amount, onAmountChange, isFocus, expectedSlippage } = props

  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!
  const dispatch = useDispatch()

  const fiatValue = (): BigNumber => {
    if(amount.isZero()) return new BigNumber(0)
    if(selectedToken?.symbol === 'ZIL') return amount.times(selectedCurrency.rate)
    return amount.times(selectedToken?.market_data.rate_zil ?? 1).times(selectedCurrency.rate)
  }

  return (
    <div className={`bg-gray-100 dark:bg-gray-900 rounded-lg flex flex-col py-4 px-5 ${props.className ?? ''}`}>
      <div className="flex items-center gap-2">
        <div>
          <button 
            className="bg-white hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 py-2 px-3 rounded-full font-semibold flex items-center"
            onClick={() => {
              dispatch(openCurrency(true))
              dispatch(updateSwap({
                selectedDirection: props.isIn === true ? "in" : "out"
              }))
            }}
          >
            {selectedToken ? (
              <>
                <div className="w-5 h-5 mr-2"><TokenIcon address={selectedToken.address} /></div>
                {selectedToken.symbol}
              </>
            ) : (
              <span>Select a token</span>
            )}
            <ChevronDown size={16} strokeWidth={3} className="ml-1" />
          </button>
        </div>
        <div className="flex-grow flex flex-col items-right">
          <input 
            className="bg-transparent w-full pr-0 text-2xl text-right font-semibold focus:outline-none border-none focus:ring-0 input-arrows-hidden" 
            placeholder="0.0"
            value={amount.isZero() ? undefined : (isFocus ? amount.toNumber() : fieldFormat(amount.toNumber(), selectedToken?.decimals))}
            onChange={(e) => onAmountChange(toBigNumber(e.target.value))}
            type="number"
          />
        </div>
      </div>
      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="mt-2 flex-grow">
          <button 
            className="bg-none border-none outline-none focus:outline-none"
            onClick={() => onAmountChange(selectedToken?.balance?.shiftedBy(-selectedToken.decimals) ?? new BigNumber(0))}
          >
            Balance: {cryptoFormat(selectedToken?.balance?.shiftedBy(-selectedToken.decimals).toNumber() ?? 0)}
          </button>
        </div>
        <div className="mt-2">
          ~ {currencyFormat(fiatValue().toNumber(), selectedCurrency.symbol)} 
          {expectedSlippage && 
            <span className={`ml-1 
              ${expectedSlippage.isLessThanOrEqualTo(0.5) && 'text-green-500'}
              ${expectedSlippage.isGreaterThan(0.5) && expectedSlippage.isLessThan(3) && 'text-yellow-500'}
              ${expectedSlippage.isGreaterThanOrEqualTo(3) && 'text-red-500'}
            `}>
              (-{numberFormat(expectedSlippage.toNumber())}%)
            </span>
          }
        </div>
      </div>
    </div>
  )
}

export default CurrencyInput