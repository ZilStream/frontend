import React from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { numberFormat } from 'utils/format'

interface Props {
  num: number
}

const InlineChange = (props: Props) => {
  const { num } = props
  const isPositive = num > 0
  const isNeutral = num === 0
  const isNegative = num < 0
  return <span className={`inline-flex items-center font-semibold ${num >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
    {isPositive &&
      <ChevronUp size={14} strokeWidth={3} />
    }

    {isNegative &&
      <ChevronDown size={14} strokeWidth={3} />
    }
    
    {numberFormat(Math.abs(num))}%
  </span>
}

export default InlineChange