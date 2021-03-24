import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

interface Props {
  url: string
}

const TokenIcon = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if(!mounted) return null

  return (
    <img src={`${props.url}${(resolvedTheme == 'dark' ? '?t=dark' : '')}`} loading="lazy" />
  )
}

export default TokenIcon