import React, { useEffect, useLayoutEffect } from 'react'
import { createChart, IChartApi, Time, UTCTimestamp } from 'lightweight-charts'
import { Rate } from 'shared/rate.interface';

interface Props {
  data: Rate[]
}

interface ChartDataPoint {
  time: Time,
  value: number,
}

function Chart(props: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  var chart: IChartApi|null = null;

  useEffect(() => {
    if(ref.current) {
      chart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: 220,
        handleScroll: false,
        handleScale: false,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          // textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            color: 'rgba(42, 46, 57, 0.02)',
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
      
      var data: ChartDataPoint[] = [];

      props.data.forEach(rate => {
        data.push({
          time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
          value: rate.value
        })
      })

      const series = chart.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
        autoscaleInfoProvider: () => ({
          priceRange: {
              minValue: Math.min(...data.map(item => item.value)),
              maxValue: Math.max(...data.map(item => item.value)),
          },
        }),
      });

      series.setData(data)

      chart.timeScale().fitContent()
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
    <>
      <div ref={ref} />
    </>
  )
}

export default Chart