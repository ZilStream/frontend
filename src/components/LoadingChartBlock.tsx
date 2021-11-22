import React from 'react'
import Shimmer from './Shimmer'

const LoadingChartBlock = () => {
  return (
    <div className="h-44 rounded-lg overflow-hidden p-2 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="pt-2 px-2">
        <div className="flex items-center text-xl">
          <div className="flex-grow mb-2 flex items-center">
            <Shimmer className="h-6 w-12 mr-2" />
            <Shimmer className="h-6 w-12" />
          </div>
          <Shimmer className="h-6 w-12" />
        </div>
        <div>
          <Shimmer className="h-6 w-12" />
        </div>
      </div>
      <Shimmer className="mt-4 h-full w-full" />
    </div>
  )
}

export default LoadingChartBlock