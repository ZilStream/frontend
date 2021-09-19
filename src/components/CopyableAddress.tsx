import React, { useState } from 'react'

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
        className="text-xs bg-gray-300 dark:bg-gray-800 dark:text-gray-400 rounded px-2 mr-2 focus:outline-none">
        {props.address}
      </button>
      {hoveringAddress && props.showCopy && copiedText}
    </div>
  )
}

export default CopyableAddress