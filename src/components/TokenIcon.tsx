import { useTheme } from 'next-themes'
import React from 'react'

interface Props {
  url: string
}

const TokenIcon = (props: Props) => {
  const { resolvedTheme } = useTheme()

  return (
    <img src={`${props.url}${(resolvedTheme == 'dark' ? '?t=dark' : '')}`} loading="lazy" />
  )
}

export default TokenIcon