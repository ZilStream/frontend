import React, { useEffect, useLayoutEffect } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'

function Chart() {
  const ref = React.useRef<HTMLDivElement | null>(null)
  var chart: IChartApi|null = null;

  useEffect(() => {
    if(ref.current) {
      chart = createChart(ref.current, { 
        width: ref.current.clientWidth, 
        height: 220,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          // textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0.05)',
          },
        },
        leftPriceScale: {
          visible: false,
        },
        rightPriceScale: {
          visible: false,
          borderVisible: false,
        },
        timeScale: {
          visible: false,
          borderVisible: false,
        },
        crosshair: {
          horzLine: {
            visible: false,
          },
        },
      })

      const series = chart.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
      });
      series.setData([
        { time: '2019-04-11', value: 80.01 },
        { time: '2019-04-12', value: 96.63 },
        { time: '2019-04-13', value: 76.64 },
        { time: '2019-04-14', value: 81.89 },
        { time: '2019-04-15', value: 74.43 },
        { time: '2019-04-16', value: 80.01 },
        { time: '2019-04-17', value: 96.63 },
        { time: '2019-04-18', value: 76.64 },
        { time: '2019-04-19', value: 81.89 },
        { time: '2019-04-20', value: 74.43 },
      ])
    }
  }, [])

  useLayoutEffect(() => {
    function updateSize() {
      if(ref.current) {
        chart?.resize(ref.current.clientWidth, 220)
      }
    }
    window.addEventListener('resize', updateSize)
    updateSize()
    return () => window.removeEventListener('resize', updateSize)
  })

  return (
    <div className="rounded-lg overflow-hidden p-2 bg-white dark:bg-gray-800">
      <div ref={ref} />
    </div>
  )
}

export default Chart