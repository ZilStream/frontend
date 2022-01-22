import React from 'react'

interface Props {
  title: string,
  children: React.ReactNode
  className?: string
}

const Notice = (props: Props) => {
  return (
    <div className={`bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 py-3 md:py-4 px-4 md:px-5 rounded-lg ${props.className}`}>
      <h3 className="text-base mb-1">{props.title}</h3>
      <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">{props.children}</div>
    </div>
  )
}

export default Notice