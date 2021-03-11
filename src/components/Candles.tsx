import React, { useEffect, useLayoutEffect } from 'react'
import { createChart, IChartApi, Time, UTCTimestamp } from 'lightweight-charts'
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
  const ref = React.useRef<HTMLDivElement | null>(null)
  var chart: IChartApi|null = null;

  useEffect(() => {
    if(ref.current) {
      chart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: ref.current.clientHeight,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          textColor: '#838383',
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
      console.log(data)
      candleSeries.setData(data)

      chart.timeScale().fitContent()
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

  return (
    <>
      <div ref={ref} className="h-full" />
    </>
  )
}

export default Candles