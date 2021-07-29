import React from 'react'
import Shimmer from './Shimmer'

function LoadingSpaceHeader() {
  return (
    <div className="flex items-center gap-3 pt-8 pb-4">
      <div className="w-16 h-16 rounded-lg"><Shimmer className="h-full w-full" /></div>
      <div className="flex flex-col gap-1">
        <div><Shimmer className="w-80 h-7" /></div>
        <div><Shimmer className="w-80 h-6" /></div>
      </div>
    </div>
  )
}

export default LoadingSpaceHeader