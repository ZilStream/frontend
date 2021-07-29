import React from 'react'
import Shimmer from './Shimmer'

function LoadingProposals() {
  return (
    <div className="bg-white dark:bg-gray-800 px-5 rounded-lg">
      <div className="py-3 mb-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col gap-2">
        <Shimmer className="w-full h-8" />
        <Shimmer className="w-full h-5" />
      </div>
      <div className="pb-3 mb-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col gap-2">
        <Shimmer className="w-full h-8" />
        <Shimmer className="w-full h-5" />
      </div>
      <div className="pb-3 mb-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col gap-2">
        <Shimmer className="w-full h-8" />
        <Shimmer className="w-full h-5" />
      </div>
      <div className="pb-3 mb-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col gap-2">
        <Shimmer className="w-full h-8" />
        <Shimmer className="w-full h-5" />
      </div>
      <div className="pb-3 mb-3 border-b dark:border-gray-700 last:border-b-0 flex flex-col gap-2">
        <Shimmer className="w-full h-8" />
        <Shimmer className="w-full h-5" />
      </div>
    </div>
  )
}

export default LoadingProposals