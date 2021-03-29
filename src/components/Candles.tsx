import React, { useEffect, useState } from 'react'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, Time, UTCTimestamp } from 'lightweight-charts'
import { Rate } from 'types/rate.interface';
import { TokenDetail } from 'types/token.interface';
import { useTheme } from 'next-themes';
import getRatesForToken from 'lib/zilstream/getRatesForToken';

interface Props {
  token: TokenDetail
  data: Rate[]
  zilRate: Rate
}

interface CandleDataPoint {
  time: Time
  low: number
  high: number
  open: number
  close: number
}

function Candles(props: Props) {
  const {resolvedTheme} = useTheme()

  const [rates, setRates] = useState(props.data)
  const [currentRate, setCurrentRate] = useState<CandleDataPoint | null>(null)
  const [currentInterval, setCurrentInterval] = useState('1h')
  const [currentPeriod, setCurrentPeriod] = useState('7d')
  const [currency, setCurrency] = useState('ZIL')

  const [chart, setChart] = useState<IChartApi|null>(null)
  const [series, setSeries] = useState<ISeriesApi<"Candlestick">|null>(null)

  const ref = React.useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if(ref.current) {
      const newChart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: ref.current.clientHeight,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          textColor: resolvedTheme === 'dark' ? '#eeeeee' : '#888888',
        },
        grid: {
          vertLines: {
            color: resolvedTheme === 'dark' ? 'rgba(220, 220, 220, 0.1)' : 'rgba(220, 220, 220, 0.8)',
            style: 1,
            visible: true,
          },
          horzLines: {
            color: resolvedTheme === 'dark' ? 'rgba(220, 220, 220, 0.1)' : 'rgba(220, 220, 220, 0.8)',
            style: 1,
            visible: true,
          },
        },
        timeScale: {
          rightOffset: 10,
          lockVisibleTimeRangeOnResize: true,
          timeVisible: true,
          secondsVisible: false,
        },
        crosshair: {
          mode: CrosshairMode.Normal,
        },
      })

      const newSeries = newChart.addCandlestickSeries({
        priceFormat: {
          precision: rates?.[0].low < 0.01 ? 5 : 2,
          minMove: rates?.[0].low < 0.01 ? 0.00001 : 0.01
        }
      })

      newSeries.setData(prepareData(rates))

      newChart.subscribeCrosshairMove((param) => {
        if(!param) {
          updateLegend(null)
        } else if (!param.time || !param.point || !ref.current || param.point.x < 0 || param.point.x > ref.current.clientWidth || param.point.y < 0 || param.point.y > ref.current?.clientHeight) {
          // reset
          updateLegend(null)
        } else {
          // set
          let rate: CandleDataPoint = param.seriesPrices.get(newSeries) as unknown as CandleDataPoint
          rate.time = param.time
          updateLegend(rate)
        }
      })

      setChart(newChart)
      setSeries(newSeries)
      setSizeListener()
      setVisibleRange()
    }
  }, [])

  useEffect(() => {
    series?.setData(prepareData(rates))
  }, [currency])

  useEffect(() => {
    if(!chart) return
    const chartOptions = chart.options()
    chartOptions.layout.textColor = resolvedTheme === 'dark' ? '#eeeeee' : '#888888'
    chartOptions.grid.vertLines.color = resolvedTheme === 'dark' ? 'rgba(220, 220, 220, 0.1)' : 'rgba(220, 220, 220, 0.8)'
    chartOptions.grid.horzLines.color = resolvedTheme === 'dark' ? 'rgba(220, 220, 220, 0.1)' : 'rgba(220, 220, 220, 0.8)'
    chart.applyOptions(chartOptions)
  }, [resolvedTheme])

  useEffect(() => {
    getRatesForToken(props.token.symbol, currentInterval, currentPeriod).then(data => {
      setRates(data)
      series?.setData(prepareData(data))
      setVisibleRange()
    })
  }, [currentInterval, currentPeriod])

  function setSizeListener() {
    window.addEventListener('resize', updateSize)
  }

  function removeSizeListener() {
    window.removeEventListener('resize', updateSize)
  }

  function updateSize() {
    if(ref.current) {
      chart?.resize(ref.current.clientWidth, ref.current.clientHeight)
      setVisibleRange()
    }
  }

  function setVisibleRange() {
    var numberOfDays = 1

    if(currentInterval == "1h") {
      numberOfDays = 7
    } else if(currentInterval == "4h") {
      numberOfDays = 12
    } else if(currentInterval == "1d") {
      numberOfDays = 60
    }

    chart?.timeScale().setVisibleRange({
      from: ((new Date()).getTime() / 1000) - (numberOfDays*24*60*60) as UTCTimestamp,
      to: (new Date()).getTime() / 1000 as UTCTimestamp,
    })
  }

  function prepareData(providedRates: Rate[]): CandleDataPoint[] {
    var data: CandleDataPoint[] = [];

    if(!Array.isArray(providedRates)) { return [] }
    
    providedRates.forEach(rate => {
      if(currency === 'USD') {
        data.push({
          time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
          low: rate.low * props.zilRate.value,
          high: rate.high * props.zilRate.value,
          open: rate.open * props.zilRate.value,
          close: rate.close * props.zilRate.value,
        })
      } else {
        data.push({
          time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
          low: rate.low,
          high: rate.high,
          open: rate.open,
          close: rate.close,
        })
      }
    })

    data.sort((a,b) => (a.time > b.time) ? 1 : -1)
    return data
  }

  function updateLegend(rate: CandleDataPoint | null) {
    setCurrentRate(rate)
  }

  function setChartToInterval(interval: string, period: string = '7d') {
    setCurrentInterval(interval)
    setCurrentPeriod(period)
  }

  function setChartToCurrency(newCurrency: string) {
    setCurrency(newCurrency)
  }

  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <span className="uppercase text-xs text-gray-500 mr-3">Currency</span>
        <button 
          onClick={() => setChartToCurrency('ZIL')}
          className={`chart-btn ${(currency == 'ZIL' ? 'chart-btn-selected' : 'chart-btn-unselected')}`}>ZIL</button>
        <button 
          onClick={() => setChartToCurrency('USD')}
          className={`chart-btn ${(currency == 'USD' ? 'chart-btn-selected' : 'chart-btn-unselected')}`}>USD</button>

        <span className="uppercase text-xs text-gray-500 mx-3">Time</span>
        <button 
          onClick={() => setChartToInterval('1d', '8w')}
          className={`chart-btn ${(currentInterval == '1d') ? 'chart-btn-selected' : 'chart-btn-unselected'}`}>1D</button>
        <button 
          onClick={() => setChartToInterval('4h', '4w')}
          className={`chart-btn ${(currentInterval == '4h') ? 'chart-btn-selected' : 'chart-btn-unselected'}`}>4H</button>
        <button 
          onClick={() => setChartToInterval('1h', '2w')}
          className={`chart-btn ${(currentInterval == '1h') ? 'chart-btn-selected' : 'chart-btn-unselected'}`}>1H</button>
        <button
          onClick={() => setChartToInterval('15m', '1w')}
          className={`chart-btn ${(currentInterval == '15m') ? 'chart-btn-selected' : 'chart-btn-unselected'}`}>15M</button>
      </div>
      <div className="h-80 md:h-96 lg:h-144 rounded-lg overflow-hidden p-2 shadow-md bg-white dark:bg-gray-800 relative">
        {currentRate&&
          <div className="absolute top-4 left-4 right-4 flex items-center text-sm">
            <div className="mr-2">
              <span className="mr-1">O</span>
              <span className={currentRate.close >= currentRate.open ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>{currentRate.open.toFixed(2)}</span>
            </div>
            <div className="mr-2">
              <span className="mr-1">H</span>
              <span className={currentRate.close >= currentRate.open ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>{currentRate.high.toFixed(2)}</span>
            </div>
            <div className="mr-2">
              <span className="mr-1">L</span>
              <span className={currentRate.close >= currentRate.open ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>{currentRate.low.toFixed(2)}</span>
            </div>
            <div className="mr-2">
              <span className="mr-1">C</span>
              <span className={currentRate.close >= currentRate.open ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}>{currentRate.close.toFixed(2)}</span>
            </div>
          </div>
        }
        
        <div ref={ref} className="h-full" />
      </div>
    </>
  )
}

export default Candles