import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

interface Props {
  className?: string
}

const Shimmer = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const {theme, setTheme, resolvedTheme} = useTheme()

  useEffect(() => setMounted(true), [])

  if(!mounted) return null

  if(resolvedTheme === 'dark') {
    return<div className={`${props.className} rounded dark-shimmer`}></div>
  }

  return <div className={`${props.className} rounded shimmer`}></div>
}

export default Shimmer