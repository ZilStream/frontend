import React from 'react'
import Shimmer from './Shimmer'

function LoadingSpaces() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mt-8">
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
      <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg flex flex-col p-3 items-center">
        <Shimmer className="w-full h-40" />
      </div>
    </div>
  )
}

export default LoadingSpaces