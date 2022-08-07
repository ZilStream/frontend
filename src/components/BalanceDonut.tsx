import BigNumber from 'bignumber.js'
import { ZIL_ADDRESS } from 'lib/constants'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import React from 'react'
import { useSelector } from 'react-redux'
import { CollectionState, Operator, RootState, Token, TokenState } from 'store/types'
import { BIG_ZERO } from 'utils/strings'
import { toBigNumber } from 'utils/useMoneyFormatter'

const ReactApexChart = dynamic(
  () => import('react-apexcharts'),
  { ssr: false }
)

interface Props {
  tokens: Token[]
  operators: Operator[]
}

function BalanceDonut(props: Props) {
  const {theme, setTheme, resolvedTheme} = useTheme()
  const tokenState = useSelector<RootState, TokenState>(state => state.token)
  const collectionState = useSelector<RootState, CollectionState>(state => state.collection)

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
      total = total.plus(balance.times(token.market_data.rate_zil))
    }
  
    if(token.pools) {
      token.pools.forEach(pool => {
        if(!pool.userContribution || !pool.totalContribution) return
        let contributionPercentage = pool.userContribution.dividedBy(pool.totalContribution).times(100)
        let contributionShare = contributionPercentage.shiftedBy(-2)
        let quoteAmount = contributionShare?.times(pool.quoteReserve ?? BIG_ZERO)
        let baseAmount = contributionShare.times(pool.baseReserve ?? BIG_ZERO)

        if(!baseAmount.isNaN() && !quoteAmount.isNaN()) {
          const baseToken = tokenState.tokens.filter(token => token.address === pool.baseAddress)?.[0]
          const quoteToken = tokenState.tokens.filter(token => token.address === pool.quoteAddress)?.[0]

          const baseIndex = tokenTotals.findIndex(token => token.address === baseToken.address)
          if(baseIndex === -1) {
            tokenTotals.push({
              name: baseToken.name,
              symbol: baseToken.symbol,
              address: baseToken.address,
              isZil: baseToken.isZil,
              totalBalance: baseAmount.shiftedBy(-baseToken.decimals).times(baseToken.isZil ? 1 : baseToken.market_data.rate_zil)
            })
          } else {
            const current = tokenTotals[baseIndex]
            tokenTotals[baseIndex].totalBalance = current.totalBalance.plus(baseAmount.shiftedBy(-baseToken.decimals).times(baseToken.isZil ? 1 : baseToken.market_data.rate_zil))
          }

          const quoteIndex = tokenTotals.findIndex(token => token.address === quoteToken.address)
          if(quoteIndex === -1) {
            tokenTotals.push({
              name: quoteToken.name,
              symbol: quoteToken.symbol,
              address: quoteToken.address,
              isZil: quoteToken.isZil,
              totalBalance: quoteAmount.shiftedBy(-quoteToken.decimals).times(quoteToken.isZil ? 1 : quoteToken.market_data.rate_zil)
            })
          } else {
            const current = tokenTotals[quoteIndex]
            tokenTotals[quoteIndex].totalBalance = current.totalBalance.plus(quoteAmount.shiftedBy(-quoteToken.decimals).times(quoteToken.isZil ? 1 : quoteToken.market_data.rate_zil))
          }
        }
      })
    }

    props.operators.filter(operator => operator.symbol === token.symbol).forEach(operator => {
      if(operator.symbol !== 'ZIL') {
        let staked = toBigNumber(operator.staked, {compression: operator.decimals})
        if(!staked.isNaN()) {
          total = total.plus(staked.times(token.market_data.rate_zil))
        }        
      }
    })

    if(!token.isZil) {
      const index = tokenTotals.findIndex(t => t.address === token.address)
      if(index === -1) {
        tokenTotals.push({
          name: token.name,
          symbol: token.symbol,
          address: token.address,
          isZil: false,
          totalBalance: total
        })
      } else {
        const current = tokenTotals[index]
        tokenTotals[index].totalBalance = current.totalBalance.plus(total)
      }
    }
  })

  props.operators.forEach(operator => {
    if(operator.symbol === 'ZIL') {
      let staked = toBigNumber(operator.staked, {compression: 12})
      zilTotal = zilTotal.plus(staked)
    }
  })

  var nftTotal = new BigNumber(0)
  collectionState.collections.filter(collection => collection.tokens && collection.tokens.length > 0).forEach(collection => {
    nftTotal = nftTotal.plus(collection.tokens!.length * collection.market_data.floor_price)
  })

  if(nftTotal.gt(0)) {
    tokenTotals.push({
      name: 'NFTs',
      symbol: 'NFTs',
      address: 'NFTs',
      isZil: false,
      totalBalance: nftTotal
    })
  }

  const zilIndex = tokenTotals.findIndex(token => token.address === ZIL_ADDRESS)
  if(zilIndex === -1) {
    tokenTotals.push({
      name: "Zilliqa",
      symbol: "ZIL",
      address: "zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz",
      isZil: true,
      totalBalance: zilTotal
    })
  } else {
    const current = tokenTotals[zilIndex]
    tokenTotals[zilIndex].totalBalance = current.totalBalance.plus(zilTotal)
  }

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