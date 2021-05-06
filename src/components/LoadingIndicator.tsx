import { useTheme } from 'next-themes'
import React from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

function LoadingIndicator() {
  const {theme, setTheme, resolvedTheme} = useTheme()

  return (
    <Loader
      type="Oval"
      width={20}
      height={20}
      color={resolvedTheme === 'dark' ? '#fefefe' : '#333'}
    />
  )
}

export default LoadingIndicator