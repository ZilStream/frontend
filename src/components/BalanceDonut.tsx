import BigNumber from 'bignumber.js'
import dynamic from 'next/dynamic'
import React from 'react'
import { TokenInfo } from 'store/types'
import { SimpleRate } from 'types/rate.interface'
import { toBigNumber } from 'utils/useMoneyFormatter'

const ReactApexChart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)

interface Props {
  tokens: TokenInfo[]
  latestRates: SimpleRate[]
}

function BalanceDonut(props: Props) {
  let filteredTokens = props.tokens.filter(token => {
    return token.balance !== null && token.balance !== undefined && !toBigNumber(token.balance).isZero()
  })

  let totalBalance = props.tokens.reduce((sum, current) => {
    let balance = toBigNumber(current.balance, {compression: current.decimals})

    if(current.isZil) return sum.plus(balance)

    let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == current.address_bech32)[0].rate : 0
    return sum.plus(balance.times(rate))
  }, new BigNumber(0))

  let series = filteredTokens.map(token => {
    let balance = toBigNumber(token.balance)
    if(token.isZil) return balance.shiftedBy(-token.decimals).toNumber()
    let rate = (Array.isArray(props.latestRates)) ? props.latestRates.filter(rate => rate.address == token.address_bech32)[0].rate : 0
    return balance.times(rate).shiftedBy(-token.decimals).toNumber()
  })

  let options: ApexCharts.ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: filteredTokens.map(token => token.symbol),
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: 'bottom',
      formatter: function(val: string, opts: any) {
        const balance = toBigNumber(opts.w.globals.series[opts.seriesIndex])
        return val + ': ' + balance.dividedBy(totalBalance).times(100).toFixed(2) + '%'
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        }
      }
    }]
  }
  
  return (
    <div id="chart" className="py-6 mb-4">
      <ReactApexChart options={options} series={series} type="donut" />
    </div>
  )
}

export default BalanceDonut