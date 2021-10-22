import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, Time, UTCTimestamp } from 'lightweight-charts'
import { Rate } from 'types/rate.interface';

interface Props {
  data: Rate[]
  isIncrease: boolean,
  isUserInteractionEnabled: boolean,
  isScalesEnabled: boolean,
}

interface ChartDataPoint {
  time: Time,
  value: number,
}

function Chart(props: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<IChartApi|null>(null)
  const [series, setSeries] = useState<ISeriesApi<"Area">|null>(null)

  useEffect(() => {
    if(ref.current) {
      let newChart = createChart(ref.current, {
        width: ref.current.clientWidth, 
        height: ref.current.clientHeight,
        handleScroll: props.isUserInteractionEnabled ? true : false,
        handleScale: props.isUserInteractionEnabled ? true : false,
        layout: {
          backgroundColor: 'rgba(0,0,0,0)',
          textColor: '#838383',
        },
        grid: {
          vertLines: {
            visible: false,
          },
          horzLines: {
            visible: false,
          },
        },
        leftPriceScale: {
          visible: false,
        },
        rightPriceScale: {
          visible: props.isScalesEnabled ? true : false,
          borderVisible: false,
        },
        timeScale: {
          visible: props.isScalesEnabled ? true : false,
          borderVisible: false,
          fixLeftEdge: true,
        },
        crosshair: {
          vertLine: {
            visible: props.isUserInteractionEnabled ? true : false ,
          },
          horzLine: {
            visible: props.isUserInteractionEnabled ? true : false,
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

      const newSeries = newChart.addAreaSeries({
        topColor: props.isIncrease ? 'rgba(76, 175, 80, 0.56)' : 'rgba(255, 82, 82, 0.56)',
        bottomColor: props.isIncrease ? 'rgba(76, 175, 80, 0.04)' : 'rgba(255, 82, 82, 0.04)',
        lineColor: props.isIncrease ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 82, 82, 1)',
        lineWidth: 2,
        priceLineVisible: false,
        autoscaleInfoProvider: () => ({
          priceRange: {
              minValue: Math.min(...data.map(item => item.value)),
              maxValue: Math.max(...data.map(item => item.value)),
          },
        }),
      });

      newSeries.setData(data)

      newChart.timeScale().fitContent()
      setChart(newChart)
      setSeries(newSeries)
    }
  }, [])

  useEffect(() => {
    var data: ChartDataPoint[] = [];

    props.data.forEach(rate => {
      data.push({
        time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
        value: rate.value
      })
    })
    series?.setData(data)
    chart?.timeScale().fitContent()
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
      <div ref={ref} className="h-full w-full" />
    </>
  )
}

Chart.defaultProps = {
  isUserInteractionEnabled: true,
  isScalesEnabled: true
}

export default Chart