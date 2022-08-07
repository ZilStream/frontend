import React, { useEffect, useLayoutEffect, useState } from 'react'
import { createChart, IChartApi, ISeriesApi, Time, UTCTimestamp } from 'lightweight-charts'
import { useTheme } from 'next-themes'

interface Props {
  data: {time: string, value: number, value_zil?: number}[],
  isUserInteractionEnabled?: boolean,
  isScalesEnabled?: boolean,
  isZilValue?: boolean
}

export interface ChartDataPoint {
  time: Time,
  value: number,
}

function Chart(props: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const [chart, setChart] = useState<IChartApi|null>(null)
  const [series, setSeries] = useState<ISeriesApi<"Area">|null>(null)
  const {resolvedTheme} = useTheme()

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
            visible: props.isScalesEnabled ? true : false,
            color: resolvedTheme === 'dark' ? 'rgb(41, 51, 65)' : 'rgb(248, 248, 256)'
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

      props.data.sort((a,b) =>  new Date(a.time).getTime()  -  new Date(b.time).getTime())
      props.data.forEach(rate => {
        data.push({
          time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
          value: props.isZilValue ? rate.value_zil! : rate.value
        })
      })

      const isIncrease = data.length > 0 &&  data?.[0].value < data?.[data.length-1].value

      const newSeries = newChart.addAreaSeries({
        topColor: isIncrease ? 'rgba(76, 175, 80, 0.56)' : 'rgba(255, 82, 82, 0.56)',
        bottomColor: isIncrease ? 'rgba(76, 175, 80, 0.04)' : 'rgba(255, 82, 82, 0.04)',
        lineColor: isIncrease ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 82, 82, 1)',
        lineWidth: 2,
        priceLineVisible: false,
        crosshairMarkerVisible: props.isUserInteractionEnabled ? true : false,
        autoscaleInfoProvider: () => ({
          priceRange: {
              minValue: Math.min(...props.data.map(item => props.isZilValue ? item.value_zil! : item.value)),
              maxValue: Math.max(...props.data.map(item => props.isZilValue ? item.value_zil! : item.value)),
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
    if(series) {
      chart?.removeSeries(series)
    }
    
    var data: ChartDataPoint[] = [];
    props.data.sort((a,b) =>  new Date(a.time).getTime()  -  new Date(b.time).getTime())
    props.data.forEach(rate => {
      data.push({
        time: (Date.parse(rate.time) / 1000) as UTCTimestamp,
        value: props.isZilValue ? rate.value_zil! : rate.value
      })
    })

    const isIncrease = data.length > 0 &&  data?.[0].value < data?.[data.length-1].value

    const newSeries = chart?.addAreaSeries({
      topColor: isIncrease ? 'rgba(76, 175, 80, 0.56)' : 'rgba(255, 82, 82, 0.56)',
      bottomColor: isIncrease ? 'rgba(76, 175, 80, 0.04)' : 'rgba(255, 82, 82, 0.04)',
      lineColor: isIncrease ? 'rgba(76, 175, 80, 1)' : 'rgba(255, 82, 82, 1)',
      lineWidth: 2,
      priceLineVisible: false,
      crosshairMarkerVisible: props.isUserInteractionEnabled ? true : false,
      autoscaleInfoProvider: () => ({
        priceRange: {
            minValue: Math.min(...props.data.map(item => props.isZilValue ? item.value_zil! : item.value)),
            maxValue: Math.max(...props.data.map(item => props.isZilValue ? item.value_zil! : item.value)),
        },
      }),
    });

    newSeries?.setData(data)

    if(newSeries) {
      setSeries(newSeries)
    }

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