import React from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'types/rate.interface'
import { Token } from 'store/types'
import InlineChange from './InlineChange'

const Chart = dynamic(
  () => import('components/Chart'),
  { ssr: false }
)

interface Props {
  title: string,
  value: string,
  subTitle?: string,
  token: Token,
  rates: Rate[],
}

const RatesBlock = (props: Props) => {
  const sortedRates = props.rates ? props.rates.sort((a,b) => (a.time < b.time) ? 1 : -1) : []
  const lastRate = sortedRates && sortedRates.length > 0 ? sortedRates[0].value : 0
  const firstRate = sortedRates && sortedRates.length > 0 ? sortedRates[sortedRates.length-1].value : 0

  const change = ((lastRate - firstRate) / firstRate) * 100
  const changeRounded = Math.round(change * 100) / 100
  
  return (
    <div className="h-44 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="absolute top-0 left-0 w-full pt-2 px-3">
        <div className="flex items-center text-lg">
          <div className="flex-grow flex items-center">
            <span className="font-semibold mr-2">{props.title}</span>
            <span className="mr-2">{props.value}</span>
          </div>
          <InlineChange num={changeRounded} bold />
        </div>
        <div>
          <span className="text-gray-400">{props.subTitle}</span>
        </div>
      </div>
      <div className="h-full w-full pt-10">
        <Chart data={sortedRates} isUserInteractionEnabled={false} isScalesEnabled={false} />
      </div>
    </div>
  )
}

export default RatesBlock