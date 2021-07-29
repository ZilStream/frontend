import React from 'react'
import Shimmer from './Shimmer'

function LoadingProposal() {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Shimmer className="h-6 w-10" />
        <Shimmer className="h-6 w-96" />
      </div>
      <div className="flex flex-col md:flex-row items-stretch md:items-start gap-4">
        <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg flex-grow">
          <Shimmer className="h-96 w-full" />
        </div>
        <div className="bg-white dark:bg-gray-800 py-4 px-5 rounded-lg md:w-80 md:flex-grow-0 md:flex-shrink-0 flex flex-col gap-3">
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-12 w-full" />
          <Shimmer className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export default LoadingProposal