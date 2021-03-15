import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createChart, CrosshairMode, IChartApi, ISeriesApi, Time, UTCTimestamp } from 'lightweight-charts'
import { Rate } from 'shared/rate.interface';
import { Token } from 'shared/token.interface';

interface Props {
  token: Token
  data: Rate[]
}

interface CandleDataPoint {
  time: Time
  low: number
  high: number
  open: number
  close: number
}

function Candles(props: Props) {
  const [rates, setRates] = useState(props.data)
  const [currentRate, setCurrentRate] = useState<CandleDataPoint | null>(null);
  const [currentInterval, setCurrentInterval] = useState('1h');

  const ref = React.useRef<HTMLDivElement | null>(null)
  var chart: IChartApi|null = null;
  var series: ISeriesApi<"Candlestick">|null = null;

  useEffect(() => {    
    if(ref.current) {
      chart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: ref.current.clientHeight,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          textColor: '#eeeeee',
        },
        grid: {
          vertLines: {
            color: 'rgba(220, 220, 220, 0.1)',
            style: 1,
            visible: true,
          },
          horzLines: {
            color: 'rgba(220, 220, 220, 0.1)',
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
        }
      })

      series = chart?.addCandlestickSeries()

      series.setData(prepareData(rates))

      chart?.timeScale().fitContent()

      chart.subscribeCrosshairMove((param) => {
        if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > ref.current.clientWidth || param.point.y < 0 || param.point.y > ref.current?.clientHeight ) {
          // reset
        } else {
          // set
          let rate: CandleDataPoint = param.seriesPrices.get(series) as CandleDataPoint
          rate.time = param.time
          updateLegend(rate)
        }
      })
    }
  }, [rates])

  useLayoutEffect(() => {
    function updateSize() {
      if(ref.current) {
        chart?.resize(ref.current.clientWidth, ref.current.clientHeight)
        chart?.timeScale().fitContent()
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  })

  function prepareData(providedRates: Rate[]): CandleDataPoint[] {
    var data: CandleDataPoint[] = [];

    providedRates.forEach(rate => {
      data.push({
        time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
        low: rate.low,
        high: rate.high,
        open: rate.open,
        close: rate.close,
      })
    })

    data.sort((a,b) => (a.time > b.time) ? 1 : -1)
    return data
  }

  function updateLegend(rate: CandleDataPoint | null) {
    setCurrentRate(rate)
  }

  function setChartToInterval(interval: string) {
    setCurrentInterval(interval)
    fetch(`https://api.zilstream.com/rates/${props.token.symbol}?interval=${interval}`)
      .then(response => response.json())
      .then(data => {
        const newRates: Rate[] = data
        series?.setData(prepareData(newRates))
        chart?.timeScale().fitContent()
      })
  }

  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <span className="uppercase text-xs text-gray-500 mr-3">Currency</span>
        <button className="py-1 px-2 rounded-lg bg-gray-600 text-gray-200 text-sm shadow font-bold">ZIL</button>
        <button className="py-1 px-2 rounded-lg bg-gray-800 text-gray-400 text-sm ml-1 font-medium mr-6">USD</button>

        <span className="uppercase text-xs text-gray-500 mr-3">Time</span>
        <button 
          onClick={() => setChartToInterval('1d')}
          className={`py-1 px-2 rounded-lg text-sm shadow mr-1 focus:outline-none hover:bg-gray-600 hover:text-gray-400 ${(currentInterval == '1d') ? 'text-gray-200 font-bold  bg-gray-600' : 'text-gray-400 font-medium  bg-gray-800'}`}>1D</button>
        <button 
          onClick={() => setChartToInterval('4h')}
          className={`py-1 px-2 rounded-lg text-sm shadow mr-1 focus:outline-none hover:bg-gray-600 hover:text-gray-400 ${(currentInterval == '4h') ? 'text-gray-200 font-bold  bg-gray-600' : 'text-gray-400 font-medium  bg-gray-800'}`}>4H</button>
        <button 
          onClick={() => setChartToInterval('1h')}
          className={`py-1 px-2 rounded-lg text-sm shadow mr-1 focus:outline-none hover:bg-gray-600 hover:text-gray-400 ${(currentInterval == '1h') ? 'text-gray-200 font-bold  bg-gray-600' : 'text-gray-400 font-medium  bg-gray-800'}`}>1H</button>
        <button
          onClick={() => setChartToInterval('15m')}
          className={`py-1 px-2 rounded-lg text-sm shadow mr-1 focus:outline-none hover:bg-gray-600 hover:text-gray-400 ${(currentInterval == '15m') ? 'text-gray-200 font-bold  bg-gray-600' : 'text-gray-400 font-medium  bg-gray-800'}`}>15M</button>
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