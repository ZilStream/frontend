import getTVL from 'lib/zilstream/getTVL'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Currency, CurrencyState, RootState, TokenState } from 'store/types'
import { cryptoFormat, currencyFormat } from 'utils/format'
import InlineChange from './InlineChange'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  className?: string
}

const TVLChartBlock = (props: Props) => {
  const { className } = props
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const currencyState = useSelector<RootState, CurrencyState>(state => state.currency)
  const [tvl, setTVL] = useState<{time: string, value: number}[]>([])
  const selectedCurrency: Currency = currencyState.currencies.find(currency => currency.code === currencyState.selectedCurrency)!

  const liquidity = tokenState.tokens.reduce((sum, current) => {
    return sum + current.market_data.current_liquidity_zil
  }, 0)

  useEffect(() => {
    fetchTVL()
  }, [])

  const fetchTVL = async () => {
    const response = await getTVL()
    response.sort((a,b) =>  new Date(a.time).getTime()  -  new Date(b.time).getTime())
    setTVL(response)
  }  

  const firstRate = tvl.length > 0 ? tvl[0].value : 0
  const lastRate = tvl.length > 0 ? tvl[tvl.length-1].value : 0

  const change = ((lastRate - firstRate) / firstRate) * 100

  return (
    <div className={`rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col ${className ?? 'h-48'}`}>
      <div className="absolute top-0 left-0 w-full pt-2 px-3">
        <div className="flex items-center text-lg">
          <div className="flex-grow flex items-center">
            <span className="font-semibold mr-2 flex items-center">TVL <span className="hidden sm:inline px-1 ml-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-400 rounded">30d</span></span>
            <span className="mr-2">{currencyFormat(liquidity * selectedCurrency.rate, selectedCurrency.symbol, 0)}</span>
          </div>
          {!isNaN(change) &&
            <InlineChange num={change} bold />
          }
        </div>
        <div>
          <span className="text-gray-400">{cryptoFormat(liquidity, 0)} ZIL</span>
        </div>
      </div>
      <div className="h-full w-full pt-10">
        {tvl.length > 0 &&
          <Chart data={tvl} isUserInteractionEnabled={false} isScalesEnabled={false} />
        }
      </div>
    </div>
  )
}

export default TVLChartBlock