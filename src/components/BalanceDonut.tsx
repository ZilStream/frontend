import BigNumber from 'bignumber.js'
import { useTheme } from 'next-themes'
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
  const {theme, setTheme, resolvedTheme} = useTheme()

  let filteredTokens = props.tokens.filter(token => {
    return token.balance !== null && token.balance !== undefined && !toBigNumber(token.balance).isZero()
  })

  let zilRate = props.latestRates.filter(rate => rate.address == 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz')[0].rate

  filteredTokens.sort((a, b) => {
    const priorTokenRate = props.latestRates.filter(rate => rate.address == a.address_bech32)[0]
    const priorBalance = toBigNumber(a.balance, {compression: a.decimals})
    const priorZilRate = a.isZil ? priorBalance : priorBalance.times(priorTokenRate.rate)
    const priorUsdRate = priorZilRate.times(zilRate)

    const nextTokenRate = props.latestRates.filter(rate => rate.address == b.address_bech32)[0]
    const nextBalance = toBigNumber(b.balance, {compression: b.decimals})
    const nextZilRate = b.isZil ? nextBalance : nextBalance.times(nextTokenRate.rate)
    const nextUsdRate = nextZilRate.times(zilRate)
    
    return (priorUsdRate.isLessThan(nextUsdRate)) ? 1 : -1
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
    tooltip: {
      enabled: false
    },
    legend: {
      position: 'bottom',
      fontFamily: 'inherit',
      fontSize: '12px',
      labels: {
        colors: resolvedTheme === 'dark' ? ['#fefefe'] : ['#333']
      },
      markers: {
        width: 8,
        height: 8
      },
      formatter: function(val: string, opts: any) {
        const balance = toBigNumber(opts.w.globals.series[opts.seriesIndex])
        return val + ': ' + balance.dividedBy(totalBalance).times(100).toFixed(2) + '%'
      }
    },
    stroke: {
      width: 0
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