import React from 'react'
import { Info } from 'react-feather'
import Tippy from '@tippyjs/react'

interface Props {
  value: number
}

const Score = (props: Props) => {
  const ScoreInfo = (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md text-sm">
      <div className="mb-2 font-bold">Viewblock Score</div>
      <div>Based on multiple public metrics, not investment advice.</div>
    </div>
  )

  return (
    <div className="inline-flex items-center mb-2 mr-2 bg-gray-300 dark:bg-gray-800 hover:bg-gray-400 dark:hover:bg-gray-700 px-2 py-1 rounded">
      <span
        className={`
          ${props.value < 20 ? 'text-red-500' : ''}
          ${props.value >= 20 && props.value < 35 ? 'text-yellow-700 dark:text-yellow-600' : ''}
          ${props.value >= 35 && props.value < 50 ? 'text-yellow-500 dark:text-yellow-300' : ''}
          ${props.value >= 50 && props.value < 80 ? 'text-green-500' : ''}
          ${props.value >= 80 ? 'text-green-700' : ''}
          font-medium
        `}
      >
        {props.value}/100
      </span>

      <Tippy content={ScoreInfo}>
        <a href="https://github.com/Ashlar/cryptometa" target="_blank" className="ml-2 focus:outline-none">
          <Info size={14} className="text-gray-500" />
        </a>
      </Tippy>
    </div>
  )
}

export default Score