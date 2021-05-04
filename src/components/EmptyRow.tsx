import React from 'react'

interface Props {
  message: string
}

function EmptyRow(props: Props) {
  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg text-sm text-gray-500">
      {props.message}
    </div>
  )
}

export default EmptyRow