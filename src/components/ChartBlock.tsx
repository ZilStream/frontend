import React from 'react'
import dynamic from 'next/dynamic'
import { Rate } from 'shared/rate.interface'
import { Token } from 'shared/token.interface'

const Chart = dynamic(
    () => import('components/Chart'),
    { ssr: false }
  )

interface Props {
    token: Token,
    rates: Rate[],
}

const RatesBlock = (props: Props) => {
    const lastRate = props.rates[props.rates.length -1].value
    const lastRateRounded = Math.round(lastRate * 100) / 100
    return (
        <div className="rounded-lg overflow-hidden p-2 bg-white dark:bg-gray-800 relative">
            <div className="absolute top-2 left-4">
                <div className="text-xl">
                    <span className="font-medium mr-2">{props.token.symbol}</span>
                    <span>{lastRateRounded}</span>
                </div>
                <div className="text-xs text-gray-300">Liq 12121212</div>
            </div>
            <Chart data={props.rates} />
        </div>
    )
}

export default RatesBlock