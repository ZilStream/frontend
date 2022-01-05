import React, { useState } from 'react'
import { FileText } from 'react-feather'

interface Props {
  address: string,
  showCopy: boolean
}

const CopyableAddress = (props: Props) => {
  return (
    <div className="flex items-center">
      <button 
        onClick={() => {
          navigator.clipboard.writeText(props.address)
        }}
        className="text-sm py-1 px-2 inline-flex items-center bg-gray-300 dark:bg-gray-800 dark:text-gray-200 rounded focus:outline-none">
        <FileText size={12} className="mr-1" />
        {props.address}
      </button>
    </div>
  )
}

export default CopyableAddress