import BigNumber from 'bignumber.js'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { prependOnceListener } from 'node:process'
import React from 'react'
import { Operator, TokenInfo } from 'store/types'
import { SimpleRate } from 'types/rate.interface'
import { BIG_ZERO } from 'utils/strings'
import { toBigNumber } from 'utils/useMoneyFormatter'

const ReactApexChart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)

interface Props {
  tokens: TokenInfo[]
  operators: Operator[]
}

function BalanceDonut(props: Props) {
  const {theme, setTheme, resolvedTheme} = useTheme()

  interface TokenTotal {
    name: string
    symbol: string
    address: string
    isZil: boolean
    totalBalance: BigNumber
  }
  var tokenTotals: TokenTotal[] = []
  var zilTotal = new BigNumber(0)

  props.tokens.forEach(token => {
    let balance = toBigNumber(token.balance).shiftedBy(-token.decimals)
    var total = new BigNumber(0)

    if(token.isZil) {
      zilTotal = zilTotal.plus(balance)
    } else {  
      total = total.plus(balance.times(token.rate))
    }

    if(token.pool && token.pool.userContribution) {
      let contributionPercentage = token.pool.userContribution.dividedBy(token.pool.totalContribution).times(100)
      let contributionShare = contributionPercentage.shiftedBy(-2)
      let zilAmount = contributionShare?.times(token.pool?.zilReserve ?? BIG_ZERO)
      let tokenAmount = contributionShare.times(token.pool?.tokenReserve ?? BIG_ZERO)

      total = total.plus(tokenAmount.times(token.rate).shiftedBy(-token.decimals))
      zilTotal = zilTotal.plus(zilAmount.shiftedBy(-12))
    }

    props.operators.filter(operator => operator.symbol === token.symbol).forEach(operator => {
      if(operator.symbol !== 'ZIL') {
        let staked = toBigNumber(operator.staked, {compression: operator.decimals})
        total = total.plus(staked.times(token.rate))
      }
    })

    if(!token.isZil) {
      tokenTotals.push({
        name: token.name,
        symbol: token.symbol,
        address: token.address_bech32,
        isZil: false,
        totalBalance: total
      })
    }
  })

  props.operators.forEach(operator => {
    if(operator.symbol === 'ZIL') {
      let staked = toBigNumber(operator.staked, {compression: 12})
      zilTotal = zilTotal.plus(staked)
    }
  })

  tokenTotals.push({
    name: "Zilliqa",
    symbol: "ZIL",
    address: "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz",
    isZil: true,
    totalBalance: zilTotal
  })

  let filteredTokens = tokenTotals.filter(token => {
    return token.totalBalance !== null && token.totalBalance !== undefined && !toBigNumber(token.totalBalance).isZero()
  })

  filteredTokens.sort((a, b) => {
    return (a.totalBalance.isLessThan(b.totalBalance)) ? 1 : -1
  })

  let series = filteredTokens.map(token => {
    return token.totalBalance.toNumber()
  })

  let totalBalance = series.reduce((sum, current) => {
    return sum + current
  }, 0)

  let options: ApexCharts.ApexOptions = {
    chart: {
      id: `donut-${Math.random()}`,
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
    states: {
      active: {
        filter: {
          type: 'none'
        }
      }
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          labels: {
            show: true,
            name: {
              color: resolvedTheme === 'dark' ? '#fff' : '#000',
              fontWeight: 700
            },
            value: {
              fontSize: '14px',
              color: resolvedTheme === 'dark' ? '#fefefe' : '#333',
              offsetY: -6,
              formatter: function(val) {
                return Number(val).toFixed(2)
              }
            }
          }
        }
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