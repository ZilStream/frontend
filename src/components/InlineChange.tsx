import React from 'react'
import { ChevronDown, ChevronUp, Triangle } from 'react-feather'
import { numberFormat } from 'utils/format'

interface Props {
  num: number
  bold?: boolean
  className?: string
}

const InlineChange = (props: Props) => {
  const { num } = props
  const isPositive = num > 0
  const isNeutral = num === 0
  const isNegative = num < 0
  return <span className={`inline-flex items-center ${props.bold && 'font-semibold'} ${isPositive && 'text-green-600 dark:text-green-500'}  ${isNegative && 'text-red-600 dark:text-red-500'} ${props.className ?? ""}`}>
    {isPositive &&
      <Triangle size={7} strokeWidth={3} className="fill-current mr-1" />
    }

    {isNegative &&
      <Triangle size={7} strokeWidth={3} className="fill-current transform rotate-180 mr-1" />
    }
    
    {numberFormat(Math.abs(num))}%
  </span>
}

export default InlineChange