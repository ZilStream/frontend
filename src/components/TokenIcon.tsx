import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'

interface Props {
  url?: string
  address?: string
}

const TokenIcon = (props: Props) => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  if(!mounted) return null

  if(props.address) {
    if(props.address === 'zil1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq9yf6pz') {
      return (
        <img src={`https://meta.viewblock.io/ZIL/logo${(resolvedTheme == 'dark' ? '?t=dark' : '')}`} loading="lazy" />
      )
    }
    return (
      <img src={`https://meta.viewblock.io/ZIL.${props.address}/logo${(resolvedTheme == 'dark' ? '?t=dark' : '')}`} loading="lazy" />
    )
  }

  return (
    <img src={`${props.url}${(resolvedTheme == 'dark' ? '?t=dark' : '')}`} loading="lazy" />
  )
}

export default TokenIcon