import React from 'react'
import Shimmer from './Shimmer'

const LoadingTransactions = () => {
  return (
    <>
      <div className="flex items-str text-sm border-b dark:border-gray-700 last:border-b-0">
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="flex-grow px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-36 px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
      </div>
      <div className="flex items-str text-sm border-b dark:border-gray-700 last:border-b-0">
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="flex-grow px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-36 px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
      </div>
      <div className="flex items-str text-sm border-b dark:border-gray-700 last:border-b-0">
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-24 px-2 py-3 font-medium">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="flex-grow px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
        <div className="w-36 px-2 py-3 font-normal text-right">
          <Shimmer className="h-10 w-full" />
        </div>
      </div>
    </>
  )
}

export default LoadingTransactions