import React from 'react'

const LoadingChartBlock = () => {
  return (
    <div className="h-64 rounded-lg overflow-hidden p-2 shadow bg-white dark:bg-gray-800 text-black dark:text-white relative flex flex-col">
      <div className="pt-2 px-2">
        <div className="flex items-center text-xl">
          <div className="flex-grow mb-2 flex items-center">
            <div className="h-6 w-12 mr-2 rounded shimmer"></div>
            <div className="h-6 w-12 rounded shimmer"></div>
          </div>
          <div className="h-6 w-12 rounded shimmer"></div>
        </div>
        <div>
          <div className="h-6 w-12 rounded shimmer"></div>
        </div>
      </div>
      <div className="mt-4 h-full w-full rounded shimmer"></div>
    </div>
  )
}

export default LoadingChartBlock