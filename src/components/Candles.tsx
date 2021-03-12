import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createChart, CrosshairMode, IChartApi, Time, UTCTimestamp } from 'lightweight-charts'
import { Rate } from 'shared/rate.interface';

interface Props {
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
  const [currentRate, setCurrentRate] = useState<CandleDataPoint | null>(null);

  const ref = React.useRef<HTMLDivElement | null>(null)
  var chart: IChartApi|null = null;

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
      
      var data: CandleDataPoint[] = [];

      props.data.forEach(rate => {
        data.push({
          time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
          low: rate.low,
          high: rate.high,
          open: rate.open,
          close: rate.close,
        })
      })

      data.sort((a,b) => (a.time > b.time) ? 1 : -1)

      const candleSeries = chart.addCandlestickSeries()
      
      candleSeries.setData(data)

      chart.timeScale().fitContent()

      chart.subscribeCrosshairMove((param) => {
        if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > ref.current.clientWidth || param.point.y < 0 || param.point.y > ref.current?.clientHeight ) {
          // reset
        } else {
          // set
          console.log(param.seriesPrices.get(candleSeries))
          let rate: CandleDataPoint = param.seriesPrices.get(candleSeries) as CandleDataPoint
          rate.time = param.time
          updateLegend(rate)
        }
      })
    }
  }, [props.data])

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

  function updateLegend(rate: CandleDataPoint | null) {
    setCurrentRate(rate)
  }

  return (
    <>
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
    </>
  )
}

export default Candles