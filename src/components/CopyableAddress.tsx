import React, { useState } from 'react'
import { FileText } from 'react-feather'

interface Props {
  address: string,
  showCopy: boolean
}

const CopyableAddress = (props: Props) => {
  const [hoveringAddress, setHoveringAddress] = useState(false)
  const [copied, setCopied] = useState(false)

  const copiedText = (copied) ? (
    <span className="text-xs text-gray-300 transition">Copied</span>
  ) : (
    <span className="text-xs text-gray-600 transition">Click to copy</span>
  )

  return (
    <div className="flex items-center">
      <button 
        onMouseEnter={() => setHoveringAddress(true)}
        onMouseLeave={() => {
          setHoveringAddress(false)
          setCopied(false)
        }}
        onClick={() => {
          navigator.clipboard.writeText(props.address)
          setCopied(true)
        }}
        className="text-sm py-1 px-2 inline-flex items-center bg-gray-300 dark:bg-gray-800 dark:text-gray-400 rounded focus:outline-none">
        <FileText size={12} className="mr-1" />
        {props.address}
      </button>
      <span className="ml-2">{hoveringAddress && props.showCopy && copiedText}</span>
    </div>
  )
}

export default CopyableAddress